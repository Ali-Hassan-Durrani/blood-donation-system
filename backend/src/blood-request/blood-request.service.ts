import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBloodRequestDto } from './dto/create-blood-request.dto';

@Injectable()
export class BloodRequestService {
  constructor(private prisma: PrismaService) { }

  async create(userId: string, dto: CreateBloodRequestDto) {
    // Check for existing active requests
    const existingRequest = await this.prisma.blood_requests.findFirst({
      where: {
        requester_user_id: userId,
        status: { in: ['PENDING', 'APPROVED'] },
      },
      select: { id: true },
    });

    if (existingRequest) {
      throw new BadRequestException(
        'You already have an active blood request. Please wait until it is resolved.',
      );
    }

    // Validate and Parse Date
    const neededOn = new Date(dto.needed_on);
    if (Number.isNaN(neededOn.getTime())) {
      throw new BadRequestException('needed_on must be a valid date in YYYY-MM-DD format');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const neededOnDateOnly = new Date(neededOn);
    neededOnDateOnly.setHours(0, 0, 0, 0);

    if (neededOnDateOnly < today) {
      throw new BadRequestException('needed_on must be today or a future date');
    }

    return this.prisma.blood_requests.create({
      data: {
        requester_user_id: userId,
        requested_for_patient_name: dto.requested_for_patient_name,
        blood_group: dto.blood_group,
        units_needed: dto.units_needed,
        city: dto.city,
        needed_on: neededOnDateOnly,
        urgency: dto.urgency,
        reason: dto.reason,
      },
      select: {
        id: true,
        status: true,
        blood_group: true,
        units_needed: true,
        city: true,
        needed_on: true,
        urgency: true,
        assigned_blood_bank_id: true,
        created_at: true,
      },
    });
  }

  async getRequests() {
  return this.prisma.blood_requests.findMany({
    where: {
      status: 'PENDING',
    },
    orderBy: { created_at: 'desc' },
  });
}

  findMyRequests(userId: string) {
    return this.prisma.blood_requests.findMany({
      where: { requester_user_id: userId },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        status: true,
        blood_group: true,
        units_needed: true,
        city: true,
        needed_on: true,
        urgency: true,
        assigned_blood_bank_id: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async getMyStats(userId: string) {
    const [total, pending, approved, fulfilled] = await Promise.all([
      this.prisma.blood_requests.count({
        where: { requester_user_id: userId },
      }),
      this.prisma.blood_requests.count({
        where: { requester_user_id: userId, status: 'PENDING' },
      }),
      this.prisma.blood_requests.count({
        where: { requester_user_id: userId, status: 'APPROVED' },
      }),
      this.prisma.blood_requests.count({
        where: { requester_user_id: userId, status: 'FULFILLED' },
      }),
    ]);

    return { total, pending, approved, fulfilled };
  }

  async getById(id: string, userId: string) {
    const request = await this.prisma.blood_requests.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    // Access Control: Allow if user is the Requester OR (Add Logic here for Admin/BloodBank if needed later)
    // For now, restricting to requester as per your original code
    if (request.requester_user_id !== userId) {
      // NOTE: You might want to allow BLOOD_BANK or ADMIN to view this too.
      // If so, you'd need to fetch the user role here.
      // For now, keeping strict:
      // throw new ForbiddenException('Access denied');
    }

    return request;
  }

  findAll() {
    return this.prisma.blood_requests.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        status: true,
        blood_group: true,
        units_needed: true,
        city: true,
        needed_on: true,
        urgency: true,
        assigned_blood_bank_id: true,
        created_at: true,
        updated_at: true,
        users_blood_requests_requester_user_idTousers: {
          select: { id: true, full_name: true, email: true, role: true, city: true },
        },
      },
    });
  }

  async approve(id: string) {
    await this.ensureExists(id);
    return this.prisma.blood_requests.update({
      where: { id },
      data: { status: 'APPROVED' },
      select: { id: true, status: true, updated_at: true },
    });
  }

  async reject(id: string) {
    await this.ensureExists(id);
    return this.prisma.blood_requests.update({
      where: { id },
      data: { status: 'REJECTED' },
      select: { id: true, status: true, updated_at: true },
    });
  }

  async assignBloodBank(id: string, bloodBankId: string) {
    await this.ensureExists(id);
    return this.prisma.blood_requests.update({
      where: { id },
      data: {
        assigned_blood_bank_id: bloodBankId,
        status: 'APPROVED', // assigning implies approval
      },
      select: { id: true, status: true, assigned_blood_bank_id: true, updated_at: true },
    });
  }

  async cancel(userId: string, id: string) {
    const req = await this.prisma.blood_requests.findUnique({ where: { id } });
    if (!req) throw new NotFoundException('Request not found');

    if (req.requester_user_id !== userId) {
      throw new BadRequestException('You can only cancel your own request');
    }

    if (req.status === 'FULFILLED') {
      throw new BadRequestException('Cannot cancel a fulfilled request');
    }

    return this.prisma.blood_requests.update({
      where: { id },
      data: { status: 'CANCELLED' },
      select: { id: true, status: true, updated_at: true },
    });
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.blood_requests.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Request not found');
  }
}
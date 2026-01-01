import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSeekerProfileDto } from './dto/create-seeker-profile.dto';
import { CreateBloodRequestDto } from './dto/create-blood-request.dto';

@Injectable()
export class SeekerService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------
  // CREATE SEEKER PROFILE
  // ----------------------------------------
  async createProfile(userId: string, dto: CreateSeekerProfileDto) {
    const exists = await this.prisma.seeker_profiles.findUnique({
      where: { user_id: userId },
    });

    if (exists) {
      throw new BadRequestException('Seeker profile already exists');
    }

    return this.prisma.seeker_profiles.create({
      data: {
        user_id: userId,
        identity_cnic: dto.identity_cnic,
        emergency_contact: dto.emergency_contact,
      },
    });
  }

  // ----------------------------------------
  // GET SEEKER PROFILE
  // ----------------------------------------
  getMyProfile(userId: string) {
    return this.prisma.seeker_profiles.findUnique({
      where: { user_id: userId },
    });
  }

  // ----------------------------------------
  // CREATE BLOOD REQUEST
  // ----------------------------------------
  async createBloodRequest(userId: string, dto: CreateBloodRequestDto) {
    const activeRequest = await this.prisma.blood_requests.findFirst({
      where: {
        requester_user_id: userId,
        status: { in: ['PENDING', 'APPROVED'] },
      },
    });

    if (activeRequest) {
      throw new BadRequestException(
        'You already have an active blood request',
      );
    }

    const neededOn = new Date(dto.needed_on);
    if (isNaN(neededOn.getTime())) {
      throw new BadRequestException('Invalid needed_on date');
    }

    return this.prisma.blood_requests.create({
      data: {
        requester_user_id: userId,
        requested_for_patient_name: dto.requested_for_patient_name,
        blood_group: dto.blood_group as any,
        units_needed: dto.units_needed,
        city: dto.city,
        needed_on: neededOn,
        urgency: dto.urgency as any,
        reason: dto.reason,
      },
    });
  }

  // ----------------------------------------
  // CANCEL BLOOD REQUEST
  // ----------------------------------------
  async cancelBloodRequest(userId: string, requestId: string) {
    const request = await this.prisma.blood_requests.findUnique({
      where: { id: requestId },
    });

    if (!request || request.requester_user_id !== userId) {
      throw new BadRequestException('Blood request not found');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException(
        'Only pending requests can be cancelled',
      );
    }

    return this.prisma.blood_requests.update({
      where: { id: requestId },
      data: { status: 'CANCELLED' },
    });
  }

  // ----------------------------------------
  // VIEW REQUEST HISTORY
  // ----------------------------------------
  getMyRequests(userId: string) {
    return this.prisma.blood_requests.findMany({
      where: { requester_user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }
}
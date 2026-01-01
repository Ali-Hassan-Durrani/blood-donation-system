import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { request_status } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class BloodBankService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private audit: AuditService,
  ) {}

  async getProfile(userId: string) {
    return this.prisma.blood_bank_profiles.findUnique({
      where: { user_id: userId },
    });
  }

  async createProfile(userId: string, dto: any) {
    const exists = await this.prisma.blood_bank_profiles.findUnique({
      where: { user_id: userId },
    });

    if (exists) {
      throw new BadRequestException('Blood bank profile already exists');
    }

    return this.prisma.blood_bank_profiles.create({
      data: {
        user_id: userId,
        bank_name: dto.bank_name,
        license_no: dto.license_no,
        address: dto.address,
      },
    });
  }

  async addInventoryLot(bloodBankId: string, dto: any) {
    const expiry = new Date(dto.expires_on);
    expiry.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (expiry <= today) {
      throw new BadRequestException('Expiry date must be in the future');
    }

    return this.prisma.inventory_lots.create({
      data: {
        blood_bank_id: bloodBankId,
        blood_group: dto.blood_group,
        units_available: dto.units_available,
        expires_on: expiry,
      },
    });
  }

  async updateInventoryLot(bloodBankId: string, lotId: string, dto: any) {
    const lot = await this.prisma.inventory_lots.findFirst({
      where: { id: lotId, blood_bank_id: bloodBankId },
    });
    if (!lot) throw new NotFoundException('Inventory lot not found');

    return this.prisma.inventory_lots.update({
      where: { id: lotId },
      data: {
        units_available: dto.units_available ?? undefined,
        expires_on: dto.expires_on ? new Date(dto.expires_on) : undefined,
      },
    });
  }

  async deleteInventoryLot(bloodBankId: string, lotId: string) {
    const lot = await this.prisma.inventory_lots.findFirst({
      where: { id: lotId, blood_bank_id: bloodBankId },
    });
    if (!lot) throw new NotFoundException('Inventory lot not found');

    return this.prisma.inventory_lots.delete({ where: { id: lotId } });
  }

  getMyInventory(bloodBankId: string) {
    return this.prisma.inventory_lots.findMany({
      where: { blood_bank_id: bloodBankId },
      orderBy: { expires_on: 'asc' },
    });
  }

  async getSummary(bloodBankId: string) {
    const lots = await this.prisma.inventory_lots.findMany({
      where: { blood_bank_id: bloodBankId },
    });

    const summary: Record<string, number> = {};
    for (const lot of lots) {
      summary[lot.blood_group] = (summary[lot.blood_group] || 0) + lot.units_available;
    }
    return summary;
  }

  async getRequests(bloodBankId: string, status?: string, city?: string) {
    return this.prisma.blood_requests.findMany({
      where: {
        AND: [
          {
            OR: [
              { assigned_blood_bank_id: bloodBankId },
              { assigned_blood_bank_id: null, status: request_status.PENDING },
            ],
          },
          status
            ? { status: status as request_status }
            : { status: { in: [request_status.PENDING, request_status.APPROVED] } },
          city ? { city: { contains: city, mode: 'insensitive' } } : {},
        ],
      },
      orderBy: { created_at: 'desc' },
      include: {
        users_blood_requests_requester_user_idTousers: {
          select: { full_name: true, phone: true, city: true },
        },
      },
    });
  }

  async getAvailableDonors(blood_group?: string, city?: string) {
    if (!blood_group) throw new BadRequestException('blood_group is required');

    // Your frontend sends "A_POS" already; keep normalization safe anyway.
    const normalizedBloodGroup = blood_group
      .replace('+', '_POS')
      .replace('-', '_NEG');

    return this.prisma.donor_profiles.findMany({
      where: {
        blood_group: normalizedBloodGroup as any,
        is_available: true,
        // If you want to enable city filter later:
        // users: city ? { city: { equals: city, mode: 'insensitive' } } : undefined,
      },
      include: {
        users: { select: { id: true, full_name: true, phone: true, city: true } },
      },
      orderBy: { last_donation_date: 'asc' },
      take: 50,
    });
  }

  async assignDonor(bloodBankUserId: string, dto: any) {
    // Get request (needed for requester_user_id & blood group)
    const req = await this.prisma.blood_requests.findUnique({
      where: { id: dto.request_id },
    });
    if (!req) throw new NotFoundException('Request not found');

    // Check donor availability
    const donor = await this.prisma.donor_profiles.findUnique({
      where: { user_id: dto.donor_user_id },
    });
    if (!donor) throw new NotFoundException('Donor not found');
    if (!donor.is_available) throw new BadRequestException('Donor is not available');

    // Create donation
    const donation = await this.prisma.donations.create({
      data: {
        donor_user_id: dto.donor_user_id,
        request_id: dto.request_id,
        blood_bank_id: bloodBankUserId,
        scheduled_on: new Date(dto.scheduled_on),
        status: 'SCHEDULED',
        notes: dto.notes || 'Assigned by blood bank',
      },
    });

    // Mark request as APPROVED + assigned
    await this.prisma.blood_requests.update({
      where: { id: dto.request_id },
      data: {
        assigned_blood_bank_id: bloodBankUserId,
        status: request_status.APPROVED,
      },
    });

    // ✅ Notify donor
    await this.notifications.create({
      user_id: dto.donor_user_id,
      title: 'Donation Assigned',
      message: 'You have been assigned a blood donation. Please visit the blood bank.',
    });

    // ✅ Notify requester (seeker/hospital)
    await this.notifications.create({
      user_id: req.requester_user_id,
      title: 'Donor Assigned',
      message: 'A donor has been assigned to your blood request.',
    });

        await this.audit.log({
      actor_user_id: bloodBankUserId,
      action: 'ASSIGN_DONOR',
      entity_type: 'blood_request',
      entity_id: dto.request_id,
    });
    return donation;
  }

  getBloodBankDonations(bloodBankId: string) {
    return this.prisma.donations.findMany({
      where: { blood_bank_id: bloodBankId },
      orderBy: { created_at: 'desc' },
    });
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteDonationDto } from './dto/complete-donation.dto';
import { ScheduleDonationDto } from './dto/schedule-donation.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditService } from '../audit/audit.service';
import { request_status } from '@prisma/client';

@Injectable()
export class DonationsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private audit: AuditService,
  ) {}

  // ======================================================
  // SCHEDULE DONATION
  // BLOOD_BANK / HOSPITAL
  // ======================================================
  async scheduleDonation(dto: ScheduleDonationDto) {
    const scheduled = new Date(dto.scheduled_on);
    if (isNaN(scheduled.getTime())) {
      throw new BadRequestException('Invalid scheduled_on date');
    }

    const donor = await this.prisma.donor_profiles.findUnique({
      where: { user_id: dto.donor_user_id },
    });
    if (!donor) throw new BadRequestException('Donor profile not found');

    // 90-day cooldown check
    if (donor.last_donation_date) {
      const diffDays =
        (Date.now() - donor.last_donation_date.getTime()) /
        (1000 * 60 * 60 * 24);

      if (diffDays < 90) {
        throw new BadRequestException('Donor is in 90-day cooldown period');
      }
    }

    return this.prisma.donations.create({
      data: {
        donor_user_id: dto.donor_user_id,
        request_id: dto.request_id,
        blood_bank_id: dto.blood_bank_id,
        hospital_id: dto.hospital_id,
        scheduled_on: scheduled,
        notes: dto.notes,
        status: 'SCHEDULED',
      },
    });
  }

  // ======================================================
  // COMPLETE DONATION
  // BLOOD_BANK ONLY
  // ======================================================
  async completeDonation(dto: CompleteDonationDto) {
    const donation = await this.prisma.donations.findUnique({
      where: { id: dto.donation_id },
      include: {
        blood_requests: true,
      },
    });

    if (!donation) throw new NotFoundException('Donation not found');
    if (donation.status !== 'SCHEDULED') {
      throw new BadRequestException('Only scheduled donations can be completed');
    }
    if (!donation.blood_bank_id) {
      throw new BadRequestException('Blood bank required to complete donation');
    }

    // 1️⃣ Mark completed
    await this.prisma.donations.update({
      where: { id: donation.id },
      data: {
        status: 'COMPLETED',
        completed_at: new Date(),
      },
    });

    // 2️⃣ Update donor cooldown
    await this.prisma.donor_profiles.update({
      where: { user_id: donation.donor_user_id },
      data: { last_donation_date: new Date() },
    });

    // 3️⃣ If donation is linked to a request, fulfill it + inventory + notify
    if (donation.request_id && donation.blood_requests) {
      // ✅ Fulfill request
      await this.prisma.blood_requests.update({
        where: { id: donation.request_id },
        data: { status: request_status.FULFILLED, updated_at: new Date() },
      });

      // ✅ Create inventory lot (use request blood group)
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 42);

      await this.prisma.inventory_lots.create({
        data: {
          blood_bank_id: donation.blood_bank_id,
          blood_group: donation.blood_requests.blood_group,
          units_available: dto.units_collected,
          expires_on: expiry,
        },
      });

      // ✅ Notify requester (seeker/hospital)
      await this.notifications.create({
        user_id: donation.blood_requests.requester_user_id,
        title: 'Blood Request Fulfilled',
        message: 'Your blood request has been successfully fulfilled.',
      });
    }

    // ✅ Notify donor too (optional but useful)
    await this.notifications.create({
      user_id: donation.donor_user_id,
      title: 'Donation Completed',
      message: 'Thank you! Your donation has been marked as completed.',
    });

        await this.audit.log({
      actor_user_id: donation.blood_bank_id!,
      action: 'COMPLETE_DONATION',
      entity_type: 'donation',
      entity_id: donation.id,
    });

    return { message: 'Donation completed successfully' };
  }

  // ======================================================
  // CANCEL DONATION
  // ======================================================
  async cancelDonation(donationId: string) {
    const donation = await this.prisma.donations.findUnique({
      where: { id: donationId },
    });
    if (!donation) throw new NotFoundException('Donation not found');
    if (donation.status !== 'SCHEDULED') {
      throw new BadRequestException('Only scheduled donations can be cancelled');
    }

    return this.prisma.donations.update({
      where: { id: donationId },
      data: { status: 'CANCELLED' },
    });
  }

  // ======================================================
  // VIEW HELPERS
  // ======================================================
  getDonorDonations(donorId: string) {
    return this.prisma.donations.findMany({
      where: { donor_user_id: donorId },
      orderBy: { created_at: 'desc' },
    });
  }

  getBloodBankDonations(bloodBankId: string) {
    return this.prisma.donations.findMany({
      where: { blood_bank_id: bloodBankId },
      orderBy: { created_at: 'desc' },
    });
  }

  async myDonations(userId: string) {
    return this.prisma.donations.findMany({
      where: { donor_user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async myStats(userId: string) {
    const [total, scheduled, completed, cancelled] = await Promise.all([
      this.prisma.donations.count({ where: { donor_user_id: userId } }),
      this.prisma.donations.count({ where: { donor_user_id: userId, status: 'SCHEDULED' } }),
      this.prisma.donations.count({ where: { donor_user_id: userId, status: 'COMPLETED' } }),
      this.prisma.donations.count({ where: { donor_user_id: userId, status: 'CANCELLED' } }),
    ]);

    return { total, scheduled, completed, cancelled };
  }

  async incomingRequests(userId: string) {
    return this.prisma.donations.findMany({
      where: { donor_user_id: userId, status: 'SCHEDULED' },
      orderBy: { scheduled_on: 'asc' },
      include: { blood_requests: true },
    });
  }

  async acceptDonation(userId: string, donationId: string) {
    const donation = await this.prisma.donations.findUnique({
      where: { id: donationId },
    });
    if (!donation) throw new NotFoundException('Donation not found');
    if (donation.donor_user_id !== userId) throw new ForbiddenException('Access denied');

    // Optional: notify blood bank that donor accepted
    if (donation.blood_bank_id) {
      await this.notifications.create({
        user_id: donation.blood_bank_id,
        title: 'Donor Accepted',
        message: 'A donor has accepted the donation request.',
      });
    }

    return this.prisma.donations.update({
      where: { id: donationId },
      data: { notes: donation.notes || 'Accepted by donor' },
    });
  }

  async rejectDonation(userId: string, donationId: string) {
    const donation = await this.prisma.donations.findUnique({
      where: { id: donationId },
    });
    if (!donation) throw new NotFoundException('Donation not found');
    if (donation.donor_user_id !== userId) throw new ForbiddenException('Access denied');

    // Optional: notify blood bank that donor rejected
    if (donation.blood_bank_id) {
      await this.notifications.create({
        user_id: donation.blood_bank_id,
        title: 'Donor Rejected',
        message: 'A donor rejected the donation request.',
      });
    }

    return this.prisma.donations.update({
      where: { id: donationId },
      data: { status: 'CANCELLED', notes: 'Rejected by donor' },
    });
  }
}

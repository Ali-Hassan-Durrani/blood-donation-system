import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDonorProfileDto } from './dto/create-donor-profile.dto';
import { UpdateDonorProfileDto } from './dto/update-donor-profile.dto';

@Injectable()
export class DonorService {
  constructor(private prisma: PrismaService) {}

  async createProfile(userId: string, dto: CreateDonorProfileDto) {
    const exists = await this.prisma.donor_profiles.findUnique({
      where: { user_id: userId },
    });

    if (exists) {
      throw new BadRequestException('Donor profile already exists');
    }

    const dob = new Date(dto.date_of_birth);
    const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

    if (age < 18) {
      throw new BadRequestException('Donor must be at least 18 years old');
    }

    return this.prisma.donor_profiles.create({
      data: {
        user_id: userId,
        blood_group: dto.blood_group,
        date_of_birth: dob,
        weight_kg: dto.weight_kg,
        medical_notes: dto.medical_notes,
        is_available: false,
      },
    });
  }

  async getMyProfile(userId: string) {
    return this.prisma.donor_profiles.findUnique({
      where: { user_id: userId },
    });
  }

  async updateProfile(userId: string, dto: UpdateDonorProfileDto) {
    const profile = await this.getMyProfile(userId);
    if (!profile) throw new NotFoundException('Donor profile not found');

    let dob: Date | undefined;
    if (dto.date_of_birth) {
      dob = new Date(dto.date_of_birth);
      const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 18) throw new BadRequestException('Donor must be at least 18 years old');
    }

    return this.prisma.donor_profiles.update({
      where: { user_id: userId },
      data: {
        blood_group: dto.blood_group ?? undefined,
        date_of_birth: dob ?? undefined,
        weight_kg: dto.weight_kg ?? undefined,
        medical_notes: dto.medical_notes ?? undefined,
      },
    });
  }

  async getAvailability(userId: string) {
    const profile = await this.prisma.donor_profiles.findUnique({
      where: { user_id: userId },
      select: { is_available: true },
    });

    return profile ?? { is_available: false };
  }

  async updateAvailability(userId: string, isAvailable: boolean) {
    const donor = await this.getMyProfile(userId);
    if (!donor) throw new NotFoundException('Donor profile not found. Please create profile first.');

    if (isAvailable && donor.last_donation_date) {
      const diffDays =
        (Date.now() - donor.last_donation_date.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays < 90) {
        throw new BadRequestException('Donor is in cooldown period (90 days after last donation)');
      }
    }

    return this.prisma.donor_profiles.update({
      where: { user_id: userId },
      data: { is_available: isAvailable },
      select: { is_available: true },
    });
  }
}
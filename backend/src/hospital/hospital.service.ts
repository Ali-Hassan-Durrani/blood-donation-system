import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHospitalProfileDto } from './dto/create-hospital-profile.dto';

@Injectable()
export class HospitalService {
  constructor(private prisma: PrismaService) {}

  // --------------------------------------------------
  // CREATE HOSPITAL PROFILE (ONCE)
  // --------------------------------------------------
  async createProfile(userId: string, dto: CreateHospitalProfileDto) {
    const exists = await this.prisma.hospital_profiles.findUnique({
      where: { user_id: userId },
    });

    if (exists) {
      throw new BadRequestException('Hospital profile already exists');
    }

    return this.prisma.hospital_profiles.create({
      data: {
        user_id: userId,
        hospital_name: dto.hospital_name,
        license_no: dto.license_no,
        address: dto.address,
      },
    });
  }

  // --------------------------------------------------
  // VIEW OWN PROFILE
  // --------------------------------------------------
  getMyProfile(userId: string) {
    return this.prisma.hospital_profiles.findUnique({
      where: { user_id: userId },
    });
  }

  // --------------------------------------------------
  // VIEW HOSPITAL DONATIONS
  // --------------------------------------------------
  getMyDonations(userId: string) {
    return this.prisma.donations.findMany({
      where: { hospital_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  // --------------------------------------------------
  // VIEW HOSPITAL BLOOD REQUESTS
  // --------------------------------------------------
  getMyRequests(userId: string) {
    return this.prisma.blood_requests.findMany({
      where: { requester_user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }
}

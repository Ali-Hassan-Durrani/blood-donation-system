import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateHospitalProfileDto } from './dto/create-hospital-profile.dto';

@Controller('hospital')
export class HospitalController {
  constructor(private service: HospitalService) {}

  // Create profile
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('HOSPITAL')
  @Post('profile')
  createProfile(@Req() req: any, @Body() dto: CreateHospitalProfileDto) {
    return this.service.createProfile(req.user.userId, dto);
  }

  // View profile
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('HOSPITAL')
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.service.getMyProfile(req.user.userId);
  }

  // View donations
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('HOSPITAL')
  @Get('donations')
  getDonations(@Req() req: any) {
    return this.service.getMyDonations(req.user.userId);
  }

  // View blood requests
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('HOSPITAL')
  @Get('requests')
  getRequests(@Req() req: any) {
    return this.service.getMyRequests(req.user.userId);
  }
}

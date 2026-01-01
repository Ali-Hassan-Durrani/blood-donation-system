import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ScheduleDonationDto } from './dto/schedule-donation.dto';
import { CompleteDonationDto } from './dto/complete-donation.dto';

@Controller('donations')
export class DonationsController {
  constructor(private service: DonationsService) {}

  // Schedule donation
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('BLOOD_BANK', 'HOSPITAL')
  @Post('schedule')
  schedule(@Body() dto: ScheduleDonationDto) {
    return this.service.scheduleDonation(dto);
  }

  // Complete donation
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('BLOOD_BANK')
  @Post('complete')
  complete(@Body() dto: CompleteDonationDto) {
    return this.service.completeDonation(dto);
  }

  // Cancel donation
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('BLOOD_BANK', 'HOSPITAL')
  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.service.cancelDonation(id);
  }

  // Donor view own donations
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('DONOR')
  @Get('me')
  myDonations(@Req() req: any) {
    return this.service.getDonorDonations(req.user.userId);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('DONOR')
  @Get('my/stats')
  myStats(@Req() req: any) {
    return this.service.myStats(req.user.userId);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('DONOR')
  @Get('requests')
  incomingRequests(@Req() req: any) {
    return this.service.incomingRequests(req.user.userId);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('DONOR')
  @Patch(':id/accept')
  accept(@Req() req: any, @Param('id') id: string) {
    return this.service.acceptDonation(req.user.userId, id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('DONOR')
  @Patch(':id/reject')
  reject(@Req() req: any, @Param('id') id: string) {
    return this.service.rejectDonation(req.user.userId, id);
  }
}

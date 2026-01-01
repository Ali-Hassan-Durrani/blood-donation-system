import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { DonorService } from './donor.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateDonorProfileDto } from './dto/create-donor-profile.dto';
import { UpdateDonorProfileDto } from './dto/update-donor-profile.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@Controller('donor')
@UseGuards(JwtGuard, RolesGuard)
@Roles('DONOR')
export class DonorController {
  constructor(private service: DonorService) {}

  @Post('profile')
  createProfile(@Req() req: any, @Body() dto: CreateDonorProfileDto) {
    return this.service.createProfile(req.user.userId, dto);
  }

  @Get('profile')
  getMyProfile(@Req() req: any) {
    return this.service.getMyProfile(req.user.userId);
  }

  // ✅ FIX: frontend uses PATCH when profile exists
  @Patch('profile')
  updateProfile(@Req() req: any, @Body() dto: UpdateDonorProfileDto) {
    return this.service.updateProfile(req.user.userId, dto);
  }

  @Get('me')
  getMe(@Req() req: any) {
    return this.service.getAvailability(req.user.userId);
  }

  @Patch('availability')
  updateAvailability(@Req() req: any, @Body() dto: UpdateAvailabilityDto) {
    return this.service.updateAvailability(req.user.userId, dto.is_available);
  }
}

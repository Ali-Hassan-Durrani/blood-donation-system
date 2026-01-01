import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('analytics/requests')
getRequestAnalytics() {
  return this.adminService.requestAnalytics();
}

@Get('analytics/donations')
getDonationAnalytics() {
  return this.adminService.donationAnalytics();
}

 // ✅ NEW: Get recent requests with limit
  @Get('requests')
  getRequests(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : undefined;
    return this.adminService.getRecentRequests(limitNum);
  }

  // ✅ NEW: Get recent donations with limit
  @Get('donations')
  getDonations(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : undefined;
    return this.adminService.getRecentDonations(limitNum);
  }

}

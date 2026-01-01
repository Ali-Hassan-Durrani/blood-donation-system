import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BloodBankService } from './blood-bank.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AddInventoryDto } from './dto/add-inventory.dto';
import { AssignDonorDto } from './dto/assign-donor.dto';

@Controller('blood-bank')
export class BloodBankController {
  constructor(private service: BloodBankService) { }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('BLOOD_BANK')
  @Get('profile')
  async getProfile(@Req() req: any) {
    return this.service.getProfile(req.user.userId);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('BLOOD_BANK')
  @Post('profile')
  async createProfile(@Req() req: any, @Body() dto: any) {
    return this.service.createProfile(req.user.userId, dto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('BLOOD_BANK')
  @Get('inventory-lots')
  getLots(@Req() req: any) {
    return this.service.getMyInventory(req.user.userId);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('BLOOD_BANK')
  @Post('inventory-lots')
  addLot(@Req() req: any, @Body() dto: AddInventoryDto) {
    return this.service.addInventoryLot(req.user.userId, dto);
  }

  // ✅ NEW: Edit inventory lot
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('BLOOD_BANK')
  @Patch('inventory-lots/:id')
  editLot(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    return this.service.updateInventoryLot(req.user.userId, id, dto);
  }

  // ✅ NEW: Delete inventory lot
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('BLOOD_BANK')
  @Delete('inventory-lots/:id')
  deleteLot(@Req() req: any, @Param('id') id: string) {
    return this.service.deleteInventoryLot(req.user.userId, id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('BLOOD_BANK')
  @Get('inventory-summary')
  getSummary(@Req() req: any) {
    return this.service.getSummary(req.user.userId);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('BLOOD_BANK')
  @Get('requests')
  getRequests(
    @Req() req: any,
    @Query('status') status: string,
    @Query('city') city: string,
  ) {
    return this.service.getRequests(req.user.userId, status, city);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('BLOOD_BANK')
  @Get('donors')
  getAvailableDonors(
    @Query('blood_group') blood_group: string,
    @Query('city') city: string,
  ) {
    return this.service.getAvailableDonors(blood_group, city);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('BLOOD_BANK')
  @Post('assign-donor')
  assignDonor(@Req() req: any, @Body() dto: AssignDonorDto) {
    return this.service.assignDonor(req.user.userId, dto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('BLOOD_BANK')
  @Get('donations')
  getDonations(@Req() req: any) {
    return this.service.getBloodBankDonations(req.user.userId);
  }
}
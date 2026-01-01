import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { BloodRequestService } from './blood-request.service';
import { CreateBloodRequestDto } from './dto/create-blood-request.dto';
import { AssignBloodBankDto } from './dto/assign-blood-bank.dto';

@Controller('blood-requests')
export class BloodRequestController {
  constructor(private service: BloodRequestService) { }

  // 1. Create Request (SEEKER or HOSPITAL)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('SEEKER', 'HOSPITAL')
  @Post()
  create(@Req() req, @Body() dto: CreateBloodRequestDto) {
    return this.service.create(req.user.userId, dto);
  }

  // 2. View My Requests (Any logged-in user)
  @UseGuards(JwtGuard)
  @Get('me')
  getMy(@Req() req: any) {
    return this.service.findMyRequests(req.user.userId);
  }

  // 3. View My Stats (Specific path MUST come before :id)
  @UseGuards(JwtGuard)
  @Get('my/stats')
  getMyStats(@Req() req: any) {
    return this.service.getMyStats(req.user.userId);
  }

  // 4. View All Requests (ADMIN or BLOOD_BANK)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'BLOOD_BANK')
  @Get()
  getAll() {
    return this.service.findAll();
  }

  // 5. Get Request By ID (Dynamic path comes after specific paths)
  @UseGuards(JwtGuard)
  @Get(':id')
  getById(@Param('id') id: string, @Req() req: any) {
    return this.service.getById(id, req.user.userId);
  }

  // 6. Approve Request (ADMIN or BLOOD_BANK)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'BLOOD_BANK')
  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.service.approve(id);
  }

  // 7. Reject Request (ADMIN or BLOOD_BANK)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'BLOOD_BANK')
  @Post(':id/reject')
  reject(@Param('id') id: string) {
    return this.service.reject(id);
  }

  // 8. Assign Blood Bank (ADMIN only)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':id/assign-blood-bank')
  assign(@Param('id') id: string, @Body() dto: AssignBloodBankDto) {
    return this.service.assignBloodBank(id, dto.blood_bank_id);
  }

  // 9. Cancel Request (Requester only)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('SEEKER', 'HOSPITAL')
  @Post(':id/cancel')
  cancel(@Req() req: any, @Param('id') id: string) {
    return this.service.cancel(req.user.userId, id);
  }
}
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SeekerService } from './seeker.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateSeekerProfileDto } from './dto/create-seeker-profile.dto';
import { CreateBloodRequestDto } from './dto/create-blood-request.dto';

@Controller('seeker')
export class SeekerController {
  constructor(private readonly service: SeekerService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('SEEKER')
  @Post('profile')
  createProfile(@Req() req: any, @Body() dto: CreateSeekerProfileDto) {
    return this.service.createProfile(req.user.userId, dto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('SEEKER')
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.service.getMyProfile(req.user.userId);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('SEEKER')
  @Post('blood-request')
  createRequest(@Req() req: any, @Body() dto: CreateBloodRequestDto) {
    return this.service.createBloodRequest(req.user.userId, dto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('SEEKER')
  @Post('blood-request/:id/cancel')
  cancel(@Req() req: any, @Param('id') id: string) {
    return this.service.cancelBloodRequest(req.user.userId, id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('SEEKER')
  @Get('requests')
  getRequests(@Req() req: any) {
    return this.service.getMyRequests(req.user.userId);
  }
}

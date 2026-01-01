import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  // ---------------- AUTHENTICATED USER ----------------
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@Req() req: any) {
    return this.service.getUserById(req.user.userId);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.service.updateMyProfile(req.user.userId, dto);
  }

  // ---------------- ADMIN ----------------
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  getAllUsers() {
    return this.service.getAllUsers();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.service.getUserById(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/block')
  blockUser(@Param('id') id: string) {
    return this.service.setUserStatus(id, false);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/unblock')
  unblockUser(@Param('id') id: string) {
    return this.service.setUserStatus(id, true);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtGuard } from '../auth/jwt.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
@UseGuards(JwtGuard)
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  // =====================================
  // CREATE NOTIFICATION (ADMIN / SYSTEM)
  // =====================================
  @Post()
  async create(@Body() dto: CreateNotificationDto) {
    return this.service.create({
      user_id: dto.user_id,
      title: dto.title,
      message: dto.message,
    });
  }

  // =====================================
  // GET MY NOTIFICATIONS
  // =====================================
  @Get()
  async getMine(@Req() req: any) {
    return this.service.getMyNotifications(req.user.userId);
  }

  // =====================================
  // MARK NOTIFICATION AS READ
  // =====================================
  @Patch(':id/read')
  async markRead(@Req() req: any, @Param('id') id: string) {
    return this.service.markAsRead(id, req.user.userId);
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  // =====================================
  // CREATE NOTIFICATION (OBJECT STYLE)
  // =====================================
  async create(data: {
    user_id: string;
    title: string;
    message: string;
  }) {
    return this.prisma.notifications.create({
      data: {
        user_id: data.user_id,
        title: data.title,
        message: data.message,
      },
    });
  }

  // =====================================
  // GET USER NOTIFICATIONS
  // =====================================
  getMyNotifications(userId: string) {
    return this.prisma.notifications.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  // =====================================
  // MARK AS READ
  // =====================================
  markAsRead(notificationId: string, userId: string) {
    return this.prisma.notifications.updateMany({
      where: {
        id: notificationId,
        user_id: userId,
      },
      data: { is_read: true },
    });
  }
}
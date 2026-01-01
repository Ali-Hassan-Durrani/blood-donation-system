import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    PrismaModule,
    NotificationsModule, // ⭐ REQUIRED
    AuditModule,         // ⭐ REQUIRED
  ],
  controllers: [DonationsController],
  providers: [DonationsService],
})
export class DonationsModule {}

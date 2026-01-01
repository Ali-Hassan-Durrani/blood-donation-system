import { Module } from '@nestjs/common';
import { BloodBankController } from './blood-bank.controller';
import { BloodBankService } from './blood-bank.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    PrismaModule,
    NotificationsModule, // ⭐ REQUIRED
    AuditModule,         // ⭐ REQUIRED
  ],
  controllers: [BloodBankController],
  providers: [BloodBankService],
})
export class BloodBankModule {}

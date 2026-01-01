import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BloodRequestModule } from './blood-request/blood-request.module';
import { DonorModule } from './donor/donor.module';
import { BloodBankModule } from './blood-bank/blood-bank.module';
import { DonationsModule } from './donations/donations.module';
import { HospitalModule } from './hospital/hospital.module';
import { SeekerController } from './seeker/seeker.controller';
import { SeekerModule } from './seeker/seeker.module';
import { InventoryModule } from './inventory/inventory.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditModule } from './audit/audit.module';
import { ContactModule } from './contact/contact.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    BloodRequestModule,
    DonorModule,
    BloodBankModule,
    DonationsModule,
    HospitalModule,
    SeekerModule,
    InventoryModule,
    NotificationsModule,
    AuditModule,
    ContactModule,
    AdminModule,
  ],
  controllers: [AppController, SeekerController],
  providers: [AppService],
})
export class AppModule {}

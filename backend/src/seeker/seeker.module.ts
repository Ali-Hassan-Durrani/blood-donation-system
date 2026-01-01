import { Module } from '@nestjs/common';
import { SeekerController } from './seeker.controller';
import { SeekerService } from './seeker.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SeekerController],
  providers: [SeekerService],
  exports: [SeekerService], // safe export
})
export class SeekerModule {}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('audit')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
export class AuditController {
  constructor(private readonly service: AuditService) {}

  @Get()
  getAllLogs() {
    return this.service.getAll();
  }
}

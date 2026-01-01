import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  // --------------------------------------
  // CREATE AUDIT LOG (USED INTERNALLY)
  // --------------------------------------
  log(params: {
    actor_user_id?: string;
    action: string;
    entity_type: string;
    entity_id?: string;
    meta?: any;
    ip_address?: string;
  }) {
    return this.prisma.audit_logs.create({
      data: {
        actor_user_id: params.actor_user_id,
        action: params.action,
        entity_type: params.entity_type,
        entity_id: params.entity_id,
        meta: params.meta,
        ip_address: params.ip_address,
      },
    });
  }

  // --------------------------------------
  // ADMIN: VIEW ALL LOGS
  // --------------------------------------
  getAll() {
    return this.prisma.audit_logs.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateContactDto) {
    return this.prisma.contact_messages.create({
      data: {
        name: dto.name,
        email: dto.email,
        message: dto.message,
      },
    });
  }

  findAll() {
    return this.prisma.contact_messages.findMany({
      orderBy: { created_at: 'desc' },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { user_role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // AUTH
  findByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  // REGISTER (phone + city REQUIRED)
  async createUser(data: {
    full_name: string;
    email: string;
    password: string;
    role: user_role;
    phone: string;
    city: string;
  }) {
    return this.prisma.users.create({
      data: {
        full_name: data.full_name,
        email: data.email,
        password_hash: data.password,
        role: data.role,
        phone: data.phone,
        city: data.city,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
      },
    });
  }

  // ME / PROFILE
  getUserById(id: string) {
    return this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        phone: true,
        city: true,
        is_active: true,
        created_at: true,
      },
    });
  }

  updateMyProfile(userId: string, dto: { full_name?: string }) {
    return this.prisma.users.update({
      where: { id: userId },
      data: {
        ...(dto.full_name ? { full_name: dto.full_name } : {}),
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        city: true,
      },
    });
  }

  // ADMIN
  getAllUsers() {
    return this.prisma.users.findMany({
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        phone: true,
        city: true,
        is_active: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  setUserStatus(userId: string, isActive: boolean) {
    return this.prisma.users.update({
      where: { id: userId },
      data: { is_active: isActive },
      select: {
        id: true,
        is_active: true,
      },
    });
  }
}

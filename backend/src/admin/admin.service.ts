import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      users,
      bloodRequests,
      donations,
      contactMessages,
    ] = await Promise.all([
      this.prisma.users.count(),
      this.prisma.blood_requests.count(),
      this.prisma.donations.count(),
      this.prisma.contact_messages.count(),
    ]);

    return {
      users,
      bloodRequests,
      donations,
      contactMessages,
    };
  }

  async requestAnalytics() {
  const data = await this.prisma.blood_requests.groupBy({
    by: ['status'],
    _count: true,
  });

  return data.map((d) => ({
    status: d.status,
    count: d._count,
  }));
}

async donationAnalytics() {
  const data = await this.prisma.$queryRawUnsafe<any[]>(`
    SELECT DATE(created_at) as date, COUNT(*)::int as count
    FROM donations
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `);

  return data;
}

// ✅ NEW: Get recent blood requests
  async getRecentRequests(limit?: number) {
    return this.prisma.blood_requests.findMany({
      orderBy: { created_at: 'desc' },
      take: limit || 50,
      include: {
        users_blood_requests_requester_user_idTousers: {
          select: { full_name: true, email: true, phone: true },
        },
      },
    });
  }

  // ✅ NEW: Get recent donations
  async getRecentDonations(limit?: number) {
    return this.prisma.donations.findMany({
      orderBy: { created_at: 'desc' },
      take: limit || 50,
      include: {
        users_donations_donor_user_idTousers: {
          select: { full_name: true, email: true },
        },
      },
    });
  }
}
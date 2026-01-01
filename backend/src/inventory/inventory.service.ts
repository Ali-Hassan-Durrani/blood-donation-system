import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddInventoryDto } from './dto/add-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------
  // ADD INVENTORY LOT
  // ----------------------------------------
  async addInventory(bloodBankId: string, dto: AddInventoryDto) {
    const expiry = new Date(dto.expires_on);
    const today = new Date();

    if (expiry <= today) {
      throw new BadRequestException('Expiry date must be in the future');
    }

    return this.prisma.inventory_lots.create({
      data: {
        blood_bank_id: bloodBankId,
        blood_group: dto.blood_group as any,
        units_available: dto.units_available,
        expires_on: expiry,
      },
    });
  }

  // ----------------------------------------
  // VIEW INVENTORY (BY BLOOD BANK)
  // ----------------------------------------
  getMyInventory(bloodBankId: string) {
    return this.prisma.inventory_lots.findMany({
      where: { blood_bank_id: bloodBankId },
      orderBy: { expires_on: 'asc' },
    });
  }

  // ----------------------------------------
  // FIFO CONSUMPTION LOGIC
  // ----------------------------------------
  async consumeInventory(
    bloodBankId: string,
    bloodGroup: string,
    unitsNeeded: number,
  ) {
    const lots = await this.prisma.inventory_lots.findMany({
      where: {
        blood_bank_id: bloodBankId,
        blood_group: bloodGroup as any,
        units_available: { gt: 0 },
        expires_on: { gt: new Date() },
      },
      orderBy: { expires_on: 'asc' }, // FIFO
    });

    let remaining = unitsNeeded;

    for (const lot of lots) {
      if (remaining <= 0) break;

      const used = Math.min(lot.units_available, remaining);
      remaining -= used;

      await this.prisma.inventory_lots.update({
        where: { id: lot.id },
        data: { units_available: lot.units_available - used },
      });
    }

    if (remaining > 0) {
      throw new BadRequestException('Insufficient stock');
    }

    return { message: 'Inventory consumed successfully' };
  }

  // ----------------------------------------
  // LOW STOCK ALERT (BASIC)
  // ----------------------------------------
  async checkLowStock(bloodBankId: string) {
    const grouped = await this.prisma.inventory_lots.groupBy({
      by: ['blood_group'],
      where: { blood_bank_id: bloodBankId },
      _sum: { units_available: true },
    });

    return grouped.filter(
      (g) => (g._sum.units_available || 0) < 5,
    );
  }
}

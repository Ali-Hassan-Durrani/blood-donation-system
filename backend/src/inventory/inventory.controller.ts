import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AddInventoryDto } from './dto/add-inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  // Add inventory
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('BLOOD_BANK')
  @Post()
  add(@Req() req: any, @Body() dto: AddInventoryDto) {
    return this.service.addInventory(req.user.userId, dto);
  }

  // View inventory
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('BLOOD_BANK')
  @Get()
  getMine(@Req() req: any) {
    return this.service.getMyInventory(req.user.userId);
  }

  // Low stock alert
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('BLOOD_BANK')
  @Get('low-stock')
  lowStock(@Req() req: any) {
    return this.service.checkLowStock(req.user.userId);
  }
}

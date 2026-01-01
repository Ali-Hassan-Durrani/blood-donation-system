import { IsEnum, IsInt, IsString, IsOptional, Min } from 'class-validator';
import { blood_group, urgency_level } from '@prisma/client';

export class CreateBloodRequestDto {
  @IsOptional()
  @IsString()
  requested_for_patient_name?: string;

  @IsEnum(blood_group)
  blood_group: blood_group;

  @IsInt()
  @Min(1)
  units_needed: number;

  @IsString()
  city: string;

  needed_on: Date;

  @IsEnum(urgency_level)
  urgency: urgency_level;

  @IsOptional()
  @IsString()
  reason?: string;
}

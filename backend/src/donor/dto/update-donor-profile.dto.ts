import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { BloodGroup } from './blood-group.enum';

export class UpdateDonorProfileDto {
  @IsOptional()
  @IsEnum(BloodGroup)
  blood_group?: BloodGroup;

  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @IsOptional()
  @IsNumber()
  @Min(50)
  weight_kg?: number;

  @IsOptional()
  @IsString()
  medical_notes?: string;
}
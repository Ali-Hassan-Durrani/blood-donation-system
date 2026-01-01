import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { BloodGroup } from './blood-group.enum';

export class CreateDonorProfileDto {
  @IsEnum(BloodGroup)
  blood_group: BloodGroup;

  // YYYY-MM-DD
  @IsDateString()
  date_of_birth: string;

  @IsNumber()
  @Min(50)
  weight_kg: number;

  @IsOptional()
  @IsString()
  medical_notes?: string;
}

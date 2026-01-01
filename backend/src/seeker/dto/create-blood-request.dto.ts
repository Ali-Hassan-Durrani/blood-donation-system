import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBloodRequestDto {
  @IsOptional()
  @IsString()
  requested_for_patient_name?: string;

  @IsEnum(['A_POS','A_NEG','B_POS','B_NEG','AB_POS','AB_NEG','O_POS','O_NEG'])
  blood_group: string;

  @IsInt()
  @Min(1)
  units_needed: number;

  @IsString()
  city: string;

  @IsDateString()
  needed_on: string;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  urgency: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

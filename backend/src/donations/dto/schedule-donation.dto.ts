import { IsDateString, IsOptional, IsUUID, IsString } from 'class-validator';

export class ScheduleDonationDto {
  @IsUUID()
  donor_user_id: string;

  @IsOptional()
  @IsUUID()
  request_id?: string;

  @IsOptional()
  @IsUUID()
  blood_bank_id?: string;

  @IsOptional()
  @IsUUID()
  hospital_id?: string;

  @IsDateString()
  scheduled_on: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

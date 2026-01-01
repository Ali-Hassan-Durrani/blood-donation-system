import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class AssignDonorDto {
  @IsUUID()
  request_id: string;

  @IsUUID()
  donor_user_id: string;

  @IsDateString()
  scheduled_on: string;

  @IsNotEmpty()
  notes?: string;
}

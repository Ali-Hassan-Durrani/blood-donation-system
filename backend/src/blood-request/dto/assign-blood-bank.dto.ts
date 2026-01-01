import { IsNotEmpty, IsString } from 'class-validator';

export class AssignBloodBankDto {
  @IsNotEmpty()
  @IsString()
  blood_bank_id: string;
}

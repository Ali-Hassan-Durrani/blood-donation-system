import { IsDateString, IsEnum, IsInt, Min } from 'class-validator';

export class AddInventoryDto {
  @IsEnum(['A_POS','A_NEG','B_POS','B_NEG','AB_POS','AB_NEG','O_POS','O_NEG'])
  blood_group: string;

  @IsInt()
  @Min(1)
  units_available: number;

  @IsDateString()
  expires_on: string; // YYYY-MM-DD
}

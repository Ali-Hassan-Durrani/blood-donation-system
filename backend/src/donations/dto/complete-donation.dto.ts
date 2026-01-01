import { IsEnum, IsInt, IsUUID, Min } from 'class-validator';

export class CompleteDonationDto {
  @IsUUID()
  donation_id: string;

  @IsEnum(['A_POS','A_NEG','B_POS','B_NEG','AB_POS','AB_NEG','O_POS','O_NEG'])
  blood_group: string;

  @IsInt()
  @Min(1)
  units_collected: number;
}
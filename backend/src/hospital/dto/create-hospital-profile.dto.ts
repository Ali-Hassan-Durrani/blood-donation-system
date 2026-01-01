import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHospitalProfileDto {
  @IsString()
  @IsNotEmpty()
  hospital_name: string;

  @IsString()
  @IsNotEmpty()
  license_no: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

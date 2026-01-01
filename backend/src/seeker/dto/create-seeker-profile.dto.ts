import { IsOptional, IsString } from 'class-validator';

export class CreateSeekerProfileDto {
  @IsOptional()
  @IsString()
  identity_cnic?: string;

  @IsOptional()
  @IsString()
  emergency_contact?: string;
}

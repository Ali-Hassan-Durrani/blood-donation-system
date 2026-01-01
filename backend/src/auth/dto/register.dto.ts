import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { user_role } from '@prisma/client';

export class RegisterDto {
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsEnum(user_role)
  role: user_role;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  city: string;
}

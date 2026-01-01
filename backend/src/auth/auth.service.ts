import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // 🔐 REGISTER
async register(dto: RegisterDto) {
  console.log('=========== REGISTER ATTEMPT ===========');
  console.log('EMAIL:', dto.email);
  console.log('PASSWORD FROM REGISTER:', dto.password);
  console.log('PASSWORD LENGTH:', dto.password.length);

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  console.log('GENERATED HASH:', hashedPassword);

  const user = await this.usersService.createUser({
    full_name: dto.full_name,
    email: dto.email.toLowerCase(),
    password: hashedPassword,
    role: dto.role,
    phone: dto.phone,
    city: dto.city,
  });

  return this.signToken(user.id, user.role);
}

  // 🔐 LOGIN
async login(dto: LoginDto) {
  console.log('================ LOGIN ATTEMPT ================');
  console.log('EMAIL FROM REQUEST:', dto.email);
  console.log('PASSWORD FROM REQUEST:', dto.password);

  const email = dto.email.toLowerCase();
  const user = await this.usersService.findByEmail(email);

  console.log('USER FROM DB:', user);

  if (!user) {
    console.log('❌ USER NOT FOUND');
    throw new UnauthorizedException('Invalid credentials');
  }

  console.log('HASH FROM DB:', user.password_hash);

  const isPasswordValid = await bcrypt.compare(
    dto.password,
    user.password_hash,
  );

  console.log('PASSWORD MATCH RESULT:', isPasswordValid);

  if (!isPasswordValid) {
    console.log('❌ PASSWORD MISMATCH');
    throw new UnauthorizedException('Invalid credentials');
  }

  console.log('✅ LOGIN SUCCESS');
  return this.signToken(user.id, user.role);
}

  // 🔑 JWT TOKEN
  private async signToken(userId: string, role: string) {
    const payload = {
      sub: userId,
      role,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      access_token,
      user: {
        id: userId,
        role,
      },
    };
  }
}

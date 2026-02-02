import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './Dtos/login.dto';
import { JwtPayload } from './jwt-payload.interface';
import { Role } from './role.enum'; // <--- IMPORTANTE: Importe o Enum

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

    const payload: JwtPayload = {
      sub: user.id,
      role: user.role as unknown as Role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

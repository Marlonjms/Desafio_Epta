import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

// essa rota aqui, serve para saber as info de cada user.
@Controller()
export class AppController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return req.user;
  }
}

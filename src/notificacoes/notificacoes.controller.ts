import { Controller, Get, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { NotificacoesService } from './notificacoes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser {
  user: { userId: string };
}

@Controller('notificacoes')
@UseGuards(JwtAuthGuard)
export class NotificacoesController {
  constructor(private readonly servico: NotificacoesService) {}

  @Get()
  listar(@Req() req: RequestWithUser) {
    return this.servico.listarMinhas(req.user.userId);
  }

  @Get('contar')
  contar(@Req() req: RequestWithUser) {
    return this.servico.contarNaoLidas(req.user.userId);
  }

  @Patch(':id/ler')
  marcarComoLida(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.servico.marcarComoLida(id, req.user.userId);
  }
}

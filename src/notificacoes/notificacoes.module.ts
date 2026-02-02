import { Module } from '@nestjs/common';
import { NotificacoesService } from './notificacoes.service';
import { NotificacoesController } from './notificacoes.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [NotificacoesController],
  providers: [NotificacoesService, PrismaService],
  exports: [NotificacoesService],
})
export class NotificacoesModule {}

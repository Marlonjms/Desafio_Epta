import { Module } from '@nestjs/common';
import { VistoriasService } from './vistorias.service';
import { VistoriasController } from './vistorias.controller';
import { PrismaService } from '../prisma/prisma.service';
import { NotificacoesModule } from '../notificacoes/notificacoes.module';

@Module({
  imports: [NotificacoesModule],
  controllers: [VistoriasController],
  providers: [VistoriasService, PrismaService],
})
export class VistoriasModule {}

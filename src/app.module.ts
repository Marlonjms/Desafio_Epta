import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { MotivosReprovacaoModule } from './motivos-reprovacao/motivos-reprovacao.module';
import { VistoriasModule } from './vistorias/vistorias.module';

@Module({
  imports: [PrismaModule, AuthModule, MotivosReprovacaoModule, VistoriasModule],
  controllers: [AppController],
})
export class AppModule {}

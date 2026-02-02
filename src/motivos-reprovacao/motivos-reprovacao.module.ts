import { Module } from '@nestjs/common';
import { MotivosReprovacaoService } from './motivos-reprovacao.service';
import { MotivosReprovacaoController } from './motivos-reprovacao.controller';

@Module({
  providers: [MotivosReprovacaoService],
  controllers: [MotivosReprovacaoController],
})
export class MotivosReprovacaoModule {}

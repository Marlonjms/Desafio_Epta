import { Module } from '@nestjs/common';
import { VistoriasService } from './vistorias.service';
import { VistoriasController } from './vistorias.controller';

@Module({
  providers: [VistoriasService],
  controllers: [VistoriasController],
})
export class VistoriasModule {}

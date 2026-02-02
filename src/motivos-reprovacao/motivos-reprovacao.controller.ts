import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MotivosReprovacaoService } from './motivos-reprovacao.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateMotivoDto } from './Dtos/create-motivo.dto';
import { UpdateMotivoDto } from './Dtos/update-motivo.dto';

@Controller('motivos-reprovacao')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.VISTORIADOR)
export class MotivosReprovacaoController {
  constructor(
    private readonly motivosReprovacaoService: MotivosReprovacaoService,
  ) {}

  @Post()
  criar(@Body() createMotivoDto: CreateMotivoDto) {
    return this.motivosReprovacaoService.criar(createMotivoDto);
  }

  @Get()
  listar() {
    return this.motivosReprovacaoService.listar();
  }

  @Put(':id')
  atualizar(@Param('id') id: string, @Body() updateMotivoDto: UpdateMotivoDto) {
    return this.motivosReprovacaoService.atualizar(id, updateMotivoDto);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.motivosReprovacaoService.remover(id);
  }
}

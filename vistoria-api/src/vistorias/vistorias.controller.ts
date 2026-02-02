import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Query,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { VistoriasService } from './vistorias.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { CriarVistoriaDto } from './Dtos/criar-vistoria.dto';
import { ReprovarVistoriaDto } from './Dtos/reprovar-vistoria.dto';
import { ListarVistoriasDto } from './Dtos/listar-vistorias.dto';
import { Res } from '@nestjs/common';
import type { Response } from 'express';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    role: Role;
  };
}

@Controller('vistorias')
@UseGuards(JwtAuthGuard)
export class VistoriasController {
  constructor(private readonly service: VistoriasService) {}

  // Vendedor
  @Post('criar')
  @Roles(Role.VENDEDOR)
  @UseGuards(RolesGuard)
  criar(@Req() req: RequestWithUser, @Body() body: CriarVistoriaDto) {
    return this.service.criar(body, req.user.userId);
  }

  // Vendedor VALUES para usar: PENDENTE, APROVADO, REPROVADO
  @Get('minhas-vistorias')
  @Roles(Role.VENDEDOR)
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true })) // Converte "1" para numero 1
  listarMinhas(
    @Req() req: RequestWithUser,
    @Query() query: ListarVistoriasDto, // <--- Pega os filtros da URL
  ) {
    return this.service.listarDoVendedor(req.user.userId, query);
  }

  // listagem geral que o vistoriador filtra
  @Get('listar')
  @Roles(Role.VISTORIADOR)
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  listarGeral(@Query() query: ListarVistoriasDto) {
    return this.service.listarTodas(query);
  }

  // Aprovar vistoria (somente vistoriador)
  @Patch(':id/aprovar-vistoria')
  @Roles(Role.VISTORIADOR)
  @UseGuards(RolesGuard)
  aprovar(@Param('id') id: string) {
    return this.service.aprovar(id);
  }

  // Reprovar vistoria com motivo (somente vistoriador)
  @Patch(':id/reprovar-vistoria')
  @Roles(Role.VISTORIADOR)
  @UseGuards(RolesGuard)
  reprovar(@Param('id') id: string, @Body() body: ReprovarVistoriaDto) {
    return this.service.reprovar(id, body.motivoId, body.comentario);
  }

  // Exportar Relatório (Somente Vistoriador)
  @Get('exportar')
  @Roles(Role.VISTORIADOR)
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async exportarRelatorio(
    @Query() query: ListarVistoriasDto,
    @Res() res: Response,
  ) {
    const buffer = await this.service.gerarRelatorioExcel(query);

    // Configura os headers para o navegador entender que é um download
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=relatorio_vistorias.xlsx',
      'Content-Length': buffer.byteLength,
    });

    // Envia o arquivo
    res.send(buffer);
  }
}

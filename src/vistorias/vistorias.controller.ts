import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { VistoriasService } from './vistorias.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { CriarVistoriaDto } from './Dtos/criar-vistoria.dto';
import { ReprovarVistoriaDto } from './Dtos/reprovar-vistoria.dto';

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

  @Post('criar')
  @Roles(Role.VENDEDOR)
  @UseGuards(RolesGuard)
  criar(@Req() req: RequestWithUser, @Body() body: CriarVistoriaDto) {
    return this.service.criar(body, req.user.userId);
  }

  @Get('minhas-vistorias')
  @Roles(Role.VENDEDOR)
  @UseGuards(RolesGuard)
  listarMinhas(@Req() req: RequestWithUser) {
    return this.service.listarDoVendedor(req.user.userId);
  }

  // Listar vistorias pendentes para análise (somente vistoriador)
  @Get('pendentes-para-aprovacao')
  @Roles(Role.VISTORIADOR)
  @UseGuards(RolesGuard)
  listarPendentes() {
    return this.service.listarPendentes();
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
}

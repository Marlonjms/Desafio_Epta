import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMotivoDto } from './Dtos/create-motivo.dto';
import { UpdateMotivoDto } from './Dtos/update-motivo.dto';

@Injectable()
export class MotivosReprovacaoService {
  constructor(private prisma: PrismaService) {}

  async criar(dto: CreateMotivoDto) {
    return this.prisma.motivoReprovacao.create({
      data: dto,
    });
  }

  async listar() {
    return this.prisma.motivoReprovacao.findMany({
      orderBy: {
        descricao: 'asc',
      },
    });
  }

  async atualizar(id: string, dto: UpdateMotivoDto) {
    const motivo = await this.prisma.motivoReprovacao.findUnique({
      where: { id },
    });
    if (!motivo) throw new NotFoundException('Motivo não encontrado');

    return this.prisma.motivoReprovacao.update({
      where: { id },
      data: dto,
    });
  }

  async remover(id: string) {
    const motivo = await this.prisma.motivoReprovacao.findUnique({
      where: { id },
    });
    if (!motivo) throw new NotFoundException('Motivo não encontrado');

    return this.prisma.motivoReprovacao.delete({
      where: { id },
    });
  }
}

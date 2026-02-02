import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusVistoria } from '@prisma/client';
import { CriarVistoriaDto } from './Dtos/criar-vistoria.dto';

@Injectable()
export class VistoriasService {
  constructor(private prisma: PrismaService) {}

  // CRIAR VISTORIA
  async criar(dados: CriarVistoriaDto, vendedorId: string) {
    return this.prisma.vistoria.create({
      data: {
        ...dados,
        vendedorId,
        status: StatusVistoria.PENDENTE,
      },
    });
  }

  // LISTAR VISTORIAS DO VENDEDOR
  listarDoVendedor(vendedorId: string) {
    return this.prisma.vistoria.findMany({
      where: { vendedorId },
      include: { motivo: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // LISTAR VISTORIAS PENDENTES (VISTORIADOR)
  listarPendentes() {
    return this.prisma.vistoria.findMany({
      where: { status: StatusVistoria.PENDENTE },
      include: {
        vendedor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // APROVAR VISTORIA (VISTORIADOR)
  async aprovar(id: string) {
    const vistoria = await this.prisma.vistoria.findUnique({ where: { id } });

    if (!vistoria) throw new NotFoundException('Vistoria não encontrada');

    const vistoriaAtualizada = await this.prisma.vistoria.update({
      where: { id },
      data: { status: StatusVistoria.APROVADO },
    });

    return vistoriaAtualizada;
  }

  // REPROVAR VISTORIA (VISTORIADOR)
  async reprovar(id: string, motivoId: string, comentario?: string) {
    const vistoria = await this.prisma.vistoria.findUnique({ where: { id } });

    if (!vistoria) throw new NotFoundException('Vistoria não encontrada');

    const vistoriaAtualizada = await this.prisma.vistoria.update({
      where: { id },
      data: {
        status: StatusVistoria.REPROVADO,
        motivoId,
        comentario,
      },
    });

    return vistoriaAtualizada;
  }
}

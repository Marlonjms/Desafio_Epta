import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusVistoria } from '@prisma/client';
import { CriarVistoriaDto } from './Dtos/criar-vistoria.dto';
import { NotificacoesService } from '../notificacoes/notificacoes.service';

@Injectable()
export class VistoriasService {
  constructor(
    private prisma: PrismaService,
    private notificacoesService: NotificacoesService,
  ) {}

  // 1. CRIAR VISTORIA (Com notificação para vistoriadores)
  async criar(dados: CriarVistoriaDto, vendedorId: string) {
    const vistoria = await this.prisma.vistoria.create({
      data: {
        ...dados,
        vendedorId,
        status: StatusVistoria.PENDENTE,
      },
    });

    // Dispara notificação
    await this.notificacoesService.notificarVistoriadores(
      'Nova Vistoria Pendente',
      `O veículo placa ${dados.placa} aguarda análise.`,
    );

    return vistoria;
  }

  // 2. LISTAR MINHAS (Método que estava faltando)
  listarDoVendedor(vendedorId: string) {
    return this.prisma.vistoria.findMany({
      where: { vendedorId },
      include: { motivo: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. LISTAR PENDENTES (Método que estava faltando)
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

  // 4. APROVAR (Com notificação para o vendedor)
  async aprovar(id: string) {
    const vistoria = await this.prisma.vistoria.findUnique({ where: { id } });
    if (!vistoria) throw new NotFoundException('Vistoria não encontrada');

    const vistoriaAtualizada = await this.prisma.vistoria.update({
      where: { id },
      data: { status: StatusVistoria.APROVADO },
    });

    await this.notificacoesService.criar(
      vistoria.vendedorId,
      'Vistoria Aprovada! ✅',
      `Sua vistoria do modelo ${vistoria.modelo} foi aprovada.`,
    );

    return vistoriaAtualizada;
  }

  // 5. REPROVAR (Com notificação para o vendedor)
  async reprovar(id: string, motivoId: string, comentario?: string) {
    const vistoria = await this.prisma.vistoria.findUnique({ where: { id } });
    if (!vistoria) throw new NotFoundException('Vistoria não encontrada');

    // Busca o texto do motivo para a mensagem ficar clara
    const motivoObj = await this.prisma.motivoReprovacao.findUnique({
      where: { id: motivoId },
    });
    const textoMotivo = motivoObj ? motivoObj.descricao : 'Motivo diverso';

    const vistoriaAtualizada = await this.prisma.vistoria.update({
      where: { id },
      data: {
        status: StatusVistoria.REPROVADO,
        motivoId,
        comentario,
      },
    });

    await this.notificacoesService.criar(
      vistoria.vendedorId,
      'Vistoria Reprovada ❌',
      `Veículo ${vistoria.modelo} reprovado. Motivo: ${textoMotivo}.`,
    );

    return vistoriaAtualizada;
  }
}

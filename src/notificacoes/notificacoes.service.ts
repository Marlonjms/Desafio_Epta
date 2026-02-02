import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificacoesService {
  constructor(private prisma: PrismaService) {}

  // 1. Criar notificação para um usuário específico
  async criar(usuarioId: string, titulo: string, mensagem: string) {
    return this.prisma.notificacao.create({
      data: {
        usuarioId,
        titulo,
        mensagem,
      },
    });
  }

  // 2. Notificar todos os vistoriadores (Gatilho em massa)
  async notificarVistoriadores(titulo: string, mensagem: string) {
    // Busca IDs dos vistoriadores
    const vistoriadores = await this.prisma.user.findMany({
      where: { role: 'VISTORIADOR' },
      select: { id: true },
    });

    if (vistoriadores.length === 0) return;

    // Prepara os dados
    const dadosNotificacao = vistoriadores.map((v) => ({
      usuarioId: v.id,
      titulo,
      mensagem,
    }));

    // Cria várias de uma vez
    await this.prisma.notificacao.createMany({
      data: dadosNotificacao,
    });
  }

  // 3. Listar notificações do usuário logado
  async listarMinhas(usuarioId: string) {
    return this.prisma.notificacao.findMany({
      where: { usuarioId },
      orderBy: { dataCriacao: 'desc' },
    });
  }

  // 4. Contar não lidas (Para o ícone de sininho)
  async contarNaoLidas(usuarioId: string) {
    return this.prisma.notificacao.count({
      where: { usuarioId, lida: false },
    });
  }

  // 5. Marcar como lida
  async marcarComoLida(id: string, usuarioId: string) {
    return this.prisma.notificacao.updateMany({
      where: { id, usuarioId },
      data: { lida: true },
    });
  }
}

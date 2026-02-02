import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, StatusVistoria } from '@prisma/client';
import { CriarVistoriaDto } from './Dtos/criar-vistoria.dto';
import { NotificacoesService } from '../notificacoes/notificacoes.service';
import { ListarVistoriasDto } from './Dtos/listar-vistorias.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class VistoriasService {
  constructor(
    private prisma: PrismaService,
    private notificacoesService: NotificacoesService,
  ) {}

  // 1. Criar Vistoria Vendedor
  async criar(dados: CriarVistoriaDto, vendedorId: string) {
    const vistoria = await this.prisma.vistoria.create({
      data: {
        ...dados,
        vendedorId,
        status: StatusVistoria.PENDENTE,
      },
    });

    await this.notificacoesService.notificarVistoriadores(
      'Nova Vistoria Pendente',
      `O veículo placa ${dados.placa} aguarda análise.`,
    );

    return vistoria;
  }

  // 2. Lista Minhhas / Vendedor
  async listarDoVendedor(vendedorId: string, params: ListarVistoriasDto) {
    const { pagina = 1, limite = 10, placa, status } = params;
    const skip = (pagina - 1) * limite;

    const where: Prisma.VistoriaWhereInput = {
      vendedorId,
    };

    if (placa) {
      where.placa = { contains: placa, mode: 'insensitive' };
    }
    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.vistoria.findMany({
        where,
        include: { motivo: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limite,
      }),
      this.prisma.vistoria.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  // 3. Listar todas / Vistoriador
  async listarTodas(params: ListarVistoriasDto) {
    const { pagina = 1, limite = 10, placa, status } = params;
    const skip = (pagina - 1) * limite;

    const where: Prisma.VistoriaWhereInput = {};

    if (placa) {
      where.placa = { contains: placa, mode: 'insensitive' };
    }
    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.vistoria.findMany({
        where,
        include: {
          vendedor: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limite,
      }),
      this.prisma.vistoria.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  // 4. Aprovar / vistoriador
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

  // 5. Reprovar / vistoriador
  async reprovar(id: string, motivoId: string, comentario?: string) {
    const vistoria = await this.prisma.vistoria.findUnique({ where: { id } });
    if (!vistoria) throw new NotFoundException('Vistoria não encontrada');

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

  // 6. GERAR RELATÓRIO EXCEL
  async gerarRelatorioExcel(params: ListarVistoriasDto) {
    const { placa, status } = params;

    const where: Prisma.VistoriaWhereInput = {};

    if (placa) where.placa = { contains: placa, mode: 'insensitive' };
    if (status) where.status = status;

    const vistorias = await this.prisma.vistoria.findMany({
      where,
      include: {
        motivo: true,
        vendedor: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Criar o Workbook (Arquivo Excel)
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório de Vistorias');

    // Definir as colunas
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 30 },
      { header: 'Cliente', key: 'cliente', width: 20 },
      { header: 'Placa', key: 'placa', width: 15 },
      { header: 'Modelo', key: 'modelo', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Vendedor', key: 'vendedor', width: 20 },
      { header: 'Motivo Reprovação', key: 'motivo', width: 25 },
      { header: 'Data Criação', key: 'data', width: 20 },
    ];

    // Adicionar as linhas
    vistorias.forEach((v) => {
      worksheet.addRow({
        id: v.id,
        cliente: v.cliente,
        placa: v.placa,
        modelo: v.modelo,
        status: v.status,
        vendedor: v.vendedor.name,
        motivo: v.motivo ? v.motivo.descricao : '-',
        data: v.createdAt.toLocaleString('pt-BR'),
      });
    });

    worksheet.getRow(1).font = { bold: true };

    // Retorna o buffer (o arquivo cru na memória)
    return await workbook.xlsx.writeBuffer();
  }
}

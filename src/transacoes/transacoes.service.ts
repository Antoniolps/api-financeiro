import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransacaoDto } from './dto/create-transacao.dto';
import { UpdateTransacaoDto } from './dto/update-transacao.dto';

@Injectable()
export class TransacoesService {
  constructor(private prisma: PrismaService) { }

  create(createTransacaoDto: CreateTransacaoDto) {
    return this.prisma.transacao.create({
      data: {
        descricao: createTransacaoDto.descricao,
        valor: createTransacaoDto.valor,
        tipo: createTransacaoDto.tipo,
        categoriaId: createTransacaoDto.categoriaId,
        data: createTransacaoDto.data ? new Date(createTransacaoDto.data) : new Date(),
      },
      include: {
        categoria: true,
      },
    });
  }

  async findAll() {
    return this.prisma.transacao.findMany({
      include: {
        categoria: true,
      },
      orderBy: {
        data: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const transacao = await this.prisma.transacao.findUnique({
      where: { id },
      include: {
        categoria: true,
      },
    });

    if (!transacao) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }

    return transacao;
  }

  async update(id: number, updateTransacaoDto: UpdateTransacaoDto) {
    await this.findOne(id); // Verifica se existe

    return this.prisma.transacao.update({
      where: { id },
      data: {
        descricao: updateTransacaoDto.descricao,
        valor: updateTransacaoDto.valor,
        tipo: updateTransacaoDto.tipo,
        categoriaId: updateTransacaoDto.categoriaId,
        data: updateTransacaoDto.data ? new Date(updateTransacaoDto.data) : undefined,
      },
      include: {
        categoria: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Verifica se existe

    return this.prisma.transacao.delete({
      where: { id },
    });
  }

  async getResumo() {
    const transacoes = await this.prisma.transacao.findMany();

    const totalReceitas = transacoes
      .filter((t) => t.tipo === 'receita')
      .reduce((acc, t) => acc + Number(t.valor), 0);

    const totalDespesas = transacoes
      .filter((t) => t.tipo === 'despesa')
      .reduce((acc, t) => acc + Number(t.valor), 0);

    return {
      totalReceitas,
      totalDespesas,
      saldo: totalReceitas - totalDespesas,
    };
  }
}

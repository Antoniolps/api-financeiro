import { IsNotEmpty, IsNumber, IsEnum, IsInt, IsOptional, IsDateString } from 'class-validator';
import { TipoTransacao } from '../../generated/prisma/client';

export class CreateTransacoeDto {
    @IsNotEmpty()
    descricao: string;

    @IsNumber()
    @IsNotEmpty()
    valor: number;

    @IsEnum(TipoTransacao)
    @IsNotEmpty()
    tipo: TipoTransacao;

    @IsInt()
    @IsNotEmpty()
    categoriaId: number;

    @IsOptional()
    @IsDateString()
    data?: string;
}
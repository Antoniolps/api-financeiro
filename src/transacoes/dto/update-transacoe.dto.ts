import { PartialType } from '@nestjs/mapped-types';
import { CreateTransacaoDto } from './create-transacoe.dto';

export class UpdateTransacaoDto extends PartialType(CreateTransacaoDto) { }
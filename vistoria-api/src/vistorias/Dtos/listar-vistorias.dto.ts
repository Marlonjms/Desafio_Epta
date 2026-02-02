import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusVistoria } from '@prisma/client';

export class ListarVistoriasDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pagina?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limite?: number = 10;

  @IsOptional()
  @IsString()
  placa?: string;

  @IsOptional()
  @IsEnum(StatusVistoria)
  status?: StatusVistoria;
}

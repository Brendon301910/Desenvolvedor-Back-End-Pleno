import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { Transform } from 'class-transformer';

export class UpdateAITDto {
  @ApiProperty({ example: 'ABC1234' })
  placa_veiculo: string;

  @ApiProperty({ example: '2025-01-28T12:00:00Z' })
  @Transform(({ value }) => new Date(value))
  data_infracao: Date;

  @ApiProperty({ example: 'Estacionamento proibido' })
  descricao: string;

  @ApiProperty({ example: 150.75 })
  @Transform(({ value }) => new Decimal(value))
  valor_multa: Decimal;
}

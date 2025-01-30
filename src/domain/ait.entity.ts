import { z } from 'zod';

import { Decimal } from '@prisma/client/runtime/library';
import { handleSafeParseZod } from 'src/lib/handleSafeParseZod';

export interface AITProps {
  placaVeiculo: string;
  dataInfracao: Date;
  descricao: string;
  valorMulta: Decimal;
}

export class AIT {
  private _id: string;
  private _placaVeiculo: string;
  private _dataInfracao: Date;
  private _descricao: string;
  private _valorMulta: Decimal;

  constructor(props: AITProps) {
    this.validate(props);
    this._placaVeiculo = props.placaVeiculo;
    this._dataInfracao = props.dataInfracao;
    this._descricao = props.descricao;
    this._valorMulta = props.valorMulta;
  }

  private validate(props: AITProps): void {
    const schema = z.object({
      placaVeiculo: z
        .string()
        .min(7, 'a placa do veículo precisa ter no mínimo 7 caracteres'),
      dataInfracao: z.date(),
      descricao: z
        .string()
        .min(10, 'descrição precisa ter no mínimo 10 caracteres')
        .max(100, 'descrição precisa ter no máximo 100 caracteres'),
      valorMulta: z
        .instanceof(Decimal)
        .refine((value) => value.gt(new Decimal(0)), {
          message: 'o valor da multa precisa ser maior que zero',
        }),
    });

    const result = schema.safeParse(props);

    if (result.success === false) throw handleSafeParseZod(result);
  }
  public updateAIT(
    placaVeiculo: string,
    dataInfracao: Date,
    descricao: string,
    valorMulta: Decimal,
  ) {
    const updatedProps: AITProps = {
      placaVeiculo,
      dataInfracao,
      descricao,
      valorMulta,
    };

    this.validate(updatedProps);

    this._placaVeiculo = placaVeiculo;
    this._dataInfracao = dataInfracao;
    this._descricao = descricao;
    this._valorMulta = valorMulta;
  }
  public get id() {
    return this._id;
  }

  public get placaVeiculo() {
    return this._placaVeiculo;
  }

  public set placaVeiculo(value: string) {
    if (value.length < 7) {
      throw new Error('A placa do veículo precisa ter no mínimo 7 caracteres');
    }
    this._placaVeiculo = value;
  }

  public get dataInfracao() {
    return this._dataInfracao;
  }

  public set dataInfracao(value: Date) {
    if (isNaN(value.getTime())) {
      throw new Error('Data de infração inválida');
    }
    this._dataInfracao = value;
  }

  public get descricao() {
    return this._descricao;
  }

  public set descricao(value: string) {
    if (value.length < 10 || value.length > 100) {
      throw new Error(
        'Descrição precisa ter no mínimo 10 caracteres e no máximo 100 caracteres',
      );
    }
    this._descricao = value;
  }

  public get valorMulta() {
    return this._valorMulta;
  }

  public set valorMulta(value: Decimal) {
    if (value.toNumber() <= 0) {
      throw new Error('O valor da multa precisa ser maior que zero');
    }
    this._valorMulta = value;
  }

  static create(props: AITProps): [AIT | null, Error | null] {
    try {
      return [new AIT(props), null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  static instance(props: AITProps): [AIT | null, Error | null] {
    return [new AIT(props), null];
  }
}

import { z } from 'zod';

import { Decimal } from '@prisma/client/runtime/library';
import { handleSafeParseZod } from 'src/lib/handleSafeParseZod';

export interface AITProps {
  id?: string;
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

  constructor(props: AITProps, id?: string) {
    this.validate(props);
    this._placaVeiculo = props.placaVeiculo;
    this._dataInfracao = props.dataInfracao;
    this._descricao = props.descricao;
    this._valorMulta = props.valorMulta;
    this._id = props.id;
  }

  private validate(props: AITProps): void {
    const schema = z.object({
      placaVeiculo: z
        .string()
        .min(7, 'The vehicle license plate must have at least 7 characters'),
      dataInfracao: z.date(),
      descricao: z
        .string()
        .min(10, 'description must be at least 10 characters long')
        .max(100, 'Description must be a maximum of 100 characters'),
      valorMulta: z
        .instanceof(Decimal)
        .refine((value) => value.gt(new Decimal(0)), {
          message: 'the value of the traffic fine must be greater than zero',
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
      throw new Error(
        'The vehicle license plate must have at least 7 characters',
      );
    }
    this._placaVeiculo = value;
  }

  public get dataInfracao() {
    return this._dataInfracao;
  }

  public set dataInfracao(value: Date) {
    if (isNaN(value.getTime())) {
      throw new Error('Invalid infraction date');
    }
    this._dataInfracao = value;
  }

  public get descricao() {
    return this._descricao;
  }

  public set descricao(value: string) {
    if (value.length < 10 || value.length > 100) {
      throw new Error(
        'Description must have a minimum of 10 characters and a maximum of 100 characters',
      );
    }
    this._descricao = value;
  }

  public get valorMulta() {
    return this._valorMulta;
  }

  public set valorMulta(value: Decimal) {
    if (value.toNumber() <= 0) {
      throw new Error(
        'the value of the traffic fine must be greater than zero',
      );
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

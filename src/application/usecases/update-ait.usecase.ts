import { Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { IAITRepository } from 'application/contracts/repositories/ait.repository';
import { IUpdateAITContract } from 'application/contracts/usecases/update-ait.contract';

import { AIT } from 'domain/ait.entity';

interface PutAitRequest {
  id: string;
  ait: {
    placa_veiculo: string;
    data_infracao: Date;
    descricao: string;
    valor_multa: Decimal;
  };
}
@Injectable()
export class UpdateAITUseCase implements IUpdateAITContract {
  constructor(private aitRepository: IAITRepository) {}

  async execute(request: PutAitRequest): Promise<void> {
    const { id, ait } = request;
    const aitRequest = await this.aitRepository.findById(id);

    if (!aitRequest) {
      throw new NotFoundException(`AIT with ID ${id} not found.`);
    }

    aitRequest.updateAIT(
      ait.placa_veiculo,
      ait.data_infracao,
      ait.descricao,
      ait.valor_multa,
    );
    await this.aitRepository.update(id, aitRequest);
  }
}

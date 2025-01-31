import { Injectable, NotFoundException } from '@nestjs/common';
import { IAITRepository } from 'application/contracts/repositories/ait.repository';
import { IGetAITContract } from 'application/contracts/usecases/get-ait.contract';

import { AIT } from 'domain/ait.entity';

interface GetAITListResponse {
  data: {
    aits: AIT[];
  };
  metadata: number;
}

interface GetAITListRequest {
  limit: number;
  page: number;
}

interface GetAITDetailRequest {
  placaVeiculo: string;
}

interface GetAitDetailRequest {
  id: string;
  dataInfracao: Date;
  placaVeiculo: string;
  descricao: string;
  valorMulta: Number;
}
@Injectable()
export class GetAITUseCase implements IGetAITContract {
  constructor(private aitRepository: IAITRepository) {}
  async getById(request: GetAitDetailRequest): Promise<AIT> {
    const { id } = request;
    const ait = await this.aitRepository.findById(id);
    if (ait == null) {
      throw new NotFoundException('Ait not found');
    }
    return ait;
  }
  async getByPlacaVeiculo(request: GetAITDetailRequest): Promise<AIT[]> {
    const { placaVeiculo } = request;
    const aits = await this.aitRepository.findByPlacaVeiculo(placaVeiculo);

    if (!aits || aits.length === 0) {
      throw new NotFoundException('Plate not found');
    }

    return aits;
  }

  async getAll(request: GetAITListRequest): Promise<GetAITListResponse> {
    const { limit, page } = request;
    const ait = await this.aitRepository.findAll(limit, page);
    if (ait == null) {
      throw Error('ait not found');
    }
    return { data: ait, metadata: ait.total };
  }
}

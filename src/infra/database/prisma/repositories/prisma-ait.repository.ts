import { Injectable } from '@nestjs/common';
import {
  IAITRepository,
  GetListAitsResponse,
} from 'application/contracts/repositories/ait.repository';

import { AIT } from 'domain/ait.entity';
import { PrismaService } from '../prisma.service';
import { AITMapper } from '../mappers/prisma-ait.mapper';

@Injectable()
export class PrismaAITRepository implements IAITRepository {
  constructor(private prisma: PrismaService) {}
  async findById(id: string): Promise<AIT | null> {
    const ait = await this.prisma.aIT.findFirst({
      where: { id: id },
    });
    if (!ait) {
      return null;
    } else {
      const result = AITMapper.toDomain(ait);
      return result;
    }
  }

  async create(ait: AIT): Promise<void> {
    await this.prisma.aIT.create({
      data: AITMapper.toPrisma(ait),
    });
  }

  async findAll(
    limit: number,
    page: number,
  ): Promise<GetListAitsResponse | null> {
    const skip = (page - 1) * limit;
    const aitsData = await this.prisma.aIT.findMany({ skip, take: limit });

    const total = await this.prisma.aIT.count();

    const aits = AITMapper.toDomainList(aitsData);

    return { aits, total };
  }

  async findByPlacaVeiculo(placaVeiculo: string): Promise<AIT[]> {
    const aits = await this.prisma.aIT.findMany({
      where: { placa_veiculo: placaVeiculo },
    });

    return AITMapper.toDomainList(aits);
  }

  async update(id: string, ait: AIT): Promise<void> {
    await this.prisma.aIT.update({
      where: { id },
      data: AITMapper.toPrisma(ait),
    });
  }

  async removeById(id: string): Promise<AIT> {
    const ait = await this.prisma.aIT.delete({
      where: { id },
    });

    const result = AITMapper.toDomain(ait);
    return result;
  }
}

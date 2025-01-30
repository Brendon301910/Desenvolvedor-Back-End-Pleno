import { AIT as AITPrisma } from '@prisma/client';
import { AIT } from 'domain/ait.entity';

export class AITMapper {
  static toDomain(aitPrisma: AITPrisma): AIT {
    return new AIT({
      placaVeiculo: aitPrisma.placa_veiculo,
      dataInfracao: aitPrisma.data_infracao,
      descricao: aitPrisma.descricao,
      valorMulta: aitPrisma.valor_multa,
      id: aitPrisma.id,
    });
  }

  static toPrisma(aitDomain: AIT): Omit<AITPrisma, 'id'> {
    return {
      placa_veiculo: aitDomain.placaVeiculo,
      data_infracao: aitDomain.dataInfracao,
      descricao: aitDomain.descricao,
      valor_multa: aitDomain.valorMulta,
    };
  }

  static toDomainList(aitsPrisma: AITPrisma[]): AIT[] {
    return aitsPrisma.map(AITMapper.toDomain);
  }

  static toPrismaList(aitsDomain: AIT[]): Omit<AITPrisma, 'id'>[] {
    return aitsDomain.map(AITMapper.toPrisma);
  }
}

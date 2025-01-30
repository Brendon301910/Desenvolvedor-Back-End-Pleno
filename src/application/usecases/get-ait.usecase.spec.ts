import { NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { AIT } from 'domain/ait.entity';
import { GetAITUseCase } from './get-ait.usecase';
import { IAITRepository } from 'application/contracts/repositories/ait.repository';
import { Test, TestingModule } from '@nestjs/testing';

describe('GetAITUseCase', () => {
  let useCase: GetAITUseCase;
  let aitRepositoryMock: jest.Mocked<IAITRepository>;

  beforeEach(async () => {
    aitRepositoryMock = {
      create: jest.fn().mockResolvedValue(undefined), // Mock da função 'create' retornando uma promessa resolvida
      findAll: jest.fn(),
      findByPlacaVeiculo: jest.fn(),
      update: jest.fn(),
      removeById: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAITUseCase,
        {
          provide: IAITRepository,
          useValue: aitRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<GetAITUseCase>(GetAITUseCase);
  });

  describe('getByPlacaVeiculo', () => {
    it('should return AITs by placaVeiculo', async () => {
      const aitMock = new AIT({
        placaVeiculo: 'ABC1234',
        dataInfracao: new Date(),
        descricao: 'Descricao de teste',
        valorMulta: new Decimal(100), // Valor como Decimal
      });
      const aitsMock = [aitMock];

      aitRepositoryMock.findByPlacaVeiculo.mockResolvedValue(aitsMock);

      const result = await useCase.getByPlacaVeiculo({
        placaVeiculo: 'ABC1234',
      });

      expect(result).toEqual(aitsMock);
      expect(aitRepositoryMock.findByPlacaVeiculo).toHaveBeenCalledWith(
        'ABC1234',
      );
    });

    it('should throw NotFoundException if no AITs are found for the placaVeiculo', async () => {
      aitRepositoryMock.findByPlacaVeiculo.mockResolvedValue([]);

      await expect(
        useCase.getByPlacaVeiculo({
          placaVeiculo: 'ABC1234',
        }),
      ).rejects.toThrow(new NotFoundException('Placa não encontrada'));
    });
  });

  it('should return all AITs with pagination', async () => {
    const aitMock = new AIT({
      placaVeiculo: 'ABC1234',
      dataInfracao: new Date(),
      descricao: 'Descricao de teste',
      valorMulta: new Decimal(100), // Valor como Decimal
    });

    const aitsMock = {
      aits: [aitMock],
      total: 1,
    };

    aitRepositoryMock.findAll.mockResolvedValue(aitsMock);

    const result = await useCase.getAll({ limit: 10, page: 1 });

    // Corrigindo a expectativa para considerar a estrutura correta do retorno
    expect(result).toEqual({
      data: aitsMock, // Considerando a estrutura de 'aits' e 'total'
      metadata: aitsMock.total,
    });
    expect(aitRepositoryMock.findAll).toHaveBeenCalledWith(10, 1);
  });
});

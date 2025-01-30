import { CreateAITUseCase } from 'src/application/usecases/create-ait.usecase';
import { IAITRepository } from 'src/application/contracts/repositories/ait.repository';
import { AIT } from 'src/domain/ait.entity';
import { Decimal } from '@prisma/client/runtime/library';

describe('CreateAITUseCase', () => {
  let useCase: CreateAITUseCase;
  let repositoryMock: jest.Mocked<IAITRepository>;

  beforeEach(() => {
    repositoryMock = {
      create: jest.fn().mockResolvedValue(undefined),
      findAll: jest.fn(),
      findByPlacaVeiculo: jest.fn(),
      update: jest.fn(),
      removeById: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new CreateAITUseCase(repositoryMock);
  });

  it('should create a new AIT', async () => {
    const aitProps = {
      placaVeiculo: 'ABC1234',
      dataInfracao: new Date(),
      descricao: 'Descricao de teste',
      valorMulta: new Decimal(100),
    };

    const ait = new AIT(aitProps);

    await useCase.execute(ait);

    expect(repositoryMock.create).toHaveBeenCalledWith(ait);
    expect(repositoryMock.create).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when AIT is invalid (invalid plate)', async () => {
    const invalidAitProps = {
      placaVeiculo: 'ABC123',
      dataInfracao: new Date(),
      descricao: 'Descricao de teste',
      valorMulta: new Decimal(100),
    };

    try {
      new AIT(invalidAitProps);
    } catch (error) {
      expect(error.message).toBe(
        'placaVeiculo: too_small - a placa do veículo precisa ter no mínimo 7 caracteres',
      );
    }
  });

  it('should throw an error when AIT has a value of fine less than or equal to zero', async () => {
    const invalidAitProps = {
      placaVeiculo: 'ABC1234',
      dataInfracao: new Date(),
      descricao: 'Descricao de teste',
      valorMulta: new Decimal(0),
    };

    try {
      new AIT(invalidAitProps);
    } catch (error) {
      expect(error.message).toBe(
        'valorMulta: custom - o valor da multa precisa ser maior que zero',
      );
    }
  });
});

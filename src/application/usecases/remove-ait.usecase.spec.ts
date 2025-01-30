import { RemoveAITUseCase } from 'src/application/usecases/remove-ait.usecase';
import { IAITRepository } from 'src/application/contracts/repositories/ait.repository';
import { NotFoundException } from '@nestjs/common';
import { AIT } from 'src/domain/ait.entity';
import { Decimal } from '@prisma/client/runtime/library';

describe('RemoveAITUseCase', () => {
  let useCase: RemoveAITUseCase;
  let aitRepositoryMock: jest.Mocked<IAITRepository>;

  beforeEach(() => {
    aitRepositoryMock = {
      create: jest.fn().mockResolvedValue(undefined),
      findAll: jest.fn(),
      findByPlacaVeiculo: jest.fn(),
      update: jest.fn(),
      removeById: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new RemoveAITUseCase(aitRepositoryMock);
  });

  it('should remove an AIT by ID successfully', async () => {
    const aitMock = new AIT({
      placaVeiculo: 'ABC1234',
      dataInfracao: new Date(),
      descricao: 'Descricao de teste',
      valorMulta: new Decimal(100),
    });

    console.log(aitMock);

    aitRepositoryMock.removeById.mockResolvedValue(aitMock);

    const result = await useCase.removeById({ id: '123' });

    expect(result).toEqual(aitMock);
    expect(aitRepositoryMock.removeById).toHaveBeenCalledWith('123');
    expect(aitRepositoryMock.removeById).toHaveBeenCalledTimes(1);
  });

  it('should throw a NotFoundException when AIT is not found', async () => {
    aitRepositoryMock.removeById.mockResolvedValue(null);

    await expect(useCase.removeById({ id: '123' })).rejects.toThrow(
      new NotFoundException('AIT com ID 123 não encontrado.'),
    );
    expect(aitRepositoryMock.removeById).toHaveBeenCalledWith('123');
    expect(aitRepositoryMock.removeById).toHaveBeenCalledTimes(1);
  });
});

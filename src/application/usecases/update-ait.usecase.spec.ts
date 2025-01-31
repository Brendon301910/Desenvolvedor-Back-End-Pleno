import { UpdateAITUseCase } from 'src/application/usecases/update-ait.usecase';
import { IAITRepository } from 'src/application/contracts/repositories/ait.repository';
import { NotFoundException } from '@nestjs/common';
import { AIT } from 'src/domain/ait.entity';
import { Decimal } from '@prisma/client/runtime/library';

describe('UpdateAITUseCase', () => {
  let useCase: UpdateAITUseCase;
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

    useCase = new UpdateAITUseCase(aitRepositoryMock);
  });

  it('should update an AIT successfully', async () => {
    const existingAIT = new AIT({
      placaVeiculo: 'ABC1234',
      dataInfracao: new Date('2023-01-01'),
      descricao: 'Descricao anterior',
      valorMulta: new Decimal(100),
    });

    aitRepositoryMock.findById.mockResolvedValue(existingAIT);

    const updatedAITRequest = {
      id: '123',
      ait: {
        placa_veiculo: 'XYZ5678',
        data_infracao: new Date('2024-01-01'),
        descricao: 'Descricao atualizada',
        valor_multa: new Decimal(200),
      },
    };

    await useCase.execute(updatedAITRequest);

    expect(aitRepositoryMock.findById).toHaveBeenCalledWith('123');
    expect(aitRepositoryMock.update).toHaveBeenCalledWith(
      '123',
      expect.objectContaining({
        placaVeiculo: 'XYZ5678',
        dataInfracao: new Date('2024-01-01'),
        descricao: 'Descricao atualizada',
        valorMulta: new Decimal(200),
      }),
    );
    expect(aitRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(aitRepositoryMock.update).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when AIT is not found', async () => {
    aitRepositoryMock.findById.mockResolvedValue(null);

    const updatedAITRequest = {
      id: '123',
      ait: {
        placa_veiculo: 'XYZ5678',
        data_infracao: new Date('2024-01-01'),
        descricao: 'Descricao atualizada',
        valor_multa: new Decimal(200),
      },
    };
    await expect(useCase.execute(updatedAITRequest)).rejects.toThrow(
      new NotFoundException('AIT with ID 123 not found.'),
    );
    expect(aitRepositoryMock.findById).toHaveBeenCalledWith('123');
    expect(aitRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(aitRepositoryMock.update).not.toHaveBeenCalled();
  });
});

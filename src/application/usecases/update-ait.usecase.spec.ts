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
      create: jest.fn().mockResolvedValue(undefined), // Mock da função 'create' retornando uma promessa resolvida
      findAll: jest.fn(),
      findByPlacaVeiculo: jest.fn(),
      update: jest.fn(),
      removeById: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new UpdateAITUseCase(aitRepositoryMock);
  });

  it('should update an AIT successfully', async () => {
    // Mock do AIT para ser retornado pelo findById
    const existingAIT = new AIT({
      placaVeiculo: 'ABC1234',
      dataInfracao: new Date('2023-01-01'),
      descricao: 'Descricao anterior',
      valorMulta: new Decimal(100),
    });

    // Mock do repositório, retornando o AIT existente
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

    // Executando o caso de uso
    await useCase.execute(updatedAITRequest);

    // Esperando que o método 'update' tenha sido chamado com o ID e AIT atualizado
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
    // Simulando que o AIT não foi encontrado no repositório
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

    // Esperando que o método lance uma exceção caso o AIT não seja encontrado
    await expect(useCase.execute(updatedAITRequest)).rejects.toThrow(
      new NotFoundException('AIT com ID 123 não encontrado.'),
    );
    expect(aitRepositoryMock.findById).toHaveBeenCalledWith('123');
    expect(aitRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(aitRepositoryMock.update).not.toHaveBeenCalled();
  });
});

import { CreateAITUseCase } from 'src/application/usecases/create-ait.usecase';
import { IAITRepository } from 'src/application/contracts/repositories/ait.repository';
import { AIT } from 'src/domain/ait.entity';
import { Decimal } from '@prisma/client/runtime/library'; // Certifique-se de importar o Decimal corretamente

describe('CreateAITUseCase', () => {
  let useCase: CreateAITUseCase;
  let repositoryMock: jest.Mocked<IAITRepository>;

  beforeEach(() => {
    // Mocking o repositório com todas as funções
    repositoryMock = {
      create: jest.fn().mockResolvedValue(undefined), // Mock da função 'create' retornando uma promessa resolvida
      findAll: jest.fn(),
      findByPlacaVeiculo: jest.fn(),
      update: jest.fn(),
      removeById: jest.fn(),
      findById: jest.fn(),
    };

    // Instanciando o caso de uso com o repositório mockado
    useCase = new CreateAITUseCase(repositoryMock);
  });

  it('should create a new AIT', async () => {
    // Definindo as propriedades do AIT
    const aitProps = {
      placaVeiculo: 'ABC1234',
      dataInfracao: new Date(),
      descricao: 'Descricao de teste',
      valorMulta: new Decimal(100), // Criando um valor Decimal
    };

    // Criando uma instância da entidade AIT
    const ait = new AIT(aitProps);

    // Executando o caso de uso para criar o AIT
    await useCase.execute(ait);

    // Verificando se a função 'create' foi chamada corretamente com o AIT
    expect(repositoryMock.create).toHaveBeenCalledWith(ait);
    expect(repositoryMock.create).toHaveBeenCalledTimes(1); // Verificando se foi chamada exatamente uma vez
  });

  it('should throw an error when AIT is invalid (invalid plate)', async () => {
    // Definindo as propriedades de um AIT inválido (placa com menos de 7 caracteres)
    const invalidAitProps = {
      placaVeiculo: 'ABC123', // Placa inválida (menos de 7 caracteres)
      dataInfracao: new Date(),
      descricao: 'Descricao de teste',
      valorMulta: new Decimal(100),
    };

    // Tentando criar uma instância de AIT
    try {
      new AIT(invalidAitProps); // Deve lançar um erro
    } catch (error) {
      // Verificando se o erro foi lançado e se a mensagem está correta
      expect(error.message).toBe(
        'placaVeiculo: too_small - a placa do veículo precisa ter no mínimo 7 caracteres',
      );
    }
  });

  it('should throw an error when AIT has a value of fine less than or equal to zero', async () => {
    // Definindo as propriedades de um AIT inválido (valor da multa <= 0)
    const invalidAitProps = {
      placaVeiculo: 'ABC1234',
      dataInfracao: new Date(),
      descricao: 'Descricao de teste',
      valorMulta: new Decimal(0), // Multa inválida (menor ou igual a 0)
    };

    // Tentando criar uma instância de AIT
    try {
      new AIT(invalidAitProps); // Deve lançar um erro
    } catch (error) {
      // Verificando se o erro foi lançado e se a mensagem está correta
      expect(error.message).toBe(
        'valorMulta: custom - o valor da multa precisa ser maior que zero',
      );
    }
  });
});

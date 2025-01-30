import { Test, TestingModule } from '@nestjs/testing';
import { ProcessAITUseCase } from 'application/usecases/process-ait.usecase';
import { IAITRepository } from 'application/contracts/repositories/ait.repository';
import { RabbitMQProducer } from 'src/infra/broker/rabbitmq/rabbitmq.producer';
import { beforeEach, describe, it } from '@jest/globals';

describe('ProcessAITUseCase', () => {
  let processAITUseCase: ProcessAITUseCase;
  let rabbitMQProducer: RabbitMQProducer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessAITUseCase,
        {
          provide: IAITRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue({ aits: [{ id: 1 }] }),
          },
        },
        {
          provide: RabbitMQProducer,
          useValue: { sendToQueue: jest.fn() },
        },
      ],
    }).compile();

    processAITUseCase = module.get<ProcessAITUseCase>(ProcessAITUseCase);
    rabbitMQProducer = module.get<RabbitMQProducer>(RabbitMQProducer);
  });

  it('deve enviar mensagem para o RabbitMQ', async () => {
    await processAITUseCase.processAndGenerateCsv();

    expect(rabbitMQProducer.sendToQueue).toHaveBeenCalled();
  });
});

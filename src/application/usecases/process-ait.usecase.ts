import { Injectable } from '@nestjs/common';
import { IAITRepository } from 'application/contracts/repositories/ait.repository';
import { createObjectCsvWriter } from 'csv-writer';
import { join } from 'path';
import * as fs from 'fs';
import * as iconv from 'iconv-lite';
import { RabbitMQProducer } from 'src/infra/broker/rabbitmq/rabbitmq.producer';

@Injectable()
export class ProcessAITUseCase {
  constructor(
    private readonly aitRepository: IAITRepository,
    private readonly rabbitMQProducer: RabbitMQProducer,
  ) {}

  async processAndGenerateCsv(): Promise<string> {
    const dirPath = join(__dirname, '..', '..', 'exports');

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const result = await this.aitRepository.findAll(100, 1);
    if (!result || !result.aits.length) {
      throw new Error('Nenhuma AIT encontrada para gerar o CSV!');
    }

    const filePath = join(
      __dirname,
      '..',
      '..',
      'exports',
      `ait_export_${Date.now()}.csv`,
    );

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'Id' },
        { id: 'placaVeiculo', title: 'Placa Veículo' },
        { id: 'dataInfracao', title: 'Data Infração' },
        { id: 'descricao', title: 'Descrição' },
        { id: 'valorMulta', title: 'Valor Multa' },
      ],
      encoding: 'utf8',
    });

    await csvWriter.writeRecords(result.aits);

    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const bom = '\uFEFF';
    fs.writeFileSync(filePath, bom + csvContent, 'utf8');

    await this.rabbitMQProducer.sendToQueue(filePath);

    return `Arquivo CSV gerado com sucesso! Caminho: ${filePath}`;
  }
}

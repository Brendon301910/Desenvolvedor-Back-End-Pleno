import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RabbitMQConfig } from './rabbitmq.config';

@Injectable()
export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async connect() {
    try {
      this.connection = await amqp.connect(RabbitMQConfig.uri);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(RabbitMQConfig.queue, { durable: true });
    } catch (err) {
      console.error('Erro ao conectar com RabbitMQ', err);
      throw new Error('Falha ao conectar ao RabbitMQ');
    }
  }

  getChannel() {
    return this.channel;
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }
}

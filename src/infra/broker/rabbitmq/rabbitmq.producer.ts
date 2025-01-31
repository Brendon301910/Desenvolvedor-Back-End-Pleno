import { Injectable, OnModuleInit } from '@nestjs/common';
import { Channel, Connection, connect } from 'amqplib';
import { RABBITMQ_SERVICE } from './rabbitmq.constants';

@Injectable()
export class RabbitMQProducer implements OnModuleInit {
  private channel: Channel;
  private connection: Connection;

  constructor() {}

  async onModuleInit() {
    this.connection = await connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue('csv_queue', { durable: true });
  }

  async sendToQueue(message: any) {
    try {
      if (!this.channel) {
        throw new Error('Channel was not created correctly');
      }
      this.channel.sendToQueue(
        'csv_queue',
        Buffer.from(JSON.stringify(message)),
      );
    } catch (error) {
      console.error('Error sending message to RabbitMQ:', error);
      throw error;
    }
  }
}

import { Module } from '@nestjs/common';
import { RabbitMQProducer } from './rabbitmq.producer';
import { RABBITMQ_SERVICE } from './rabbitmq.constants';
import { RabbitMQConsumer } from './rabbitmq.consumer';

@Module({
  providers: [
    RabbitMQProducer,
    {
      provide: RABBITMQ_SERVICE,
      useFactory: async () => {
        const amqp = require('amqplib');
        const connection = await amqp.connect('amqp://localhost');
        return connection;
      },
    },
    RabbitMQConsumer,
  ],
  exports: [RabbitMQProducer, RabbitMQConsumer],
})
export class RabbitMQModule {}

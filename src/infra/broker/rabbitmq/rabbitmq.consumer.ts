import { url } from 'inspector';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Channel, Connection, connect } from 'amqplib';
import axios from 'axios';
import path from 'path';
import * as fs from 'fs';

@Injectable()
export class RabbitMQConsumer implements OnModuleDestroy {
  private channel: Channel;
  private connection: Connection;

  constructor() {}

  async onModuleInit() {
    this.connection = await connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue('csv_queue', { durable: true });
    this.consumeQueue();
  }

  private consumeQueue() {
    this.channel.consume(
      'csv_queue',
      (msg) => {
        if (msg) {
          const messageContent = JSON.parse(msg.content.toString());
          console.log('Message received from queue:', messageContent);

          this.downloadMessage(messageContent);

          this.channel.ack(msg);
        }
      },
      { noAck: false },
    );
  }

  private downloadMessage(messageContent: any) {
    try {
      const sourcePath = messageContent;
      const destinationDir = path.join(__dirname, 'downloads');

      if (fs.existsSync(sourcePath)) {
        if (!fs.existsSync(destinationDir)) {
          fs.mkdirSync(destinationDir, { recursive: true });
        }

        const destinationPath = path.join(
          destinationDir,
          path.basename(sourcePath),
        );

        fs.copyFileSync(sourcePath, destinationPath);

        console.log('File successfully copied to:', destinationPath);
      } else {
        console.error('The file was not found:', sourcePath);
      }
    } catch (error) {
      console.error('Error moving file:', error);
    }
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}

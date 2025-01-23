import ampq, { Channel, Connection } from 'amqplib';
import { env } from './env';
import logger from './logger';

export class RabbitMQ {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private url = env.rabbitmq.url || 'amqp://localhost:5672';

  public async connect(): Promise<void> {
    if (this.channel) return;

    try {
      this.connection = await ampq.connect(this.url);
      this.channel = await this.connection.createChannel();
      logger.info('Conectado ao RabbitMQ com sucesso!');

      this.connection.on('error', (error: Error) => {
        logger.error('Erro ao conectar ao RabbitMQ:', error);
        this.close();
      });

      this.connection.on('close', () => {
        logger.warn('Conexao ao RabbitMQ fechada!');
        this.connection = null;
        this.channel = null;
      });
    } catch (error) {
      logger.error('Erro ao conectar ao RabbitMQ:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      logger.info('Conexao ao RabbitMQ fechada com sucesso!');
    } catch (error) {
      logger.error('Erro ao fechar conexao ao RabbitMQ:', error);
    }
  }

  public async sendToQueue(queueName: string, message: unknown) {
    if (!this.channel) {
      logger.warn('Canal nao conectado ao RabbitMQ! Conectando...');
      await this.connect();
    }
    try {
      await this.channel!.assertQueue(queueName, { durable: true });
      this.channel!.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(message)),
      );
      logger.info('Mensagem enviada ao RabbitMQ com sucesso!');
    } catch (error) {
      logger.error(
        'Erro ao enviar mensagem ao RabbitMQ:',
        (error as Error).message,
      );
      throw error;
    }
  }

  public isConnected(): boolean {
    return !!this.channel && !!this.connection;
  }
}

export const rabbitmq = new RabbitMQ();

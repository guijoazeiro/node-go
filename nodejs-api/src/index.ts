import express from 'express';
import helmet from 'helmet';
import router from './routes';
import { initializeDatabase } from './db';
import { env } from './config/env';
import logger from './config/logger';
import morgan from 'morgan';
import { rabbitmq } from './config/rabbitmq';

const PORT: number = env.app.port;
const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
const startServer = async () => {
  try {
    await initializeDatabase();
    await rabbitmq.connect();

    app.use('/api', router);

    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error('Erro ao iniciar o servidor:', error);
  }
};

startServer();

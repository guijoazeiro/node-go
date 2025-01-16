import express from 'express';
import helmet from 'helmet';
import router from './routes';
import { initializeDatabase } from './db';
import { env } from './config/env';

const PORT: number = env.app.port;
const app = express();

app.use(express.json());
app.use(helmet());
const startServer = async () => {
  try {
    await initializeDatabase();

    app.use('/api', router);

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
  }
};

startServer();

import { config } from 'dotenv-safe';

config();

export const env = {
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
  },
  app: {
    port: Number(process.env.APP_PORT),
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL,
  },
};

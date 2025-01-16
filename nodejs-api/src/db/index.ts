import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { env } from '../config/env';
import logger from '../config/logger';

const pool = new Pool({
  user: env.db.user,
  host: env.db.host,
  database: env.db.database,
  password: env.db.password,
  port: env.db.port,
});

export const initializeDatabase: () => Promise<void> =
  async (): Promise<void> => {
    try {
      const client: PoolClient = await pool.connect();
      logger.info('Conexão com o banco de dados estabelecida com sucesso!');
      client.release();
    } catch (err) {
      logger.error('Erro ao conectar com o banco de dados:', err);
      process.exit(1);
    }
  };

export const query: <T extends QueryResultRow>(
  query: string,
  params?: unknown[],
) => Promise<T[] | undefined> = async <T extends QueryResultRow>(
  query: string,
  params?: unknown[],
): Promise<T[] | undefined> => {
  const client: PoolClient = await pool.connect();
  try {
    const result: QueryResult<T> = await client.query(query, params);
    return result.rows;
  } catch (error) {
    logger.error('Erro ao executar a query', error);
  } finally {
    client.release();
  }
};

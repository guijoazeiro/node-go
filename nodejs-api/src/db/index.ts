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

export const generateUpdateQuery = async <
  T extends Record<string, string | number | boolean | null | undefined>,
  U extends Record<string, string | number | boolean | null | undefined>,
>(
  tableName: string,
  data: T,
  conditions?: U,
): Promise<string> => {
  if (!tableName || typeof tableName !== 'string') {
    throw new Error('O nome da tabela é obrigatório e deve ser uma string.');
  }

  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    throw new Error(
      'Os dados para atualização devem ser um objeto com pelo menos um campo.',
    );
  }

  const filterObject = <
    V extends Record<string, string | number | boolean | null | undefined>,
  >(
    obj: V,
  ): Record<string, string | number | boolean> => {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, value]) => value !== undefined && value !== null,
      ),
    ) as Record<string, string | number | boolean>;
  };

  const filteredData = filterObject(data);
  const filteredConditions = conditions ? filterObject(conditions) : {};

  if (Object.keys(filteredData).length === 0) {
    throw new Error(
      'O objeto de dados não pode estar vazio após remover valores inválidos.',
    );
  }

  const setClause = Object.entries(filteredData)
    .map(
      ([key, value]) =>
        `${key} = ${typeof value === 'string' ? `'${value}'` : value}`,
    )
    .join(', ');

  let whereClause = '';
  if (Object.keys(filteredConditions).length > 0) {
    whereClause =
      'WHERE ' +
      Object.entries(filteredConditions)
        .map(
          ([key, value]) =>
            `${key} = ${typeof value === 'string' ? `'${value}'` : value}`,
        )
        .join(' AND ');
  }

  return `UPDATE ${tableName} SET ${setClause} ${whereClause};`;
};

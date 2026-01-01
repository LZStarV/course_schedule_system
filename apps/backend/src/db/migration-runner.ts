import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { devConfig } from '@packages/config';
import { createLogger } from '../common/logger';

const log = createLogger('db-migrations');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: devConfig.database.host,
  port: devConfig.database.port,
  username: devConfig.database.user,
  password: devConfig.database.password,
  database: devConfig.database.name,
  logging: devConfig.database.logging
    ? (msg: string) => log.info(msg)
    : false,
  define: { underscored: true },
  timezone: '+08:00',
});

function getUmzug() {
  const migrationPath = path.join(
    __dirname,
    './migrations/*.ts'
  );
  const globPath = migrationPath.replace(/\\/g, '/');
  return new Umzug({
    migrations: {
      glob: globPath,
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({
      sequelize,
      tableName: 'SequelizeMeta',
    }),
    logger: {
      info: (message: any) =>
        log.info(
          typeof message === 'string'
            ? message
            : JSON.stringify(message)
        ),
      warn: (message: any) =>
        log.warn(
          typeof message === 'string'
            ? message
            : JSON.stringify(message)
        ),
      error: (message: any) =>
        log.error(
          typeof message === 'string'
            ? message
            : JSON.stringify(message)
        ),
      debug: (message: any) =>
        log.debug(
          typeof message === 'string'
            ? message
            : JSON.stringify(message)
        ),
    },
  });
}

export async function migrateUpAll() {
  const umzug = getUmzug();
  return umzug.up();
}

export async function migrateDownOne() {
  const umzug = getUmzug();
  return umzug.down();
}

export async function migrateStatus() {
  const umzug = getUmzug();
  const executed = await umzug.executed();
  const pending = await umzug.pending();
  return {
    executed: executed.map(m => m.name),
    pending: pending.map(m => m.name),
  };
}

export async function closeSequelize() {
  await sequelize.close();
}

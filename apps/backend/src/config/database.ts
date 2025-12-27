import path from 'path';
import { devConfig } from '@packages/config';

const config = {
  development: {
    username: (devConfig as any).database.user,
    password: (devConfig as any).database.password,
    database: (devConfig as any).database.name,
    host: (devConfig as any).database.host,
    port: (devConfig as any).database.port,
    dialect: 'postgres',
    dialectOptions: {
      ssl: (devConfig as any).database.ssl || false,
    },
    logging: (devConfig as any).database.logging ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      charset: 'utf8mb4',
    },
    timezone: '+08:00',
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
    models: [path.join(__dirname, '../models/**/*.ts')],
  },
  test: {
    username: 'course_test',
    password: 'test_password',
    database: 'course_select_test',
    host: 'localhost',
    port: 5433,
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  },
  production: {
    username: process.env.DB_PROD_USER,
    password: process.env.DB_PROD_PASSWORD,
    database: process.env.DB_PROD_NAME,
    host: process.env.DB_PROD_HOST,
    port: parseInt(process.env.DB_PROD_PORT || '5432'),
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
    pool: {
      max: 50,
      min: 10,
      acquire: 30000,
      idle: 10000,
    },
  },
};

export default config;

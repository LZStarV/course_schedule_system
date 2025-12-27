export const devConfig = {
  frontend: {
    port: 5173,
    baseUrl: 'http://localhost:5173',
  },
  backend: {
    port: 3001,
    baseUrl: 'http://localhost:3001',
    rpcPath: '/rpc',
  },
  database: {
    user: 'course_admin',
    password: 'password',
    name: 'course_select',
    host: 'localhost',
    port: 5432,
    ssl: false,
    logging: false,
  },
};

export const config = devConfig;

export type DevConfig = typeof devConfig;
export type AppConfig = typeof config;

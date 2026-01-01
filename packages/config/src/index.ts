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
    port: 5932,
    ssl: false,
    logging: false,
  },
  redis: {
    host: 'localhost',
    port: 56379,
    password: 'dev_redis_password',
    db: 0,
  },
  jwt: {
    accessSecret: 'dev_access_secret',
    accessExpiresIn: '2h',
    refreshSecret: 'dev_refresh_secret',
    refreshExpiresIn: '7d',
  },
  rateLimit: {
    maxPerMinute: 60,
  },
};

export const config = devConfig;

export type DevConfig = typeof devConfig;
export type AppConfig = typeof config;

import pino, { type LoggerOptions } from 'pino';

export function createLogger(service: string) {
  const opts: LoggerOptions = {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'SYS:standard', singleLine: true },
    },
  };
  const base = pino(opts);
  return base.child({ service });
}

export const logger = createLogger('backend');

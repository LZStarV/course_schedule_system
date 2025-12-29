import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export function validateDto<T>(cls: new (...args: any[]) => T, params: Record<string, unknown>): T {
  const instance = plainToInstance(cls, params);
  const errors = validateSync(instance as any, { whitelist: true, forbidNonWhitelisted: true });
  if (errors.length) {
    const messages = errors.flatMap(e => Object.values(e.constraints ?? {}));
    const error = new Error(messages.join('; '));
    (error as any).status = 400;
    throw error;
  }
  return instance;
}

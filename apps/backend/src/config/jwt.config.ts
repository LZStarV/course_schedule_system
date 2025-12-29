import { devConfig } from '@packages/config';

export const jwtConfig = {
  accessSecret: devConfig.jwt.accessSecret,
  accessExpiresIn: devConfig.jwt.accessExpiresIn,
  refreshSecret: devConfig.jwt.refreshSecret,
  refreshExpiresIn: devConfig.jwt.refreshExpiresIn,
};

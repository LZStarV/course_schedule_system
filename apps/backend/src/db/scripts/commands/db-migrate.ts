import {
  migrateUpAll,
  closeSequelize,
} from '../../migration-runner';
import { createLogger } from '../../../common/logger';

const log = createLogger('db-cli');

async function main() {
  try {
    await migrateUpAll();
    log.info('migrations applied');
  } catch (e: any) {
    log.error(e?.stack || String(e));
    process.exitCode = 1;
  } finally {
    await closeSequelize();
  }
}

main();

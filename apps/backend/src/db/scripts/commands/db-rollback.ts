import {
  migrateDownOne,
  closeSequelize,
} from '../../migration-runner';

async function main() {
  try {
    await migrateDownOne();
  } finally {
    await closeSequelize();
  }
}

main();

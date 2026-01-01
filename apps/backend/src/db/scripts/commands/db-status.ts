import {
  migrateStatus,
  closeSequelize,
} from '../../migration-runner';

async function main() {
  try {
    const status = await migrateStatus();
    console.log(JSON.stringify(status, null, 2));
  } finally {
    await closeSequelize();
  }
}

main();

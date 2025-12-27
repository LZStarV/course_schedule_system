#!/usr/bin/env bash
set -euo pipefail
docker compose -f "$(dirname "$0")/../docker-compose.db.yml" up -d postgres redis
"$(dirname "$0")/migrate.sh"
"$(dirname "$0")/seed.sh"

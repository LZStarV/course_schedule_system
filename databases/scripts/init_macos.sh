#!/usr/bin/env bash
set -euo pipefail
docker compose -f "$(dirname "$0")/../docker-compose.db.yml" up -d postgres redis
bash "$(dirname "$0")/migrate.sh"
bash "$(dirname "$0")/seed.sh"

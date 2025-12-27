#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
pnpm --filter @databases/tooling run build
pnpm --filter @databases/tooling exec sequelize db:migrate

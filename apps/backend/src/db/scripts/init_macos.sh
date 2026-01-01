#!/usr/bin/env bash
set -euo pipefail

log() { echo "[$(date +'%H:%M:%S')] $*"; }
has_cmd() { command -v "$1" >/dev/null 2>&1; }
wait_docker() {
  local i=0
  local max=${1:-60}
  while (( i < max )); do
    if docker info >/dev/null 2>&1; then return 0; fi
    sleep 2
    i=$((i+1))
  done
  return 1
}

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../.." && pwd)"
COMPOSE_FILE="$PROJECT_ROOT/apps/backend/docker-compose.db.yml"

if ! has_cmd docker; then
  log "docker 未安装或未在 PATH 中"
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  log "尝试启动 Docker Desktop"
  open -a Docker || true
  if ! wait_docker 90; then
    if has_cmd colima; then
      log "尝试启动 colima"
      colima start || true
      if ! wait_docker 60; then
        log "无法连接到 Docker 守护进程"
        exit 1
      fi
    else
      log "无法连接到 Docker 守护进程"
      exit 1
    fi
  fi
fi

log "启动数据库容器"
if docker ps -a --format '{{.Names}}' | grep -q '^course_pg$'; then
  docker start course_pg || true
else
  docker compose -f "$COMPOSE_FILE" up -d postgres || true
fi
docker compose -f "$COMPOSE_FILE" up -d redis || true

log "等待 Postgres 就绪"
for i in $(seq 1 30); do
  if docker exec course_pg pg_isready -U course_admin -d course_select >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

if ! docker exec course_pg pg_isready -U course_admin -d course_select >/dev/null 2>&1; then
  log "Postgres 未就绪，请检查容器日志"
  docker logs course_pg | tail -n 50 || true
  exit 1
fi

if ! has_cmd pnpm; then
  log "pnpm 未安装"
  exit 1
fi

log "安装依赖（如需）"
(cd "$PROJECT_ROOT" && pnpm install) || log "依赖安装失败，继续尝试迁移"

log "执行迁移"
pnpm -F @apps/backend migrate:dev || { log "迁移失败"; exit 1; }

log "查看迁移状态"
pnpm -F @apps/backend migrate:status || { log "状态查询失败"; exit 1; }

log "注入种子数据"
pnpm -F @apps/backend seed:dev || { log "种子执行失败"; exit 1; }

log "注入批量假数据（大规模）"
pnpm -F @apps/backend seed:bulk || { log "批量种子执行失败"; exit 1; }

log "校验扩展、表、触发器"
pnpm -F @apps/backend db:validate || { log "校验失败"; exit 1; }

log "初始化完成"

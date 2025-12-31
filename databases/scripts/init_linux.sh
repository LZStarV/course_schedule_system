#!/usr/bin/env bash
set -euo pipefail

DIR="$(dirname "$0")"

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

if ! has_cmd docker; then
  log "docker 未安装或未在 PATH 中"
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  log "尝试启动 Docker 服务"
  if has_cmd systemctl; then
    sudo systemctl start docker || true
  elif has_cmd service; then
    sudo service docker start || true
  fi
  if ! wait_docker 90; then
    log "无法连接到 Docker 守护进程"
    exit 1
  fi
fi

docker compose -f "$DIR/../docker-compose.db.yml" up -d postgres redis
bash "$DIR/migrate.sh"
bash "$DIR/seed.sh"

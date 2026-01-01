@echo off

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%..\..\..\..\.."
set "COMPOSE_FILE=%PROJECT_ROOT%\apps\backend\docker-compose.db.yml"

echo [INFO] Starting database initialization...
echo.

echo [INFO] Starting database containers...

docker compose -f "%COMPOSE_FILE%" up -d redis

docker ps -a --format "%%{Names}" | findstr "^course_pg$" >nul
if errorlevel 1 (
    docker compose -f "%COMPOSE_FILE%" up -d postgres
) else (
    docker start course_pg
)

echo [INFO] Waiting for Postgres to be ready...

for /l %%i in (1,1,30) do (
    docker exec course_pg pg_isready -U course_admin -d course_select >nul 2>&1
    if not errorlevel 1 goto postgres_ready
    timeout /t 2 >nul
)

echo [ERROR] Postgres is not ready
goto end

:postgres_ready
echo [INFO] Postgres is ready

cd /d "%PROJECT_ROOT%"

echo [INFO] Installing dependencies...
call pnpm install

echo [INFO] Running migrations...
call pnpm -F @apps/backend migrate:dev

echo [INFO] Checking migration status...
call pnpm -F @apps/backend migrate:status

echo [INFO] Seeding initial data...
call pnpm -F @apps/backend seed:dev

echo [INFO] Seeding bulk test data...
call pnpm -F @apps/backend seed:bulk

echo [INFO] Validating database...
call pnpm -F @apps/backend db:validate

echo [INFO] Initialization completed!
echo.
echo You can now start the services:
echo Backend:  pnpm -F @apps/backend dev
echo Frontend: pnpm -F @apps/frontend dev
echo.

:end
pause
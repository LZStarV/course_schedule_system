@echo off
echo Starting database initialization...

rem Check if Docker is installed
docker --version
if errorlevel 1 (
    echo ERROR: Docker not found
    goto end
)

echo Docker is installed

rem Check if Docker is running
docker info
if errorlevel 1 (
    echo Docker is not running
    echo Please start Docker Desktop manually
    goto end
)

echo Docker is running

rem Change to databases directory
cd "%~dp0.."

rem Start containers
docker compose -f docker-compose.db.yml up -d postgres redis

if errorlevel 1 (
    echo ERROR: Failed to start containers
    goto end
)

echo Waiting for database...
timeout /t 10

rem Run migrations
echo Running migrations...
call pnpm --filter @databases/tooling run build
call pnpm --filter @databases/tooling exec sequelize db:migrate

if errorlevel 1 (
    echo ERROR: Migration failed
    goto end
)

rem Run seeds
echo Running seed data...
call pnpm --filter @databases/tooling exec sequelize db:seed:all

if errorlevel 1 (
    echo ERROR: Seed failed
    goto end
)

echo Database initialization completed!
echo.
echo You can now start:
echo Backend:  pnpm -F @apps/backend dev
echo Frontend: pnpm -F @apps/frontend dev

:end
pause
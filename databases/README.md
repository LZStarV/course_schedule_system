# 数据库目录说明

- 本目录中的 yml/sql/sh 文件无法读取 packages/config 的 TS 配置，开发环境使用硬编码参数，仅用于本机。
- 修改数据库容器参数请直接编辑 docker-compose.db.yml；应用侧连接参数由 packages/config 提供。
- 初始化步骤：
  - docker compose -f databases/docker-compose.db.yml up -d postgres redis
  - ./databases/scripts/migrate.sh
  - ./databases/scripts/seed.sh

- 常用命令：
  - ./databases/scripts/status.sh 查看迁移状态

- 存储策略：
  - 不再将 PostgreSQL 数据持久化到宿主机；docker 使用匿名卷，容器销毁时数据同时清理
  - 如需“干净重置”，使用 `docker compose -f databases/docker-compose.db.yml down -v` 清除卷后再启动

## 初始化数据库（sequelize-cli + TS 编译）

- 启动数据库容器：
  - docker compose -f databases/docker-compose.db.yml up -d postgres redis
- 编译迁移与种子（TS → dist/commonjs）：
  - pnpm --filter @databases/tooling run build
- 执行迁移：
  - pnpm --filter @databases/tooling exec sequelize db:migrate
- 执行种子：
  - pnpm --filter @databases/tooling exec sequelize db:seed:all
- 查看迁移状态：
  - pnpm --filter @databases/tooling exec sequelize db:migrate:status
- 撤销所有种子（可选）：
  - pnpm --filter @databases/tooling exec sequelize db:seed:undo:all

## 一键执行（脚本）

- 迁移：
  - ./databases/scripts/migrate.sh
- 种子：
  - ./databases/scripts/seed.sh

## 原理说明

- 容器与数据目录
  - 仅数据库使用容器；应用在本机运行，降低复杂度与耦合
  - 不将数据持久化到宿主机，使用匿名卷；`down -v` 会同时删除卷，实现“干净重置”，下次启动会重新执行初始化脚本
  - 端口避免冲突：PostgreSQL 映射到宿主机 55432（容器 5432）、Redis 映射到宿主机 6380（容器 6379）

- 初始化脚本执行机制
  - PostgreSQL 的入口会在数据目录为空时自动执行 `/docker-entrypoint-initdb.d` 下的脚本，仅首次有效
  - 我们的脚本：
    - 01-create-extensions.sql 启用 `uuid-ossp`、`pgcrypto`、`pg_trgm`
    - 02-init-user-db.sql 创建 `course_admin` 角色与 `course_select` 数据库

- 迁移的编译与执行链路（sequelize-cli）
  - 迁移与种子源码为 TS，位于 `databases/migrations` 与 `databases/seeders`
  - 通过 tsconfig.json 编译为 CommonJS 输出到 `databases/dist`
  - CLI 配置文件 config.js 提供连接信息（localhost:55432 / course_admin / password / course_select）
  - CLI 路径在 .sequelizerc 指向 `dist/migrations` 与 `dist/seeders`
  - CLI 以时间戳顺序执行迁移，并使用 `SequelizeMeta` 表记录状态；`db:migrate:status` 即读取该表进行展示

- 种子数据的幂等与数据类型
  - 幂等策略：通过原生 SQL 的 `ON CONFLICT DO NOTHING` 避免重复插入导致唯一约束错误（例如 `users.username`、`departments.code`、`courses.course_code`）
  - JSONB 字段：对 `schedule`、`location_details`、`attachments`、`restrictions` 等以 `::jsonb` 插入，值通过 `JSON.stringify(...)` 提供
  - 种子执行顺序与依赖关系：系统角色 → 超级管理员 → 院系 → 课程；课程写入前查询院系与管理员 ID 以确保引用存在
  - 相关文件：
    - create-system-roles.ts
    - create-super-admin.ts
    - create-departments.ts
    - create-sample-courses.ts

- 工作区执行与命令分发
  - 使用 `pnpm --filter @databases/tooling exec ...` 在数据库包上下文中执行 CLI，确保依赖与路径解析正确
  - 先 `build` 再执行 `db:migrate` / `db:seed:all`，保证 CLI 读取的是编译产物

- 常见问题与处理
  - 端口占用：若 6379/5432 已被其他服务占用，使用当前映射（6380/55432），或调整 compose 端口后同步更新 CLI 配置
  - 初始化脚本未执行：确保使用 `down -v` 清理卷后重启，使 `/docker-entrypoint-initdb.d` 在空数据目录时生效
  - 重复种子报错：使用 `db:seed:undo:all` 撤销后重跑，或依靠已加入的 `ON CONFLICT DO NOTHING` 保持幂等

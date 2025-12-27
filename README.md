# 研究生排课系统

## 项目概述

- 研究生排课系统的 Monorepo 仓库，采用 pnpm + workspace 管理前端、后端与共享包
- 技术栈：前端 Vite + Vue3 + TS；后端 NestJS + TS；开发配置集中于 packages/config

## 环境要求

- Node.js ≥ 18（建议 18.x）
- pnpm = 10.26.2（根 packageManager 已锁定为该版本）
- 可选：Docker（仅数据库容器使用），当前阶段可不启用数据库

## 快速开始

```bash
# 安装依赖（根目录）
pnpm install

# 数据库迁移
./databases/scripts/migrate.sh
# 数据库种子
./databases/scripts/seed.sh

# 启动后端（NestJS，默认端口 3001）
pnpm -F @apps/backend dev
# 访问 http://localhost:3001/

# 启动前端（Vite，默认端口 5173）
pnpm -F @apps/frontend dev
# 访问 http://localhost:5173/

# 分项目 Format
pnpm -F @apps/backend format
pnpm -F @apps/frontend format
```

## 工作区结构

- apps/frontend（前端应用）
- apps/backend（后端应用）
- packages/shared-types（共享类型）
- packages/runtime-validation（运行时校验）
- packages/utils（通用工具）
- packages/config（统一公共配置）
- databases（数据库容器与迁移脚本，当前阶段可不启用）

## 配置说明

- 全部配置统一使用 packages/config 提供的配置
- 使用示例：
  - `import { config } from '@packages/config'`
  - 包含前端/后端端口、基础地址、RPC 路径与数据库连接参数等

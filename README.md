# 研究生排课系统

## 项目概述

- 研究生排课系统的 Monorepo 仓库，采用 pnpm + workspace 管理前端、后端与共享包
- 技术栈：前端 Vite + Vue3 + TS；后端 NestJS + TS；开发配置集中于 packages/config

## 环境要求

- Node.js ≥ 18（建议 18.x）
- pnpm = 10.26.2（根 packageManager 已锁定为该版本）
- 可选：Docker（仅数据库容器使用），当前阶段可不启用数据库

## Git 配置（尤其是 Windows）

- 仓库统一使用 **LF (\n)** 作为换行符，由 EditorConfig、Prettier 和 ESLint 共同约束。
- Windows 环境下，请在 **当前仓库根目录** 先执行（只影响本仓库）：

```bash
git config core.autocrlf input
git config core.eol lf
```

- 建议使用支持 EditorConfig 的编辑器，并确保保存时使用 LF：
  - VS Code：保持 EditorConfig 扩展启用，右下角换行符显示为 `LF`。

**如果已经产生了大量“只改换行”的改动且尚未提交**：

- 确认没有重要未保存的业务代码后，可以使用：

```bash
git reset --hard HEAD
```

- 然后在新的配置下重新运行必要的格式化命令（如仅对当前修改的文件执行，或依靠 `lint-staged`）

## 快速开始

```bash
# 安装依赖（根目录）
pnpm install

# 数据库迁移与种子数据注入
# macOS
bash apps/backend/src/db/scripts/init_macos.sh
# Linux
bash apps/backend/src/db/scripts/init_linux.sh
# Windows
apps\backend\src\db\scripts\init_windows.bat

# 启动后端（NestJS，默认端口 3001）
pnpm -F @apps/backend dev
# 访问 http://localhost:3001/
# 健康检查 http://localhost:3001/health

# 启动前端（Vite，默认端口 5173）
pnpm -F @apps/frontend dev

# 分项目 Format
pnpm -F @apps/backend format
pnpm -F @apps/frontend format
```

## 测试账号（开发联调）

- 管理员（SUPER_ADMIN）
  - 用户名：superadmin
  - 密码：a123456
  - 邮箱：admin@course-select.edu
  - 说明：登录后具备系统管理权限，权限菜单由 Auth.GetPermissions 返回（包含用户管理、选课规则等）。

- 固定测试用户（便于检查各角色）
  - 管理员（ADMIN）：admin001 / a123456
  - 教师（TEACHER）：teacher001 / a123456
  - 学生（STUDENT）：student001 / a123456

提示：当前 AuthService 仅按用户名查找并签发 JWT，不做密码校验；后续启用密码哈希校验后将更新此说明。

## 配置说明

- 全部配置统一使用 packages/config 提供的配置
- 使用示例：
  - `import { config } from '@packages/config'`
  - 包含前端/后端端口、基础地址、RPC 路径与数据库连接参数等

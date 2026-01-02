# 前端（Vue 3）说明文档

## 一、总体概述

- 技术栈：Vue 3、Pinia、Vue Router、Naive UI、Axios、SCSS、TypeScript
- 运行方式：Vite 开发预览与构建，monorepo 通过 pnpm 管理共享包与配置
- 接口规范：语义化 RPC（`POST ${backend.apiPrefix}/:method`，默认 `/api/:method`），响应遵循 JSON‑RPC（`result/error`）

## 二、目录结构

```
apps/frontend/
├── src/
│   ├── api/                 # 请求层：transport + protocol
│   │   ├── client.ts        # Axios 实例、鉴权头、超时与错误归一化
│   │   ├── rpc.ts           # JSON‑RPC 适配器：call/notify/batch
│   ├── components/
│   │   ├── common/          # 通用组件（Breadcrumbs/FormWrapper/TablePagination等）
│   │   └── layout/          # 布局组件（HeaderBar/SidebarMenu）
│   ├── config/              # 前端配置（权限、请求超时）
│   │   ├── permissions.ts   # 角色→菜单与操作映射
│   │   └── request.ts       # REQUEST_TIMEOUT_MS（默认10s）
│   ├── layouts/             # 页面整体布局容器（AppLayout）
│   ├── pages/               # 按模块组织的页面，自动生成路由
│   │   ├── courses/...      # 课程中心（浏览/收藏/我的课程）
│   │   ├── enrollment/...   # 选课管理（选课操作/我的课表）
│   │   ├── grades/...       # 成绩录入与查询
│   │   ├── system/...       # 系统管理（用户管理/选课时间配置）
│   │   ├── login/           # 登录页
│   │   └── personal-center/ # 个人中心
│   ├── router/              # 路由与守卫
│   │   ├── index.ts         # 路由实例与基本结构
│   │   ├── auto-routes.ts   # 从 pages/**/index.vue 自动注册路由
│   │   └── guards.ts        # 登录与权限守卫
│   ├── stores/              # Pinia 状态（认证/权限/主题/用户）
│   ├── styles/              # 全局样式与主题（SCSS）
│   ├── types/               # 类型约定（角色/路由）
│   ├── App.vue / main.ts    # 应用入口
│
├── vite.config.ts           # Vite 配置与路径别名
├── package.json             # 前端脚本与依赖
└── README.md                # 本文档
```

## 三、快速开始

- 开发启动：`pnpm -F @apps/frontend dev`（默认端口 5173）
- 构建产物：`pnpm -F @apps/frontend build`
- 本地预览：`pnpm -F @apps/frontend preview`
- 代码格式化：`pnpm -F @apps/frontend format`（prettier + stylelint）

## 四、路径别名与导入规范

- 在 [vite.config.ts](./vite.config.ts) 中定义：`@`, `@api`, `@stores`, `@router`, `@components`, `@layouts`, `@styles`, `@types`
- 统一使用别名导入（如 `@/pages/login/index.vue`），避免相对路径层级复杂

## 五、路由与导航

- 路由结构：[router/index.ts](./src/router/index.ts)
  - `/login`：公开页；`/`：受保护的根路由，子路由由 `loadAutoRoutes()` 自动生成
- 自动路由：[router/auto-routes.ts](./src/router/auto-routes.ts)
  - 按约定从 `pages/**/index.vue` 生成路径，例如 `pages/enrollment/select/index.vue → /enrollment/select`
- 路由守卫：[router/guards.ts](./src/router/guards.ts)
  - 登录守卫：需认证页（`meta.requiresAuth = true`）未登录则跳 `/login`
  - 权限守卫：基于 `permission.store` 的菜单可见性控制，路由不在角色菜单中则跳转角色默认页

## 六、权限模型（前端）

- 角色枚举：[types/role.ts](./src/types/role.ts)
- 菜单与操作映射：[config/permissions.ts](./src/config/permissions.ts)
  - 每个菜单包含 `code/path/operations` 等；`operations` 用于按钮级权限（view/create/edit/delete…）
- 权限状态：[stores/permission.store.ts](./src/stores/permission.store.ts)
  - `getMenu(role)` 生成侧边栏；`isPathAllowed(path)` 控制路由可见；`can(moduleCode, operation?)` 控制按钮可见

## 七、认证与用户状态

- 认证存储：[stores/auth.store.ts](./src/stores/auth.store.ts)
  - 登录：调用 `api/modules/auth.login`，保存 `access_token/refresh_token/user_info` 到 localStorage
  - 初始化：应用启动或路由守卫中 `auth.init()` 同步本地状态并加载角色菜单
- 鉴权头注入：[api/client.ts](./src/api/client.ts)
  - 请求拦截器从 localStorage 读取 `access_token`，注入 `Authorization: Bearer <token>`

## 八、API 层约定

- 传输层：[api/client.ts](./src/api/client.ts)
  - `baseURL` 来自 `packages/config` 的 `backend.baseUrl`
  - 超时：默认 `REQUEST_TIMEOUT_MS=10000`，超时报 `REQUEST_TIMEOUT`
- 协议层：[api/rpc.ts](./src/api/rpc.ts)
  - `call(method, params, options?)`：返回 JSON‑RPC `result`
  - `notify(method, params, options?)`：发送 JSON‑RPC 封套且无 id（不返回响应）
  - `batch([{method, params}], options?)`：Promise.all 并行封装
  - 方法名引用：默认从共享包引入 `RPC` 分组对象（见下一节），不再手写字符串，也不再使用 `api/modules/*` 包装层。

## 九、布局与组件

- 布局容器：[layouts/AppLayout.vue](./src/layouts/AppLayout.vue)
  - 组合 [layout/HeaderBar.vue](./src/components/layout/HeaderBar.vue) 与 [layout/SidebarMenu.vue](./src/components/layout/SidebarMenu.vue)
- 通用组件：[components/common/\*](./src/components/common)
  - `Breadcrumbs` 面包屑
  - `FormWrapper` 表单容器
  - `PermissionWrapper` 权限包装（基于 `permission.store.can`）
  - `TablePagination` 表格分页器
- 图标映射：[components/layout/icon-map.ts](./src/components/layout/icon-map.ts)
  - 将菜单 `icon` 名称映射至 Naive UI/Vicons 图标组件

## 十、样式与主题

- 样式结构：[styles/\*](./src/styles)
  - 变量与混入：`_variables.scss`、`_mixins.scss`
  - 主题：`themes/light.scss`、`themes/dark.scss`
  - 全局样式：`global.scss`
- 建议：组件样式尽量局部 scoped；跨组件变量集中在 `_variables.scss`

## 十一、页面模块（示例）

- 选课管理
  - `/enrollment/select` 选课操作：表格筛选 + 选课提交
  - `/enrollment/schedule` 我的课表：周视图展示
- 课程中心
  - `/courses/browse` 浏览课程：筛选与分页
  - `/courses/favorites` 我的收藏：收藏列表与操作
  - `/courses/manage/my` 我的课程（教师）：课程编辑与管理
- 系统管理（管理员/超管）
  - `/system/users` 用户管理：增删改查
  - `/system/select-time` 选课时间配置：设置与保存
- 登录页 `/login`

## 十二、开发规范与脚手架

- 代码风格：ESLint + Prettier（`pnpm format` 自动修复）
- 样式规范：Stylelint 标准 + SCSS 扩展
- 命名约定：组件 PascalCase；store/useXxx；API 方法 `Domain.Action`
- 导入约定：统一使用路径别名；禁止复杂相对路径

## 十三、与后端约定

- 入口：`POST ${backend.apiPrefix}/:method`（默认 `/api/:method`）
- 响应：JSON‑RPC 2.0
  - 成功：`{ jsonrpc:"2.0", id, result }`
  - 失败：`{ jsonrpc:"2.0", id, error:{ code, message, data? } }`
- 通知：发送 JSON‑RPC 封套且不带 id（不返回响应体）
- 鉴权：后端对 `/api` 前缀应用日志/鉴权透传/限流中间件；前端在拦截器自动注入 Bearer Token

## 十四、RPC 方法名常量引用（默认导出）

- 目的：避免方法名字符串拼写错误，统一从共享包默认导出的分组对象引用。
- 生成方式：在后端运行 `pnpm -F @apps/backend rpc:export`，会生成 `packages/shared-types/src/rpc-methods.ts`，并由共享包默认导出。
- 引用示例：

```ts
import { call } from '@api/rpc';
import RPC from '@packages/shared-types';

// 登录
await call(RPC.Auth.Login, { username, password });

// 列表与分页
await call(RPC.Admin.ListUsers, { page: 1, page_size: 20 });
```

- 迁移说明：原 `src/api/modules/*` 已移除；各页面直接通过 `rpc.call` + `RPC.*.*` 调用后端方法。

## 十五、常见问题（FAQ）

- 登录后页面未跳转：检查 `auth.init()` 是否执行、`permission.store.getMenu(role)` 是否加载菜单
- 路由 403/不可见：确认菜单配置的 `path` 是否包含目标路由；`isPathAllowed(path)` 控制可见
- 请求超时：默认 10s；可在调用处传 `{ timeoutMs: 5000 }` 或使用 AbortController 取消
- 图标显示异常：检查菜单 `icon` 是否在 `icon-map.ts` 定义

## 十六、调试与扩展建议

- 在 `rpc.ts` 统一错误归一化（可加入 `error.data` 展示字段级提示）
- 为常用模块增加 typed wrapper 与返回类型，提升类型提示
- 根据需要引入组件按需加载与路由懒加载优化首屏

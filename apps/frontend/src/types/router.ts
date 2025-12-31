import type { RouteRecordRaw } from 'vue-router';

export type AppRoute = Omit<RouteRecordRaw, 'path'> & {
  path?: string;
};

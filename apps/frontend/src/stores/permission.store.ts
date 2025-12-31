import { defineStore } from 'pinia';
import { UserRole } from '@/types/role';
import { ref } from 'vue';
import { getSidebarByRole } from '@/config/permissions';

/**
 * 侧边栏菜单项类型
 * 用于描述导航菜单中每个节点的结构与权限信息
 */
type MenuItem = {
  /** 唯一标识，用于定位与权限校验 */
  id: string;
  /** 功能编码，对应后端权限系统中的资源 code */
  code: string;
  /** 菜单显示名称 */
  name: string;
  /** 图标名称（可选），与图标库中的名称对应 */
  icon?: string;
  /** 路由路径（可选），点击菜单时跳转的地址 */
  path?: string;
  /** 子菜单列表（可选），支持多级嵌套 */
  children?: MenuItem[];
  /** 按钮级权限映射（可选），key 为操作编码，value 为是否可见/可用 */
  operations?: Record<string, boolean>;
};

export const usePermissionStore = defineStore(
  'permission',
  () => {
    const sidebar = ref<MenuItem[]>([]);
    const role = ref<UserRole>(UserRole.STUDENT);

    /**
     * 根据用户角色获取侧边栏菜单选项
     * @param r 用户角色，默认值为 'STUDENT'
     */
    function getMenu(r: UserRole) {
      role.value = r || UserRole.STUDENT;
      sidebar.value = getSidebarByRole(role.value) as any;
    }

    /**
     * 根据当前角色获取默认跳转路径
     * 用于未指定目标路径时的默认跳转
     */
    function roleDefaultPath(): string {
      const flatten = (items: MenuItem[]): string[] =>
        items.flatMap(it =>
          it.children?.length
            ? flatten(it.children)
            : it.path
              ? [it.path]
              : []
        );
      const paths = flatten(sidebar.value);
      return paths[0] || '/';
    }

    // 检查路径是否对当前角色可见
    function isPathAllowed(path: string): boolean {
      const stack: MenuItem[] = [...sidebar.value];
      while (stack.length) {
        const it = stack.pop()!;
        if (it.path === path) return true;
        if (it.children?.length) stack.push(...it.children);
      }
      return false;
    }

    // 检查模块操作是否对当前角色可见
    function can(
      moduleCode: string,
      operation?: string
    ): boolean {
      const stack: MenuItem[] = [...sidebar.value];
      while (stack.length) {
        const it = stack.pop()!;
        if (it.code === moduleCode) {
          if (!operation) return true;
          return !!it.operations?.[operation];
        }
        if (it.children?.length) stack.push(...it.children);
      }
      return false;
    }

    return {
      role,
      sidebar,
      getMenu,
      roleDefaultPath,
      isPathAllowed,
      can,
    };
  }
);

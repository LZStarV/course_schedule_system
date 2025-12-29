import { defineStore } from 'pinia';
import { ref } from 'vue';

type MenuItem = {
  id: string;
  code: string;
  name: string;
  icon?: string;
  path?: string;
  order: number;
  children?: MenuItem[];
  operations?: Record<string, boolean>;
};

export const usePermissionStore = defineStore('permission', () => {
  const modules = ref<
    Record<string, { accessible: boolean; operations?: Record<string, boolean> }>
  >({});
  const sidebar = ref<MenuItem[]>([]);
  const nav = ref<MenuItem[]>([]);

  function initialize(role: string) {
    if (role === 'STUDENT') {
      sidebar.value = [
        {
          id: 'enrollment',
          code: 'enrollment',
          name: '选课管理',
          icon: 'checklist',
          order: 1,
          children: [
            {
              id: 'enrollment_select',
              code: 'course_selection',
              name: '选课操作',
              icon: 'check',
              path: '/enrollment/select',
              order: 1,
            },
            {
              id: 'my_schedule',
              code: 'my_schedule',
              name: '我的课表',
              icon: 'calendar',
              path: '/enrollment/schedule',
              order: 2,
            },
          ],
        },
      ];
      modules.value['enrollment'] = { accessible: true };
      modules.value['course_selection'] = {
        accessible: true,
        operations: { view: true, create: true },
      };
    } else if (role === 'TEACHER') {
      sidebar.value = [
        {
          id: 'courses',
          code: 'course_center',
          name: '课程中心',
          icon: 'book',
          order: 1,
          children: [
            {
              id: 'manage_my',
              code: 'my_courses',
              name: '我的课程',
              icon: 'book',
              path: '/courses/manage/my',
              order: 1,
            },
            {
              id: 'grade_entry',
              code: 'grade_entry',
              name: '成绩录入',
              icon: 'edit_note',
              path: '/grades/entry',
              order: 2,
            },
          ],
        },
      ];
      modules.value['course_center'] = { accessible: true };
      modules.value['my_courses'] = { accessible: true, operations: { view: true, edit: true } };
    } else {
      sidebar.value = [
        {
          id: 'system',
          code: 'system',
          name: '系统管理',
          icon: 'settings',
          order: 1,
          children: [
            {
              id: 'users',
              code: 'user_management',
              name: '用户管理',
              icon: 'people',
              path: '/system/users',
              order: 1,
            },
          ],
        },
      ];
      modules.value['system'] = { accessible: true };
      modules.value['user_management'] = {
        accessible: true,
        operations: { view: true, create: true, edit: true, delete: true },
      };
    }
  }

  function hasPermission(moduleCode: string, operation?: string) {
    const m = modules.value[moduleCode];
    if (!m || !m.accessible) return false;
    if (!operation) return true;
    return !!m.operations?.[operation];
  }

  function roleDefaultPath(role?: string | null) {
    if (role === 'STUDENT') return '/enrollment/select';
    if (role === 'TEACHER') return '/courses/manage/my';
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') return '/system/users';
    return '/';
  }

  function setFromRpc(payload: {
    menus: { sidebar: MenuItem[]; navigation?: MenuItem[]; shortcuts?: MenuItem[] };
    permissions:
      | Record<string, { accessible: boolean; operations?: Record<string, boolean> }>
      | { modules: Record<string, { accessible: boolean; operations?: Record<string, boolean> }> };
  }) {
    const perms = (payload.permissions as any).modules || payload.permissions;
    modules.value = perms;
    sidebar.value = payload.menus.sidebar || [];
    nav.value = payload.menus.navigation || [];
  }

  return {
    modules,
    menus: { sidebar, navigation: nav },
    initialize,
    hasPermission,
    roleDefaultPath,
    setFromRpc,
  };
});

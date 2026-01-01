import { UserRole } from '@/types/role';

export function getSidebarByRole(role: UserRole) {
  if (role === UserRole.STUDENT) {
    return [
      {
        id: 'enrollment',
        code: 'enrollment',
        name: '选课管理',
        icon: 'checklist',
        children: [
          {
            id: 'enrollment_select',
            code: 'course_selection',
            name: '选课操作',
            icon: 'check',
            path: '/enrollment/select',
            operations: { view: true, create: true },
          },
          {
            id: 'my_schedule',
            code: 'my_schedule',
            name: '我的课表',
            icon: 'calendar',
            path: '/enrollment/schedule',
            operations: { view: true },
          },
        ],
      },
      {
        id: 'courses',
        code: 'course_center',
        name: '课程中心',
        icon: 'book',
        children: [
          {
            id: 'course_browse',
            code: 'course_browse',
            name: '浏览课程',
            icon: 'book',
            path: '/courses/browse',
            operations: { view: true },
          },
          {
            id: 'course_favorites',
            code: 'course_favorites',
            name: '我的收藏',
            icon: 'check',
            path: '/courses/favorites',
            operations: { view: true, delete: true },
          },
        ],
      },
      {
        id: 'my_grades',
        code: 'my_grades',
        name: '我的成绩',
        icon: 'edit_note',
        path: '/my-grades',
        operations: { view: true, export: true },
      },
      {
        id: 'personal_center',
        code: 'personal_center',
        name: '个人中心',
        icon: 'user',
        path: '/personal-center',
        operations: { view: true, edit: true },
      },
    ];
  }
  if (role === UserRole.TEACHER) {
    return [
      {
        id: 'courses',
        code: 'course_center',
        name: '课程中心',
        icon: 'book',
        children: [
          {
            id: 'manage_my',
            code: 'my_courses',
            name: '我的课程',
            icon: 'book',
            path: '/courses/manage/my',
            operations: { view: true, edit: true },
          },
          {
            id: 'grade_entry',
            code: 'grade_entry',
            name: '成绩录入',
            icon: 'edit_note',
            path: '/grades/entry',
            operations: { view: true },
          },
        ],
      },
    ];
  }
  return [
    {
      id: 'system',
      code: 'system',
      name: '系统管理',
      icon: 'settings',
      children: [
        {
          id: 'users',
          code: 'user_management',
          name: '用户管理',
          icon: 'people',
          path: '/system/users',
          operations: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
        },
        {
          id: 'select_time',
          code: 'selection_rules',
          name: '选课时间配置',
          icon: 'calendar',
          path: '/system/select-time',
          operations: { view: true, edit: true },
        },
      ],
    },
  ];
}

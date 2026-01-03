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
            id: 'course_materials',
            code: 'course_materials',
            name: '课程资料',
            icon: 'checklist',
            path: '/courses/materials',
            operations: {
              view: true,
              create: true,
              edit: true,
              delete: true,
            },
          },
          {
            id: 'course_announcements',
            code: 'course_announcements',
            name: '课程公告',
            icon: 'check',
            path: '/courses/announcements',
            operations: {
              view: true,
              create: true,
              edit: true,
              delete: true,
            },
          },
        ],
      },
      {
        id: 'teaching',
        code: 'teaching_management',
        name: '教学管理',
        icon: 'edit_note',
        children: [
          {
            id: 'grade_entry',
            code: 'grade_entry',
            name: '成绩录入',
            icon: 'edit_note',
            path: '/grades/entry',
            operations: { view: true },
          },
          {
            id: 'teaching_stats',
            code: 'teaching_stats',
            name: '教学统计',
            icon: 'calendar',
            path: '/teaching/stats',
            operations: { view: true },
          },
        ],
      },
      {
        id: 'teaching_schedule',
        code: 'teaching_schedule',
        name: '教学时间表',
        icon: 'calendar',
        path: '/teaching/schedule',
        operations: { view: true, edit: true },
      },
      {
        id: 'teacher_profile',
        code: 'teacher_profile',
        name: '个人信息',
        icon: 'user',
        path: '/teacher-profile',
        operations: { view: true, edit: true },
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
        {
          id: 'semester_management',
          code: 'semester_management',
          name: '学期管理',
          icon: 'book',
          path: '/system/semester',
          operations: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
        },
        {
          id: 'system_settings',
          code: 'system_settings',
          name: '系统设置',
          icon: 'settings',
          path: '/system/settings',
          operations: { view: true, edit: true },
        },
      ],
    },
    {
      id: 'course_management',
      code: 'course_management',
      name: '课程管理',
      icon: 'book',
      children: [
        {
          id: 'all_courses',
          code: 'all_courses',
          name: '所有课程',
          icon: 'book',
          path: '/courses/all',
          operations: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
        },
        {
          id: 'course_approval',
          code: 'course_approval',
          name: '课程审核',
          icon: 'check',
          path: '/courses/approval',
          operations: { view: true, edit: true },
        },
      ],
    },
    {
      id: 'statistics',
      code: 'statistics',
      name: '数据统计',
      icon: 'edit_note',
      children: [
        {
          id: 'system_stats',
          code: 'system_stats',
          name: '系统统计',
          icon: 'calendar',
          path: '/statistics/system',
          operations: { view: true, export: true },
        },
        {
          id: 'user_stats',
          code: 'user_stats',
          name: '用户统计',
          icon: 'people',
          path: '/statistics/users',
          operations: { view: true, export: true },
        },
      ],
    },
  ];
}

// 系统角色配置：用于 RBAC 权限体系的角色枚举与显示名称
export type RoleConfig = {
  // 角色编码（唯一），用于后端权限判断与前端菜单映射
  code: string;
  // 角色中文名称，用于展示
  name: string;
};

// 超级管理员基础信息：用于初始化系统的首个管理账号
export type AdminConfig = {
  // 登录用户名（唯一）
  username: string;
  // 邮箱（唯一）
  email: string;
  // 手机号码（可选）
  phone?: string;
  // 真实姓名
  real_name: string;
  // 教师工号（可选），用于示例数据标识
  teacher_id?: string;
};

// 院系配置：用于构建基础组织结构
export type DepartmentConfig = {
  // 院系代码（唯一）
  code: string;
  // 院系名称（中文简称）
  name: string;
  // 院系全称（可选）
  full_name?: string;
};

// 课程配置：用于示例课程的基础字段（不含复杂排课）
export type CourseConfig = {
  // 课程代码（唯一）
  course_code: string;
  // 课程编号（院系内部编号，可选）
  course_number?: string;
  // 课程中文名称
  name: string;
  // 课程英文名称（可选）
  english_name?: string;
  // 学分（如 3.0）
  credit: number;
  // 学时（如 48）
  credit_hours: number;
  // 课程容量（最大可选人数）
  capacity: number;
  // 最小开班人数
  min_quota: number;
  // 学年（如 2024-2025）
  academic_year: string;
  // 学期枚举
  semester: 'FALL' | 'SPRING' | 'SUMMER' | 'WINTER';
};

// 种子数据总配置：由各服务读取并进行幂等写入
export const seedConfig: {
  // 系统角色集合
  roles: RoleConfig[];
  // 超级管理员配置
  admin: AdminConfig;
  // 院系基础集合
  departments: DepartmentConfig[];
  // 示例课程集合
  courses: CourseConfig[];
} = {
  roles: [
    { code: 'STUDENT', name: '学生' },
    { code: 'TEACHER', name: '教师' },
    { code: 'ADMIN', name: '管理员' },
    { code: 'SUPER_ADMIN', name: '超级管理员' },
  ],
  admin: {
    username: 'superadmin',
    email: 'admin@course-select.edu',
    phone: '13800138000',
    real_name: '系统管理员',
    teacher_id: 'T000001',
  },
  departments: [
    {
      code: 'CS',
      name: '计算机科学与技术学院',
      full_name: '计算机科学与技术学院',
    },
    {
      code: 'MA',
      name: '数学科学学院',
      full_name: '数学科学学院',
    },
    {
      code: 'PH',
      name: '物理学院',
      full_name: '物理学院',
    },
    {
      code: 'CH',
      name: '化学学院',
      full_name: '化学学院',
    },
    {
      code: 'BU',
      name: '商学院',
      full_name: '商学院',
    },
  ],
  courses: [
    {
      course_code: 'CS101',
      course_number: '101',
      name: '计算机科学导论',
      english_name: 'Introduction to Computer Science',
      credit: 3.0,
      credit_hours: 48,
      capacity: 100,
      min_quota: 10,
      academic_year: '2024-2025',
      semester: 'FALL',
    },
    {
      course_code: 'CS201',
      course_number: '201',
      name: '数据结构与算法',
      english_name: 'Data Structures and Algorithms',
      credit: 4.0,
      credit_hours: 64,
      capacity: 80,
      min_quota: 15,
      academic_year: '2024-2025',
      semester: 'FALL',
    },
    {
      course_code: 'CS301',
      course_number: '301',
      name: '数据库系统原理',
      english_name: 'Database System Principles',
      credit: 3.0,
      credit_hours: 48,
      capacity: 60,
      min_quota: 10,
      academic_year: '2024-2025',
      semester: 'FALL',
    },
  ],
};

export const seedDefaults = {
  // 批量生成的邮箱域名
  emailDomain: 'course-select.edu',
  // 中文名字长度偏好：生成1字名的概率（0-1）
  nameLengthPreferOne: 0.6,
  // 课程时间块（用于生成排课）
  scheduleBlocks: [
    { start: '08:00', end: '09:50' },
    { start: '10:10', end: '12:00' },
    { start: '14:00', end: '15:50' },
    { start: '16:10', end: '18:00' },
  ],
  // 选课状态池（用于随机选课状态）
  enrollmentStatusPool: ['SELECTED', 'CONFIRMED'] as Array<
    'SELECTED' | 'CONFIRMED'
  >,
};

// 中文姓名字典：用于生成姓氏+名字
export const chineseNames = {
  surnames: [
    '王',
    '李',
    '张',
    '刘',
    '陈',
    '杨',
    '黄',
    '赵',
    '周',
    '吴',
    '徐',
    '孙',
    '马',
    '朱',
    '胡',
    '郭',
    '何',
    '高',
    '林',
    '罗',
    '郑',
    '梁',
    '谢',
    '宋',
    '唐',
    '许',
    '邓',
    '冯',
    '韩',
    '曹',
  ],
  givenChars: [
    '伟',
    '芳',
    '娜',
    '敏',
    '静',
    '丽',
    '强',
    '磊',
    '军',
    '洋',
    '勇',
    '艳',
    '杰',
    '娟',
    '涛',
    '明',
    '超',
    '秀',
    '霞',
    '平',
    '刚',
    '桂',
    '丹',
    '玲',
    '华',
    '燕',
    '飞',
    '梅',
    '鑫',
    '欣',
    '洁',
    '慧',
    '宁',
    '琪',
    '颖',
  ],
};

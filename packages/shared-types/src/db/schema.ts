import { z } from 'zod';

// 用户角色枚举
export const UserRoleSchema = z.enum(['STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN']);
export type UserRole = z.infer<typeof UserRoleSchema>;

// 用户状态枚举
export const UserStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'GRADUATED']);
export type UserStatus = z.infer<typeof UserStatusSchema>;

// 性别枚举
export const GenderSchema = z.enum(['MALE', 'FEMALE', 'OTHER', 'SECRET']);
export type Gender = z.infer<typeof GenderSchema>;

// 院系状态枚举
export const DepartmentStatusSchema = z.enum(['ACTIVE', 'INACTIVE']);
export type DepartmentStatus = z.infer<typeof DepartmentStatusSchema>;

// 院系结构（departments）
export const DepartmentSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  full_name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  parent_id: z.string().uuid().optional().nullable(),
  level: z.number().int().min(1),
  path: z.string().optional().nullable(),
  contact_person: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  contact_email: z.string().email().optional().nullable(),
  location: z.string().optional().nullable(),
  status: DepartmentStatusSchema,
  display_order: z.number().int(),
  created_by: z.string().uuid().optional().nullable(),
  updated_by: z.string().uuid().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Department = z.infer<typeof DepartmentSchema>;

// 用户结构（users）
export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  real_name: z.string(),
  avatar_url: z.string().url().optional().nullable(),
  gender: GenderSchema,
  birth_date: z.string().optional().nullable(),
  student_id: z.string().optional().nullable(),
  teacher_id: z.string().optional().nullable(),
  department_id: z.string().uuid().optional().nullable(),
  major: z.string().optional().nullable(),
  grade: z.number().int().optional().nullable(),
  class_name: z.string().optional().nullable(),
  password_hash: z.string(),
  role: UserRoleSchema,
  status: UserStatusSchema,
  last_login_at: z.string().optional().nullable(),
  failed_login_attempts: z.number().int(),
  locked_until: z.string().optional().nullable(),
  created_by: z.string().uuid().optional().nullable(),
  updated_by: z.string().uuid().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type User = z.infer<typeof UserSchema>;

// 课程类型枚举
export const CourseTypeSchema = z.enum([
  'COMPULSORY',
  'ELECTIVE',
  'GENERAL',
  'EXPERIMENTAL',
  'PRACTICE',
]);
export type CourseType = z.infer<typeof CourseTypeSchema>;

// 课程状态枚举
export const CourseStatusSchema = z.enum([
  'DRAFT',
  'PENDING_REVIEW',
  'REJECTED',
  'PUBLISHED',
  'SELECTING',
  'SELECTION_ENDED',
  'IN_PROGRESS',
  'ENDED',
  'ARCHIVED',
]);
export type CourseStatus = z.infer<typeof CourseStatusSchema>;

// 学期枚举
export const SemesterSchema = z.enum(['FALL', 'SPRING', 'SUMMER', 'WINTER']);
export type Semester = z.infer<typeof SemesterSchema>;

// 上课地点类型枚举
export const LocationTypeSchema = z.enum(['CLASSROOM', 'LAB', 'ONLINE', 'MIXED']);
export type LocationType = z.infer<typeof LocationTypeSchema>;

// 课程时间安排项
export const CourseScheduleItemSchema = z.object({
  weekday: z.number().int().min(1).max(7),
  start_time: z.string(),
  end_time: z.string(),
  location: z.string().optional().nullable(),
});

// 课程结构（courses）
export const CourseSchema = z.object({
  id: z.string().uuid(),
  course_code: z.string(),
  course_number: z.string().optional().nullable(),
  name: z.string(),
  english_name: z.string().optional().nullable(),
  credit: z.number(),
  credit_hours: z.number().int(),
  course_type: CourseTypeSchema,
  department_id: z.string().uuid(),
  teacher_id: z.string().uuid(),
  academic_year: z.string(),
  semester: SemesterSchema,
  capacity: z.number().int().min(1),
  min_quota: z.number().int().min(1),
  enrolled_count: z.number().int().min(0),
  status: CourseStatusSchema,
  schedule: z.object({
    weekly: z.array(CourseScheduleItemSchema),
    specific_dates: z.array(z.string()),
  }),
  location_type: LocationTypeSchema,
  location_details: z.record(z.any()).optional().nullable(),
  description: z.string().optional().nullable(),
  objectives: z.string().optional().nullable(),
  syllabus: z.string().optional().nullable(),
  assessment_method: z.string().optional().nullable(),
  textbook_reference: z.string().optional().nullable(),
  attachments: z.array(z.record(z.any())).optional().nullable(),
  restrictions: z.record(z.any()).optional().nullable(),
  view_count: z.number().int().min(0),
  favorite_count: z.number().int().min(0),
  review_notes: z.string().optional().nullable(),
  reviewed_at: z.string().optional().nullable(),
  reviewed_by: z.string().uuid().optional().nullable(),
  published_at: z.string().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Course = z.infer<typeof CourseSchema>;

// 选课状态枚举
export const EnrollmentStatusSchema = z.enum([
  'SELECTED',
  'CONFIRMED',
  'WITHDRAWN',
  'FAILED',
  'COMPLETED',
]);
export type EnrollmentStatus = z.infer<typeof EnrollmentStatusSchema>;

// 选课方式枚举
export const SelectionMethodSchema = z.enum(['MANUAL', 'AUTO', 'ADMIN']);
export type SelectionMethod = z.infer<typeof SelectionMethodSchema>;

// 选课结构（enrollments）
export const EnrollmentSchema = z.object({
  id: z.string().uuid(),
  student_id: z.string().uuid(),
  course_id: z.string().uuid(),
  section_id: z.string().uuid().optional().nullable(),
  academic_year: z.string(),
  semester: z.string(),
  status: EnrollmentStatusSchema,
  selection_round: z.number().int().min(1),
  selection_method: SelectionMethodSchema,
  enrolled_at: z.string(),
  confirmed_at: z.string().optional().nullable(),
  withdrawn_at: z.string().optional().nullable(),
  completed_at: z.string().optional().nullable(),
  grade: z.string().optional().nullable(),
  score: z.number().optional().nullable(),
  gpa_points: z.number().optional().nullable(),
  is_passed: z.boolean().optional().nullable(),
  teacher_comment: z.string().optional().nullable(),
  student_feedback: z.string().optional().nullable(),
  ip_address: z.string().optional().nullable(),
  user_agent: z.string().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Enrollment = z.infer<typeof EnrollmentSchema>;

// 通用分页结构（前后端统一）
export const PaginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    data: z.array(item),
    pagination: z.object({
      page: z.number().int(),
      page_size: z.number().int(),
      total: z.number().int(),
      total_pages: z.number().int(),
    }),
    meta: z.record(z.any()).optional(),
  });

export interface RpcRequest {
  id: string;
  method: string;
  params: Record<string, unknown>;
  meta?: { version?: string };
}

export interface RpcResponse<T> {
  id: string;
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

export interface PaginatedRequest {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: { page: number; page_size: number; total: number; total_pages: number };
  meta?: { filters_applied?: Record<string, unknown>; permissions?: Record<string, boolean> };
}

import { call } from '@api/rpc';

export interface TeachingStats {
  total_courses: number;
  total_students: number;
  total_materials: number;
  total_announcements: number;
  course_stats: Array<{
    course_id: string;
    course_name: string;
    student_count: number;
    material_count: number;
    announcement_count: number;
    avg_grade?: number;
  }>;
  recent_activities: Array<{
    id: string;
    type: 'material' | 'announcement' | 'grade';
    title: string;
    created_at: string;
  }>;
}

export interface CourseStats {
  course_id: string;
  course_name: string;
  total_students: number;
  grade_distribution: Array<{
    grade_range: string;
    count: number;
  }>;
  monthly_stats: Array<{
    month: string;
    materials: number;
    announcements: number;
  }>;
}

export async function getTeachingStats(params: {
  teacher_id: string;
  academic_year?: string;
  semester?: string;
}) {
  return await call<TeachingStats>(
    'TeachingStats.GetTeachingStats',
    params
  );
}

export async function getCourseStats(params: {
  course_id: string;
  academic_year?: string;
  semester?: string;
}) {
  return await call<CourseStats>(
    'TeachingStats.GetCourseStats',
    params
  );
}

export async function getStudentList(params: {
  course_id: string;
  page?: number;
  page_size?: number;
}) {
  return await call<{
    data: Array<{
      id: string;
      student_id: string;
      student_name: string;
      grade?: number;
      status: string;
    }>;
    pagination: {
      total: number;
      page: number;
      page_size: number;
    };
  }>('TeachingStats.GetStudentList', params);
}

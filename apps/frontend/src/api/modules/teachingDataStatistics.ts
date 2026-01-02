import { call } from '@api/rpc';

export interface TeachingDataStatistics {
  total_teachers: number;
  total_courses: number;
  total_enrollments: number;
  average_class_size: number;
  teacher_workload: {
    teacher_id: string;
    teacher_name: string;
    course_count: number;
    total_students: number;
    avg_students_per_course: number;
  }[];
  department_statistics: {
    department: string;
    course_count: number;
    teacher_count: number;
    student_enrollments: number;
  }[];
  grade_distribution: {
    course_id: string;
    course_name: string;
    avg_grade: number;
    grade_stats: {
      a_count: number;
      b_count: number;
      c_count: number;
      d_count: number;
      f_count: number;
    };
  }[];
  course_popularity: {
    course_id: string;
    course_name: string;
    teacher_name: string;
    enrollment_count: number;
    capacity: number;
    utilization_rate: number;
  }[];
  semester_comparison: {
    semester: string;
    total_courses: number;
    total_enrollments: number;
    avg_enrollment_per_course: number;
  }[];
}

export async function getTeachingDataStatistics(params?: {
  academic_year?: string;
  semester?: string;
  department?: string;
  [key: string]: unknown;
}) {
  return await call<TeachingDataStatistics>(
    'TeachingDataStatistics.GetOverview',
    params
  );
}

export async function exportTeachingDataStatistics(params?: {
  academic_year?: string;
  semester?: string;
  department?: string;
  format?: 'csv' | 'excel' | 'pdf';
  [key: string]: unknown;
}) {
  return await call<{
    download_url: string;
    filename: string;
  }>('TeachingDataStatistics.Export', params);
}

import { call } from '@api/rpc';

export interface SystemStatistics {
  total_users: number;
  total_students: number;
  total_teachers: number;
  total_courses: number;
  total_enrollments: number;
  active_semester: string;
  system_uptime: number;
  storage_usage: {
    used: number;
    total: number;
    percentage: number;
  };
  daily_active_users: {
    date: string;
    count: number;
  }[];
  monthly_course_creation: {
    month: string;
    count: number;
  }[];
  enrollment_statistics: {
    total_enrolled: number;
    avg_courses_per_student: number;
    popular_courses: {
      course_name: string;
      enrollment_count: number;
    }[];
  };
}

export async function getSystemStatistics(params?: {
  start_date?: string;
  end_date?: string;
  [key: string]: unknown;
}) {
  return await call<SystemStatistics>(
    'SystemStatistics.GetOverview',
    params
  );
}

export async function exportSystemStatistics(params?: {
  start_date?: string;
  end_date?: string;
  format?: 'csv' | 'excel' | 'pdf';
  [key: string]: unknown;
}) {
  return await call<{
    download_url: string;
    filename: string;
  }>('SystemStatistics.Export', params);
}

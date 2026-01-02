import { call } from '@api/rpc';

export interface UserStatistics {
  total_users: number;
  active_users: number;
  role_distribution: {
    students: number;
    teachers: number;
    admins: number;
  };
  user_growth: {
    month: string;
    new_users: number;
  }[];
  department_distribution: {
    department: string;
    student_count: number;
    teacher_count: number;
  }[];
  activity_statistics: {
    daily_active: {
      date: string;
      active_users: number;
    }[];
    feature_usage: {
      feature_name: string;
      usage_count: number;
      unique_users: number;
    }[];
  };
  login_statistics: {
    total_logins: number;
    unique_users: number;
    avg_sessions_per_user: number;
  };
}

export async function getUserStatistics(params?: {
  start_date?: string;
  end_date?: string;
  department?: string;
  role?: string;
  [key: string]: unknown;
}) {
  return await call<UserStatistics>(
    'UserStatistics.GetOverview',
    params
  );
}

export async function exportUserStatistics(params?: {
  start_date?: string;
  end_date?: string;
  department?: string;
  role?: string;
  format?: 'csv' | 'excel' | 'pdf';
  [key: string]: unknown;
}) {
  return await call<{
    download_url: string;
    filename: string;
  }>('UserStatistics.Export', params);
}

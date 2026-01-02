import { call } from '@api/rpc';

export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  updated_at: string;
}

export async function getSystemSettings() {
  return await call<SystemSettings[]>(
    'SystemSettings.GetAll'
  );
}

export async function updateSystemSetting(params: {
  key: string;
  value: string;
  [key: string]: unknown;
}) {
  return await call<SystemSettings>(
    'SystemSettings.Update',
    params
  );
}

export async function getSystemConfig() {
  return await call<{
    basic_config: {
      system_name: string;
      school_name: string;
      academic_year_start: string;
      semester_weeks: number;
    };
    feature_config: {
      enrollment_enabled: boolean;
      grade_entry_enabled: boolean;
      announcement_enabled: boolean;
    };
    system_limits: {
      max_courses_per_student: number;
      max_courses_per_teacher: number;
      file_upload_max_size: number;
    };
  }>('SystemSettings.GetConfig');
}

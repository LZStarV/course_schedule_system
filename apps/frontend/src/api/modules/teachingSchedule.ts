import { call } from '@api/rpc';

export interface TeachingScheduleItem {
  id: string;
  teacher_id: string;
  course_id: string;
  course_name: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  location: string;
  academic_year: string;
  semester: string;
  created_at: string;
  updated_at: string;
}

export interface TeachingScheduleCreate {
  course_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  location: string;
  academic_year: string;
  semester: string;
  [key: string]: unknown;
}

export interface TeachingScheduleUpdate {
  course_id?: string;
  day_of_week?: number;
  start_time?: string;
  end_time?: string;
  location?: string;
  academic_year?: string;
  semester?: string;
  [key: string]: unknown;
}

export async function getSchedule(params: {
  teacher_id: string;
  academic_year?: string;
  semester?: string;
}) {
  return await call<{
    data: TeachingScheduleItem[];
    weekly_schedule: {
      [key: number]: TeachingScheduleItem[];
    };
  }>('TeachingSchedule.GetSchedule', params);
}

export async function getScheduleByDay(params: {
  teacher_id: string;
  day_of_week: number;
  academic_year?: string;
  semester?: string;
}) {
  return await call<TeachingScheduleItem[]>(
    'TeachingSchedule.GetScheduleByDay',
    params
  );
}

export async function createScheduleItem(
  params: TeachingScheduleCreate
) {
  return await call<TeachingScheduleItem>(
    'TeachingSchedule.CreateScheduleItem',
    params
  );
}

export async function updateScheduleItem(
  id: string,
  params: TeachingScheduleUpdate
) {
  return await call<TeachingScheduleItem>(
    'TeachingSchedule.UpdateScheduleItem',
    { id, ...params }
  );
}

export async function deleteScheduleItem(id: string) {
  return await call<{ success: boolean }>(
    'TeachingSchedule.DeleteScheduleItem',
    { id }
  );
}

export async function getCourseSchedule(params: {
  course_id: string;
  academic_year?: string;
  semester?: string;
}) {
  return await call<TeachingScheduleItem[]>(
    'TeachingSchedule.GetCourseSchedule',
    params
  );
}

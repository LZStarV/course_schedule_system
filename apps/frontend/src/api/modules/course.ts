import { call } from '@api/rpc';
import type { Course, PaginatedResponse } from '@packages/shared-types';

export async function listForStudent(params: {
  keyword?: string;
  credit?: number;
  avoidConflict?: boolean;
  page?: number;
  page_size?: number;
}) {
  return await call<PaginatedResponse<Course>>('Course.ListForStudent', params);
}

export async function listByTeacher(params: {
  teacher_id: string;
  keyword?: string;
  credit?: number;
  status?: string[];
  academic_year?: string;
  semester?: string;
  page?: number;
  page_size?: number;
}) {
  return await call<PaginatedResponse<Course>>('Course.ListByTeacher', params);
}

import { call } from '@api/rpc';

export interface Semester {
  id: string;
  name: string;
  academic_year: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  enrollment_start: string;
  enrollment_end: string;
  grade_entry_start: string;
  grade_entry_end: string;
  status: 'active' | 'upcoming' | 'ended';
  created_at: string;
  updated_at: string;
}

export async function getSemesters() {
  return await call<Semester[]>(
    'SemesterManagement.GetAll'
  );
}

export async function getCurrentSemester() {
  return await call<Semester | null>(
    'SemesterManagement.GetCurrent'
  );
}

export async function createSemester(params: {
  name: string;
  academic_year: string;
  start_date: string;
  end_date: string;
  enrollment_start: string;
  enrollment_end: string;
  grade_entry_start: string;
  grade_entry_end: string;
  [key: string]: unknown;
}) {
  return await call<Semester>(
    'SemesterManagement.Create',
    params
  );
}

export async function updateSemester(
  id: string,
  params: {
    name?: string;
    start_date?: string;
    end_date?: string;
    enrollment_start?: string;
    enrollment_end?: string;
    grade_entry_start?: string;
    grade_entry_end?: string;
    status?: 'active' | 'upcoming' | 'ended';
    [key: string]: unknown;
  }
) {
  return await call<Semester>('SemesterManagement.Update', {
    id,
    ...params,
  });
}

export async function setCurrentSemester(id: string) {
  return await call<Semester>(
    'SemesterManagement.SetCurrent',
    { id }
  );
}

export async function deleteSemester(id: string) {
  return await call<{ success: boolean }>(
    'SemesterManagement.Delete',
    { id }
  );
}

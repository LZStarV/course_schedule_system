import { call } from '@api/rpc';

export interface Course {
  id: string;
  name: string;
  code: string;
  teacher_id: string;
  teacher_name: string;
  department: string;
  credits: number;
  hours_per_week: number;
  capacity: number;
  enrolled_count: number;
  description: string;
  prerequisites: string[];
  location: string;
  schedule: string;
  semester: string;
  academic_year: string;
  status: 'active' | 'pending' | 'rejected' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface CourseApproval {
  id: string;
  course_id: string;
  course_name: string;
  teacher_name: string;
  submit_date: string;
  status: 'pending' | 'approved' | 'rejected';
  review_comment: string;
  reviewed_by: string;
  reviewed_at: string;
}

export async function getAllCourses(params: {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  teacher_id?: string;
  department?: string;
  [key: string]: unknown;
}) {
  return await call<{
    data: Course[];
    total: number;
    page: number;
    page_size: number;
  }>('CourseManagement.GetAll', params);
}

export async function getCourseDetails(id: string) {
  return await call<Course>('CourseManagement.GetDetails', {
    id,
  });
}

export async function createCourse(params: {
  name: string;
  code: string;
  teacher_id: string;
  department: string;
  credits: number;
  hours_per_week: number;
  capacity: number;
  description: string;
  prerequisites: string[];
  location: string;
  schedule: string;
  semester: string;
  academic_year: string;
  [key: string]: unknown;
}) {
  return await call<Course>(
    'CourseManagement.Create',
    params
  );
}

export async function updateCourse(
  id: string,
  params: {
    name?: string;
    code?: string;
    department?: string;
    credits?: number;
    hours_per_week?: number;
    capacity?: number;
    description?: string;
    prerequisites?: string[];
    location?: string;
    schedule?: string;
    status?: 'active' | 'pending' | 'rejected' | 'archived';
    [key: string]: unknown;
  }
) {
  return await call<Course>('CourseManagement.Update', {
    id,
    ...params,
  });
}

export async function deleteCourse(id: string) {
  return await call<{ success: boolean }>(
    'CourseManagement.Delete',
    { id }
  );
}

export async function getPendingApprovals() {
  return await call<CourseApproval[]>(
    'CourseManagement.GetPendingApprovals'
  );
}

export async function approveCourse(
  course_id: string,
  review_comment?: string
) {
  return await call<CourseApproval>(
    'CourseManagement.ApproveCourse',
    {
      course_id,
      review_comment,
    }
  );
}

export async function rejectCourse(
  course_id: string,
  review_comment: string
) {
  return await call<CourseApproval>(
    'CourseManagement.RejectCourse',
    {
      course_id,
      review_comment,
    }
  );
}

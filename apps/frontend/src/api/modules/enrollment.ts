import { call } from '@api/rpc';

export async function add(params: {
  courseId: string;
  sectionId?: string;
}) {
  return await call<{
    enrollmentId: string;
    status: string;
  }>('Enrollment.Add', params);
}

export async function listMy(params: {
  page?: number;
  page_size?: number;
}) {
  return await call<any>('Enrollment.ListMy', params);
}

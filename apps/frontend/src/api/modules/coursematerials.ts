import { call } from '@api/rpc';

export interface CourseMaterial {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
}

export interface CourseMaterialCreate {
  course_id: string;
  title: string;
  description?: string;
  file: File;
}

export interface CourseMaterialUpdate {
  title?: string;
  description?: string;
  file?: File;
}

export async function list(params: {
  course_id: string;
  keyword?: string;
  page?: number;
  page_size?: number;
}) {
  return await call<{
    data: CourseMaterial[];
    pagination: {
      total: number;
      page: number;
      page_size: number;
    };
  }>('CourseMaterials.List', params);
}

export async function create(params: CourseMaterialCreate) {
  return await call<CourseMaterial>(
    'CourseMaterials.Create',
    params
  );
}

export async function update(
  id: string,
  params: CourseMaterialUpdate
) {
  return await call<CourseMaterial>(
    'CourseMaterials.Update',
    { id, ...params }
  );
}

export async function remove(id: string) {
  return await call<{ success: boolean }>(
    'CourseMaterials.Delete',
    { id }
  );
}

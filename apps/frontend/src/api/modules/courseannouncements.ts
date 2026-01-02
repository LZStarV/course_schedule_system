import { call } from '@api/rpc';

export interface CourseAnnouncement {
  id: string;
  course_id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseAnnouncementCreate {
  course_id: string;
  title: string;
  content: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  is_published?: boolean;
}

export interface CourseAnnouncementUpdate {
  title?: string;
  content?: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  is_published?: boolean;
}

export async function list(params: {
  course_id: string;
  keyword?: string;
  is_published?: boolean;
  page?: number;
  page_size?: number;
}) {
  return await call<{
    data: CourseAnnouncement[];
    pagination: {
      total: number;
      page: number;
      page_size: number;
    };
  }>('CourseAnnouncements.List', params);
}

export async function create(
  params: CourseAnnouncementCreate
) {
  return await call<CourseAnnouncement>(
    'CourseAnnouncements.Create',
    params
  );
}

export async function update(
  id: string,
  params: CourseAnnouncementUpdate
) {
  return await call<CourseAnnouncement>(
    'CourseAnnouncements.Update',
    { id, ...params }
  );
}

export async function remove(id: string) {
  return await call<{ success: boolean }>(
    'CourseAnnouncements.Delete',
    { id }
  );
}

export async function publish(id: string) {
  return await call<CourseAnnouncement>(
    'CourseAnnouncements.Publish',
    { id }
  );
}

export async function unpublish(id: string) {
  return await call<CourseAnnouncement>(
    'CourseAnnouncements.Unpublish',
    { id }
  );
}

import { call } from '@api/rpc';

export interface TeacherProfile {
  id: string;
  username: string;
  email: string;
  phone?: string;
  department: string;
  title: string;
  office_location?: string;
  office_hours?: string;
  research_interests?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TeacherProfileUpdate {
  email?: string;
  phone?: string;
  department?: string;
  title?: string;
  office_location?: string;
  office_hours?: string;
  research_interests?: string;
  bio?: string;
  avatar_url?: string;
}

export async function getProfile(teacher_id: string) {
  return await call<TeacherProfile>(
    'TeacherProfile.GetProfile',
    { teacher_id }
  );
}

export async function updateProfile(
  teacher_id: string,
  params: TeacherProfileUpdate
) {
  return await call<TeacherProfile>(
    'TeacherProfile.UpdateProfile',
    {
      teacher_id,
      ...params,
    }
  );
}

export async function uploadAvatar(
  teacher_id: string,
  file: File
) {
  return await call<{ avatar_url: string }>(
    'TeacherProfile.UploadAvatar',
    {
      teacher_id,
      file,
    }
  );
}

export async function changePassword(
  teacher_id: string,
  old_password: string,
  new_password: string
) {
  return await call<{ success: boolean }>(
    'TeacherProfile.ChangePassword',
    {
      teacher_id,
      old_password,
      new_password,
    }
  );
}

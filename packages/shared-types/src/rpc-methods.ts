/** AUTO-GENERATED: Do not edit manually. */
export const RPC = {
  Auth: {
    Login: 'Auth.Login',
    GetPermissions: 'Auth.GetPermissions',
    RefreshPermissions: 'Auth.RefreshPermissions',
  },
  Course: {
    ListForStudent: 'Course.ListForStudent',
    ListByTeacher: 'Course.ListByTeacher',
    Approve: 'Course.Approve',
    GetDetail: 'Course.GetDetail',
  },
  Enrollment: {
    Add: 'Enrollment.Add',
    ListMy: 'Enrollment.ListMy',
    ListByCourse: 'Enrollment.ListByCourse',
    UpdateScore: 'Enrollment.UpdateScore',
    ListMyGrades: 'Enrollment.ListMyGrades',
  },
  Admin: {
    SetSelectTime: 'Admin.SetSelectTime',
    ListUsers: 'Admin.ListUsers',
    CreateUser: 'Admin.CreateUser',
    UpdateUser: 'Admin.UpdateUser',
    DeleteUser: 'Admin.DeleteUser',
  },
  Material: {
    GetCourseMaterials: 'Material.GetCourseMaterials',
    Upload: 'Material.Upload',
    Update: 'Material.Update',
    Delete: 'Material.Delete',
  },
  SystemSettings: {
    GetAll: 'SystemSettings.GetAll',
    Update: 'SystemSettings.Update',
  },
  GradeAudit: {
    Create: 'GradeAudit.Create',
    ListByCourse: 'GradeAudit.ListByCourse',
    Review: 'GradeAudit.Review',
  },
  Favorites: {
    Add: 'Favorites.Add',
    Remove: 'Favorites.Remove',
    List: 'Favorites.List',
  },
  Announcements: {
    Create: 'Announcements.Create',
    Update: 'Announcements.Update',
    Delete: 'Announcements.Delete',
    Publish: 'Announcements.Publish',
    GetList: 'Announcements.GetList',
    GetStatistics: 'Announcements.GetStatistics',
  },
  TeachingSchedule: {
    GetSchedule: 'TeachingSchedule.GetSchedule',
    CheckConflict: 'TeachingSchedule.CheckConflict',
    ApplyChange: 'TeachingSchedule.ApplyChange',
  },
  Semester: {
    Create: 'Semester.Create',
    Activate: 'Semester.Activate',
    Update: 'Semester.Update',
    End: 'Semester.End',
    Archive: 'Semester.Archive',
    GetList: 'Semester.GetList',
    GetDetail: 'Semester.GetDetail',
  },
  StatsSystem: {
    Get: 'StatsSystem.Get',
    Details: 'StatsSystem.Details',
  },
  StatsTeaching: {
    Get: 'StatsTeaching.Get',
    Details: 'StatsTeaching.Details',
  },
  StatsUsers: {
    Get: 'StatsUsers.Get',
  },
};

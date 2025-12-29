import type { DataTableColumns } from 'naive-ui';

export const columns: DataTableColumns<any> = [
  { title: '课程名称', key: 'name' },
  { title: '教师', key: 'teacher.name' },
  { title: '学分', key: 'credit' },
  { title: '容量', key: 'capacity' },
];

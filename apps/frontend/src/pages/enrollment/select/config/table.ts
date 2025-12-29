import type { DataTableColumns } from 'naive-ui';
import { h } from 'vue';
import { NButton } from 'naive-ui';

export const columns: DataTableColumns<any> = [
  { title: '课程名称', key: 'name' },
  { title: '教师', key: 'teacher.name' },
  { title: '学分', key: 'credit' },
  { title: '容量', key: 'capacity' },
  {
    title: '操作',
    key: 'action',
    render: (row: any) =>
      h(
        NButton,
        { size: 'small', type: 'primary', onClick: row.__action },
        { default: () => '选课' }
      ),
  },
];

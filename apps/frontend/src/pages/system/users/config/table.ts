import type { DataTableColumns } from 'naive-ui';
import { h } from 'vue';
import UserActions from '../components/UserActions/index.vue';

export const columns: DataTableColumns<any> = [
  { title: '用户名', key: 'username' },
  { title: '邮箱', key: 'email' },
  { title: '角色', key: 'role' },
  { title: '状态', key: 'status' },
  { title: '创建时间', key: 'created_at' },
  {
    title: '操作',
    key: 'action',
    render: (row: any) => h(UserActions, { row }),
  },
];

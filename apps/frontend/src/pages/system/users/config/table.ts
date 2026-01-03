import type { DataTableColumns } from 'naive-ui';
import { h } from 'vue';
import UserActions from '../components/UserActions/index.vue';

export const columns: DataTableColumns<any> = [
  { title: '用户名', key: 'username' },
  { title: '真实姓名', key: 'real_name' },
  { title: '邮箱', key: 'email' },
  { title: '角色', key: 'role' },
  { title: '状态', key: 'status' },
  { title: '创建时间', key: 'created_at' },
  {
    title: '操作',
    key: 'action',
    render: (row: any, _index: number) => {
      return h(UserActions, {
        row,
        onEdit: (row: any) => {
          // 使用全局事件总线触发编辑事件
          window.dispatchEvent(
            new CustomEvent('user-edit', { detail: row })
          );
        },
      });
    },
  },
];

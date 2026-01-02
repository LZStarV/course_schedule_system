<template>
  <div style="display: flex; gap: 8px">
    <n-button size="small" @click="edit">编辑</n-button>
    <n-button size="small" type="error" @click="softDelete"
      >删除</n-button
    >
  </div>
</template>

<script setup lang="ts">
import { NButton, useDialog, useMessage } from 'naive-ui';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';

const props = defineProps<{ row: any }>();
const emit = defineEmits<{
  (e: 'edit', payload: any): void;
}>();
const dialog = useDialog();
const message = useMessage();

function edit() {
  emit('edit', props.row);
}

async function softDelete() {
  dialog.warning({
    title: '确认删除',
    content: '将该用户设为停用（删除）？',
    positiveText: '确定',
    negativeText: '取消',
    async onPositiveClick() {
      try {
        await call(RPC.Admin.DeleteUser, {
          id: props.row.id,
        });
        message.success('用户删除成功');
        // 触发父组件更新
        window.dispatchEvent(
          new CustomEvent('user-deleted')
        );
      } catch (error: any) {
        message.error(
          `删除失败：${error.message || '未知错误'}`
        );
      }
    },
  });
}
</script>

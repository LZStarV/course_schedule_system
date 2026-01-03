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
const props = defineProps<{ row: any }>();
const emit = defineEmits<{
  (e: 'edit', payload: any): void;
}>();
const dialog = useDialog();
const message = useMessage();
function edit() {
  emit('edit', props.row);
}
function softDelete() {
  dialog.warning({
    title: '确认删除',
    content: '将该用户设为停用（删除）？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick() {
      import('@api/rpc').then(({ call }: any) => {
        import('@packages/shared-types').then(
          ({ RPC }: any) => {
            call(RPC.Admin.DeleteUser, { id: props.row.id })
              .then(() => {
                message.success('已设置为停用');
              })
              .catch((err: any) => {
                message.error(err?.message || '操作失败');
              });
          }
        );
      });
    },
  });
}
</script>

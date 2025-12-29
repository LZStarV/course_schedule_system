<template>
  <div style="display: flex; gap: 8px">
    <permission-wrapper module="user_management" operation="edit">
      <n-button size="small" @click="edit">编辑</n-button>
    </permission-wrapper>
    <permission-wrapper module="user_management" operation="delete">
      <n-button size="small" type="error" @click="softDelete">软删除</n-button>
    </permission-wrapper>
  </div>
</template>

<script setup lang="ts">
import { NButton, useDialog, useMessage } from 'naive-ui';
import PermissionWrapper from '@components/common/PermissionWrapper.vue';
const props = defineProps<{ row: any }>();
const emit = defineEmits<{ (e: 'edit', payload: any): void }>();
const dialog = useDialog();
const message = useMessage();
function edit() {
  emit('edit', props.row);
}
function softDelete() {
  dialog.warning({
    title: '确认删除',
    content: '将该用户设为停用（软删除）？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick() {
      message.success('已设置为停用，后端接口待补齐');
    },
  });
}
</script>

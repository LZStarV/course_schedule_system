<template>
  <div style="max-width: 520px">
    <n-card title="设置选课时间">
      <n-form :model="form">
        <n-form-item label="开始时间">
          <n-date-picker
            v-model:value="form.start"
            type="datetime"
          />
        </n-form-item>
        <n-form-item label="结束时间">
          <n-date-picker
            v-model:value="form.end"
            type="datetime"
          />
        </n-form-item>
        <n-button
          type="primary"
          :loading="loading"
          @click="submit"
          >保存</n-button
        >
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  NCard,
  NForm,
  NFormItem,
  NDatePicker,
  NButton,
  useMessage,
} from 'naive-ui';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';

const message = useMessage();
const loading = ref(false);
const form = ref<{
  start: number | null;
  end: number | null;
}>({ start: null, end: null });

async function submit() {
  loading.value = true;
  try {
    const payload = {
      startTime: form.value.start
        ? new Date(form.value.start).toISOString()
        : '',
      endTime: form.value.end
        ? new Date(form.value.end).toISOString()
        : '',
    };
    await call(RPC.Admin.SetSelectTime, payload);
    message.success('设置成功');
  } finally {
    loading.value = false;
  }
}
</script>

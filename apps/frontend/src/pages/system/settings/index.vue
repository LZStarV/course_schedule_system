<template>
  <n-el type="div">
    <n-el
      type="div"
      style="display: flex; gap: 12px; margin-bottom: 12px"
    >
      <n-input
        v-model:value="category"
        placeholder="分类（例如 system 或 selection）"
        style="max-width: 300px"
      />
      <n-button type="primary" @click="loadSettings(true)"
        >加载设置</n-button
      >
    </n-el>
    <n-data-table
      :columns="columns"
      :data="rows"
      :remote="true"
    />
  </n-el>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import {
  NEl,
  NInput,
  NButton,
  NDataTable,
  useMessage,
  NInputNumber,
  NSelect,
} from 'naive-ui';

const message = useMessage();
const category = ref('');
const rows = ref<any[]>([]);

async function loadSettings(showMsg = false) {
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const res = await call<{ data: any[] }>(
      RPC.SystemSettings.GetAll,
      { category: category.value || undefined }
    );
    rows.value = (res.data || []).map((x: any) => ({
      ...x,
      _value:
        x.value_type === 'JSON'
          ? JSON.stringify(x.config_value ?? {}, null, 2)
          : x.config_value,
    }));
    loadingMsg.destroy();
    if (showMsg) message.success('设置已加载');
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(
      '加载失败：' + (err?.message || '未知错误')
    );
  }
}

async function updateSetting(row: any) {
  try {
    let value: any = row._value;
    if (row.value_type === 'NUMBER')
      value = Number(row._value);
    if (row.value_type === 'BOOLEAN')
      value = row._value === 'true' || row._value === true;
    if (row.value_type === 'JSON') {
      try {
        value = JSON.parse(String(row._value || '{}'));
      } catch {
        message.error('JSON 格式错误');
        return;
      }
    }
    await call(RPC.SystemSettings.Update, {
      config_key: row.config_key,
      config_value: value,
    });
    message.success('已更新');
  } catch (err: any) {
    message.error(err?.message || '更新失败');
  }
}

const columns = [
  { title: '键', key: 'config_key' },
  { title: '模块', key: 'module' },
  { title: '分类', key: 'category' },
  { title: '类型', key: 'value_type' },
  {
    title: '值',
    key: '_value',
    render(row: any) {
      if (row.value_type === 'NUMBER') {
        return h(NInputNumber, {
          value: Number(row._value ?? 0),
          onUpdateValue: (v: number | null) =>
            (row._value = v ?? 0),
          onBlur: () => updateSetting(row),
        });
      }
      if (row.value_type === 'BOOLEAN') {
        return h(NSelect, {
          value: String(row._value ?? 'false'),
          options: [
            { label: 'true', value: 'true' },
            { label: 'false', value: 'false' },
          ],
          onUpdateValue: (v: string) => (row._value = v),
          onBlur: () => updateSetting(row),
        });
      }
      return h(NInput, {
        value: String(row._value ?? ''),
        type:
          row.value_type === 'JSON' ? 'textarea' : 'text',
        autosize:
          row.value_type === 'JSON'
            ? { minRows: 4, maxRows: 10 }
            : undefined,
        onUpdateValue: (v: string) => (row._value = v),
        onBlur: () => updateSetting(row),
      });
    },
  },
];
</script>

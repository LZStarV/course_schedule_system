<template>
  <n-el type="div">
    <n-el
      type="div"
      style="display: flex; gap: 12px; margin-bottom: 12px"
    >
      <n-input
        v-model:value="courseId"
        placeholder="课程ID（用于添加收藏）"
        style="max-width: 300px"
      />
      <n-button type="success" @click="addFavorite"
        >添加收藏</n-button
      >
      <n-button type="primary" @click="loadFavorites(true)"
        >刷新列表</n-button
      >
    </n-el>
    <n-data-table :columns="columns" :data="rows" />
  </n-el>
</template>

<script setup lang="ts">
import { ref, h, onMounted } from 'vue';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import {
  NEl,
  NInput,
  NButton,
  NDataTable,
  useMessage,
  NSpace,
} from 'naive-ui';

const message = useMessage();
const courseId = ref('');
const rows = ref<any[]>([]);

async function loadFavorites(showMsg = false) {
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const res = await call<{
      data: any[];
      pagination: any;
    }>(RPC.Favorites.List, { page: 1, page_size: 50 });
    rows.value = res.data || [];
    loadingMsg.destroy();
    if (showMsg) message.success('已刷新');
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(
      '加载失败：' + (err?.message || '未知错误')
    );
  }
}

async function addFavorite() {
  if (!courseId.value) {
    message.error('请输入课程ID');
    return;
  }
  try {
    await call(RPC.Favorites.Add, {
      course_id: courseId.value,
    });
    message.success('已添加收藏');
    await loadFavorites(false);
  } catch (err: any) {
    message.error(err?.message || '添加失败');
  }
}
async function removeFavorite(row: any) {
  try {
    await call(RPC.Favorites.Remove, {
      course_id: row.course_id,
    });
    message.success('已取消收藏');
    await loadFavorites(false);
  } catch (err: any) {
    message.error(err?.message || '取消失败');
  }
}

const columns = [
  { title: '课程ID', key: 'course_id' },
  { title: '分类', key: 'category' },
  { title: '收藏时间', key: 'created_at' },
  {
    title: '操作',
    key: 'actions',
    render(row: any) {
      return h(NSpace, null, {
        default: () => [
          h(
            NButton,
            {
              type: 'error',
              size: 'small',
              onClick: () => removeFavorite(row),
            },
            { default: () => '取消收藏' }
          ),
        ],
      });
    },
  },
];

onMounted(() => loadFavorites(false));
</script>

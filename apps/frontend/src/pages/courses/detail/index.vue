<template>
  <n-el type="div">
    <n-card title="课程详情" style="margin-bottom: 12px">
      <n-descriptions :column="2" bordered>
        <n-descriptions-item label="课程名">{{
          detail?.name
        }}</n-descriptions-item>
        <n-descriptions-item label="学分">{{
          detail?.credit
        }}</n-descriptions-item>
        <n-descriptions-item label="学年">{{
          detail?.academic_year
        }}</n-descriptions-item>
        <n-descriptions-item label="学期">{{
          detail?.semester
        }}</n-descriptions-item>
        <n-descriptions-item label="院系">{{
          detail?.department?.name || '-'
        }}</n-descriptions-item>
        <n-descriptions-item label="任课教师">{{
          detail?.teacher?.username || '-'
        }}</n-descriptions-item>
        <n-descriptions-item label="容量">{{
          detail?.capacity
        }}</n-descriptions-item>
        <n-descriptions-item label="最小开班">{{
          detail?.min_quota
        }}</n-descriptions-item>
      </n-descriptions>
    </n-card>

    <n-card title="排课" style="margin-bottom: 12px">
      <n-data-table
        :columns="scheduleColumns"
        :data="detail?.schedule || []"
      />
    </n-card>

    <n-card
      title="公告（最近 5 条）"
      style="margin-bottom: 12px"
    >
      <n-data-table
        :columns="annoColumns"
        :data="detail?.announcements || []"
      />
      <n-button
        tertiary
        type="primary"
        @click="moreAnnouncements"
        style="margin-top: 8px"
        >查看更多</n-button
      >
    </n-card>

    <n-card title="资料" style="margin-bottom: 12px">
      <n-data-table
        :columns="materialColumns"
        :data="detail?.materials || []"
      />
    </n-card>

    <n-card title="更多信息">
      <n-collapse>
        <n-collapse-item title="课程描述"
          ><div style="white-space: pre-wrap">
            {{ detail?.description || '暂无' }}
          </div></n-collapse-item
        >
        <n-collapse-item title="教学大纲"
          ><div style="white-space: pre-wrap">
            {{ detail?.syllabus || '暂无' }}
          </div></n-collapse-item
        >
        <n-collapse-item title="考核方式"
          ><div style="white-space: pre-wrap">
            {{ detail?.assessment_method || '暂无' }}
          </div></n-collapse-item
        >
        <n-collapse-item title="教材参考"
          ><div style="white-space: pre-wrap">
            {{ detail?.textbook_reference || '暂无' }}
          </div></n-collapse-item
        >
      </n-collapse>
    </n-card>
  </n-el>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import {
  NEl,
  NCard,
  NDataTable,
  NDescriptions,
  NDescriptionsItem,
  NButton,
  useMessage,
  NCollapse,
  NCollapseItem,
} from 'naive-ui';

const route = useRoute();
const router = useRouter();
const message = useMessage();
const detail = ref<any | null>(null);

const scheduleColumns = [
  { title: '周几', key: 'weekday' },
  { title: '开始时间', key: 'start_time' },
  { title: '结束时间', key: 'end_time' },
  { title: '地点', key: 'location' },
];
const annoColumns = [
  { title: '标题', key: 'title' },
  { title: '状态', key: 'status' },
  { title: '发布时间', key: 'published_at' },
];
const materialColumns = [
  { title: '文件名', key: 'file_name' },
  { title: '类型', key: 'file_type' },
  { title: '大小', key: 'file_size' },
  { title: '类别', key: 'category' },
];

async function load() {
  const id = String(route.params.id || '');
  if (!id) {
    message.error('缺少课程ID');
    return;
  }
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    detail.value = await call<any>(RPC.Course.GetDetail, {
      id,
    });
    loadingMsg.destroy();
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(err?.message || '加载失败');
    detail.value = { name: '未找到该课程' } as any;
  }
}

function moreAnnouncements() {
  router.push('/courses/announcements');
}

onMounted(load);
</script>

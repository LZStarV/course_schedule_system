<template>
  <n-el type="div">
    <n-el
      type="div"
      style="display: flex; gap: 12px; margin-bottom: 12px"
    >
      <n-input
        v-model:value="teacherId"
        placeholder="教师ID"
        style="max-width: 300px"
      />
      <n-button type="primary" @click="loadSchedule(true)"
        >加载时间表</n-button
      >
    </n-el>
    <n-grid :x-gap="12" :y-gap="12" :cols="7">
      <n-grid-item v-for="d in 7" :key="d">
        <n-card :title="'周' + d">
          <div
            v-for="slot in daySlots(d)"
            :key="slot.start_time"
            style="margin-bottom: 8px"
          >
            <n-tag type="success"
              >{{ slot.start_time }} -
              {{ slot.end_time }}</n-tag
            >
            <div style="font-size: 12px; color: #666">
              {{ slot.location || '未填' }}
            </div>
          </div>
          <div
            v-if="daySlots(d).length === 0"
            style="color: #999"
          >
            无安排
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <n-divider />
    <n-el
      type="div"
      style="display: flex; gap: 12px; margin-top: 12px"
    >
      <n-input
        v-model:value="applyCourseId"
        placeholder="课程ID"
        style="max-width: 220px"
      />
      <n-input-number
        v-model:value="applyNewDay"
        :min="1"
        :max="7"
        placeholder="新周几"
      />
      <n-button type="warning" @click="applyChange"
        >申请调整</n-button
      >
    </n-el>
  </n-el>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import {
  NEl,
  NInput,
  NButton,
  useMessage,
  NGrid,
  NGridItem,
  NCard,
  NTag,
  NDivider,
  NInputNumber,
} from 'naive-ui';

const message = useMessage();
const teacherId = ref('');
const weekly = ref<
  Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
    location?: string;
  }>
>([]);

async function loadSchedule(showMsg = false) {
  if (!teacherId.value) {
    message.error('请输入教师ID');
    return;
  }
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const res = await call<{ weekly: any[] }>(
      RPC.TeachingSchedule.GetSchedule,
      { teacher_id: teacherId.value }
    );
    weekly.value = res.weekly || [];
    loadingMsg.destroy();
    if (showMsg) message.success('时间表已加载');
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(
      '加载失败：' + (err?.message || '未知错误')
    );
  }
}

function daySlots(d: number) {
  return weekly.value.filter(
    w => Number(w.day_of_week) === d
  );
}

const applyCourseId = ref('');
const applyNewDay = ref<number | null>(null);
async function applyChange() {
  if (!applyCourseId.value || !applyNewDay.value) {
    message.error('请输入课程ID与新周几');
    return;
  }
  try {
    await call(RPC.TeachingSchedule.ApplyChange, {
      course_id: applyCourseId.value,
      new_day_of_week: applyNewDay.value,
    });
    message.success('已提交调整申请');
  } catch (err: any) {
    message.error(err?.message || '申请失败');
  }
}
</script>

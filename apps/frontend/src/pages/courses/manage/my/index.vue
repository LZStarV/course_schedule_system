<template>
  <n-el type="div">
    <n-alert type="info" title="我的课程"
      >分页展示教师课程列表（后端接口补充后切换为真实数据）。</n-alert
    >
    <n-data-table
      :columns="columns"
      :data="rows"
      :pagination="false"
    />
    <div class="pagination-container">
      <n-pagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :page-count="Math.ceil(total / pageSize)"
        :page-sizes="[10, 20, 50]"
        :total="total"
        show-size-picker
        show-quick-jumper
        show-total
        @update:page="onPage"
        @update:page-size="onPageSizeChange"
      />
    </div>
  </n-el>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  NAlert,
  NDataTable,
  NEl,
  NPagination,
} from 'naive-ui';
import { listByTeacher } from '@api/modules/course';
import { useUserStore } from '@stores/user.store';

const userStore = useUserStore();
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const rows = ref<any[]>([]);
const columns = [
  { title: '课程名称', key: 'name' },
  { title: '学分', key: 'credit' },
  { title: '状态', key: 'status' },
];

async function fetchMyCourses() {
  try {
    const res = await listByTeacher({
      teacher_id: userStore.user?.id || '',
      page: page.value,
      page_size: pageSize.value,
    });
    rows.value = res?.data || [];
    total.value = res?.pagination?.total || 0;
  } catch {
    rows.value = [];
    total.value = 0;
  }
}

function onPage(p: number) {
  page.value = p;
  fetchMyCourses();
}

function onPageSizeChange(ps: number) {
  pageSize.value = ps;
  page.value = 1;
  fetchMyCourses();
}

fetchMyCourses();
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding: 16px;
}
</style>

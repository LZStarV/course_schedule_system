<template>
  <div>
    <n-alert type="info" title="我的课表">分页展示课表（后端接口补充后切换为真实数据）。</n-alert>
    <n-data-table :columns="columns" :data="rows" :pagination="false" />
    <table-pagination :page="page" :page-size="pageSize" :total="total" @update:page="onPage" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NAlert, NDataTable } from 'naive-ui';
import TablePagination from '@components/common/TablePagination.vue';
import { listMy } from '@api/modules/enrollment';

const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const rows = ref<any[]>([]);
const columns = [
  { title: '课程名称', key: 'course.name' },
  { title: '周几', key: 'weekday' },
  { title: '开始时间', key: 'start_time' },
  { title: '结束时间', key: 'end_time' },
  { title: '地点', key: 'location' },
];

async function fetch() {
  try {
    const res = await listMy({ page: page.value, page_size: pageSize.value });
    rows.value = res?.data || [];
    total.value = res?.pagination?.total || 0;
  } catch {
    rows.value = [];
    total.value = 0;
  }
}

function onPage(p: number) {
  page.value = p;
  fetch();
}
fetch();
</script>

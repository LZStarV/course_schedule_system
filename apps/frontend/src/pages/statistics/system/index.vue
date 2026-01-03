<template>
  <n-el type="div">
    <n-grid :x-gap="16" :y-gap="16" :cols="4">
      <n-grid-item>
        <n-statistic
          label="用户总数"
          :value="stats.users"
        />
      </n-grid-item>
      <n-grid-item>
        <n-statistic
          label="课程总数"
          :value="stats.courses"
        />
      </n-grid-item>
      <n-grid-item>
        <n-statistic
          label="选课总数"
          :value="stats.enrollments"
        />
      </n-grid-item>
      <n-grid-item>
        <n-statistic
          label="院系总数"
          :value="stats.departments"
        />
      </n-grid-item>
    </n-grid>
    <n-el
      type="div"
      style="
        display: flex;
        gap: 12px;
        align-items: center;
        margin-top: 16px;
        margin-bottom: 8px;
      "
    >
      <n-button type="primary" @click="load">刷新</n-button>
      <n-select
        v-model:value="chartType"
        :options="chartOptions"
        style="max-width: 240px"
      />
    </n-el>
    <div
      ref="chartRef"
      style="width: 100%; height: 360px"
    ></div>
    <n-data-table
      :columns="columns"
      :data="rows"
      :pagination="pagination"
      :remote="true"
    />
  </n-el>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, h } from 'vue';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import {
  NEl,
  NGrid,
  NGridItem,
  NStatistic,
  NButton,
  useMessage,
} from 'naive-ui';
import * as echarts from 'echarts';

const message = useMessage();
const stats = ref<{
  users: number;
  courses: number;
  enrollments: number;
  departments: number;
}>({
  users: 0,
  courses: 0,
  enrollments: 0,
  departments: 0,
});
const chartRef = ref<HTMLDivElement | null>(null);
let chartInst: echarts.ECharts | null = null;
const chartType = ref<
  'roles' | 'status' | 'dept' | 'trend'
>('roles');
const chartOptions = [
  { label: '用户角色分布（饼图）', value: 'roles' },
  { label: '课程状态分布（饼图）', value: 'status' },
  { label: '院系课程数（柱状）', value: 'dept' },
  { label: '按学期趋势（折线）', value: 'trend' },
];
const details = ref<{
  courses_by_department: Array<{
    department_id: string;
    department_name: string;
    count: number;
  }>;
  status_distribution: Record<string, number>;
  courses_by_semester: Array<{
    academic_year: string;
    semester: string;
    courses: number;
    enrollments: number;
  }>;
  enrollments_by_semester: Array<{
    academic_year: string;
    semester: string;
    count: number;
  }>;
}>({
  courses_by_department: [],
  status_distribution: {},
  courses_by_semester: [],
  enrollments_by_semester: [],
});
const userRoles = ref<{
  student: number;
  teacher: number;
  admin: number;
}>({ student: 0, teacher: 0, admin: 0 });
const rows = ref<any[]>([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const columns = [
  { title: '课程名称', key: 'name' },
  {
    title: '任课教师',
    key: 'teacher.username',
    render(row: any) {
      return row.teacher?.username || '-';
    },
  },
  { title: '学分', key: 'credit' },
  { title: '学年', key: 'academic_year' },
  { title: '学期', key: 'semester' },
  { title: '状态', key: 'status' },
  {
    title: '操作',
    key: 'actions',
    render(row: any) {
      return h(
        NButton,
        {
          size: 'small',
          type: 'success',
          onClick: () => approve(row),
        },
        { default: () => '通过' }
      );
    },
  },
];
const pagination = computed(() => ({
  page: page.value,
  pageSize: pageSize.value,
  pageCount: Math.max(
    1,
    Math.ceil(total.value / pageSize.value)
  ),
  pageSizeOptions: [10, 20, 50],
  onUpdatePage: async (p: number) => {
    page.value = p;
    await loadCourses();
  },
  onUpdatePageSize: async (ps: number) => {
    pageSize.value = ps;
    page.value = 1;
    await loadCourses();
  },
}));

async function load() {
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const res = await call<any>(RPC.StatsSystem.Get, {});
    stats.value = res as any;
    const det = await call<any>(
      RPC.StatsSystem.Details,
      {}
    );
    details.value = det as any;
    const roles = await call<any>(RPC.StatsUsers.Get, {});
    userRoles.value = roles as any;
    loadingMsg.destroy();
    renderChart();
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(err?.message || '加载失败');
  }
}

onMounted(load);

async function loadCourses() {
  try {
    const res = await call<any>(RPC.Course.ListForStudent, {
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

async function approve(row: any) {
  try {
    await call(RPC.Course.Approve, {
      id: row.id,
      action: 'APPROVE',
    });
    message.success('已通过');
    await loadCourses();
  } catch (err: any) {
    message.error(err?.message || '操作失败');
  }
}

function renderChart() {
  if (!chartRef.value) return;
  if (!chartInst) chartInst = echarts.init(chartRef.value);
  if (chartType.value === 'roles') {
    chartInst.setOption({
      tooltip: { trigger: 'item' },
      legend: { top: 'bottom' },
      series: [
        {
          type: 'pie',
          radius: '60%',
          data: [
            {
              name: '学生',
              value: userRoles.value.student,
            },
            {
              name: '教师',
              value: userRoles.value.teacher,
            },
            {
              name: '管理员',
              value: userRoles.value.admin,
            },
          ],
        },
      ],
    });
  } else if (chartType.value === 'status') {
    const data = Object.entries(
      details.value.status_distribution
    ).map(([name, value]) => ({ name, value }));
    chartInst.setOption({
      tooltip: { trigger: 'item' },
      legend: { top: 'bottom' },
      series: [{ type: 'pie', radius: '60%', data }],
    });
  } else if (chartType.value === 'dept') {
    const cats = details.value.courses_by_department.map(
      x => x.department_name
    );
    const vals = details.value.courses_by_department.map(
      x => x.count
    );
    chartInst.setOption({
      tooltip: {},
      xAxis: { type: 'category', data: cats },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: vals }],
    });
  } else {
    const cats = details.value.courses_by_semester.map(
      x => `${x.academic_year}-${x.semester}`
    );
    const c1 = details.value.courses_by_semester.map(
      x => x.courses
    );
    const c2 = details.value.courses_by_semester.map(
      x => x.enrollments
    );
    chartInst.setOption({
      tooltip: {},
      xAxis: { type: 'category', data: cats },
      yAxis: { type: 'value' },
      series: [
        { type: 'line', name: '课程数', data: c1 },
        { type: 'line', name: '选课数', data: c2 },
      ],
    });
  }
}
</script>

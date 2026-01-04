<template>
  <n-el type="div">
    <n-el
      type="div"
      style="
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
        align-items: center;
      "
    >
      <n-select
        v-model:value="selectedCourseId"
        :options="searchResults"
        :filterable="true"
        :loading="isSearching"
        placeholder="输入课程名称搜索"
        @search="handleSearch"
        style="max-width: 300px"
      >
        <template #empty>
          <div v-if="isSearching">搜索中...</div>
          <div v-else-if="courseName.trim()">
            无匹配课程
          </div>
          <div v-else>请输入课程名称</div>
        </template>
      </n-select>
      <n-button type="success" @click="addFavorite"
        >添加收藏</n-button
      >
      <n-button type="primary" @click="loadFavorites(true)"
        >刷新列表</n-button
      >
    </n-el>
    <n-data-table
      :columns="columns"
      :data="rows"
      :pagination="pagination"
      :remote="true"
    />
  </n-el>
</template>

<script setup lang="ts">
import {
  ref,
  h,
  onMounted,
  onBeforeUnmount,
  computed,
} from 'vue';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import {
  NEl,
  NButton,
  NDataTable,
  useMessage,
  NSpace,
  NSelect,
} from 'naive-ui';

const message = useMessage();
const courseName = ref('');
const selectedCourseId = ref('');
const searchResults = ref<any[]>([]);
const rows = ref<any[]>([]);
const isSearching = ref(false);
let searchTimer: number | null = null;
const total = ref(0);
const page = ref(1);
const pageSize = ref(50);

const pagination = computed(() => ({
  page: page.value,
  pageSize: pageSize.value,
  pageCount: Math.max(
    1,
    Math.ceil(total.value / pageSize.value)
  ),
  itemCount: total.value,
  prefix({ itemCount }) {
    return `总共 ${itemCount} 条 `;
  },
  onUpdatePage: async (p: number) => {
    page.value = p;
    await loadFavorites(false);
  },
  onUpdatePageSize: async (ps: number) => {
    pageSize.value = ps;
    page.value = 1;
    await loadFavorites(false);
  },
}));

async function loadFavorites(showMsg = false) {
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const res = await call<{
      data: any[];
      pagination: any;
    }>(RPC.Favorites.List, {
      page: page.value,
      page_size: pageSize.value,
    });
    rows.value = res.data || [];
    total.value = res.pagination?.total || 0;
    loadingMsg.destroy();
    if (showMsg) message.success('已刷新');
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(
      '加载失败：' + (err?.message || '未知错误')
    );
  }
}

// 课程搜索功能，使用@search事件
async function handleSearch(searchQuery: string) {
  courseName.value = searchQuery;

  if (!searchQuery.trim()) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;

  // 清除之前的定时器
  if (searchTimer) {
    clearTimeout(searchTimer);
  }

  // 延迟500ms后执行搜索，避免频繁API调用
  searchTimer = window.setTimeout(async () => {
    try {
      // 使用正确的API方法和参数
      const rpcResult = await call<{
        data: any[];
        pagination: any;
      }>(RPC.Course.ListForStudent, {
        keyword: searchQuery,
        page: 1,
        page_size: 10,
      });

      // 检查API返回数据
      if (rpcResult && rpcResult.data) {
        // 确保搜索结果格式正确，并直接更新searchResults数组
        searchResults.value = rpcResult.data.map(
          (course: any) => ({
            label: course.name || '未命名课程',
            value: course.id || '',
          })
        );
      } else {
        searchResults.value = [];
      }
    } catch (err: any) {
      message.error(`搜索失败: ${err?.message || err}`);
      searchResults.value = [];
    } finally {
      isSearching.value = false;
    }
  }, 500);
}

async function addFavorite() {
  if (!selectedCourseId.value) {
    if (courseName.value.trim()) {
      message.warning('请从搜索结果中选择课程');
    } else {
      message.error('请输入课程名称并从搜索结果中选择');
    }
    return;
  }
  try {
    await call(RPC.Favorites.Add, {
      course_id: selectedCourseId.value,
    });
    message.success('已添加收藏');
    await loadFavorites(false);
    // 清空搜索状态
    courseName.value = '';
    selectedCourseId.value = '';
    searchResults.value = [];
  } catch (err: any) {
    // 将Validation error提示改为该课程已收藏
    const errorMessage = err?.message?.includes(
      'Validation error'
    )
      ? '该课程已收藏'
      : err?.message || '添加失败';
    message.error(errorMessage);
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

// 格式化日期时间，以24小时制显示详细时间
function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return '无效时间';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    '0'
  );
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(
    2,
    '0'
  );
  const seconds = String(date.getSeconds()).padStart(
    2,
    '0'
  );

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const columns = [
  {
    title: '课程名称',
    key: 'course_name',
    render: (row: any) => row.course?.name || row.course_id,
  },
  {
    title: '收藏时间',
    key: 'created_at',
    render: (row: any) => formatDateTime(row.created_at),
  },
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

// 组件卸载时清理定时器
onBeforeUnmount(() => {
  if (searchTimer) {
    clearTimeout(searchTimer);
    searchTimer = null;
  }
});
</script>

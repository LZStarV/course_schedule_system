<template>
  <n-el
    type="div"
    style="
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      padding: 40px;
    "
  >
    <n-result
      status="404"
      title="页面未找到"
      description="抱歉，您访问的页面不存在或已被移除。"
    >
      <template #footer>
        <n-button type="primary" @click="goHome"
          >返回首页</n-button
        >
      </template>
    </n-result>
  </n-el>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { NEl, NResult, NButton } from 'naive-ui';
import { usePermissionStore } from '@stores/permission.store';
const router = useRouter();
const perm = usePermissionStore();
function goHome() {
  const target = perm.roleDefaultPath();
  router.push(target || '/');
}
</script>

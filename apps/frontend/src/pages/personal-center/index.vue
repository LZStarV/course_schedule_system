<template>
  <n-el type="div">
    <n-card title="我的信息" style="margin-bottom: 16px">
      <div>用户名：{{ user?.username || '-' }}</div>
      <div>角色：{{ user?.role || '-' }}</div>
    </n-card>
    <n-card title="系统设置（只读）">
      <div>
        当前学年：{{ perms?.system_config?.academic_year }}
      </div>
      <div>
        当前学期：{{
          perms?.system_config?.current_semester
        }}
      </div>
      <div>
        选课状态：{{
          perms?.system_config?.selection_status
        }}
      </div>
      <div>
        允许退课：{{
          perms?.system_config?.allow_withdraw ? '是' : '否'
        }}
      </div>
      <div>
        最大学分：{{ perms?.system_config?.max_credits }}
      </div>
      <n-button
        type="primary"
        style="margin-top: 12px"
        @click="loadPerms"
        >刷新</n-button
      >
    </n-card>
  </n-el>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import { NEl, NCard, NButton, useMessage } from 'naive-ui';
import { useUserStore } from '@stores/user.store';

const message = useMessage();
const userStore = useUserStore();
const user = userStore.user;
const perms = ref<any>(null);

async function loadPerms() {
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const res = await call(RPC.Auth.GetPermissions, {});
    perms.value = res;
    loadingMsg.destroy();
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(err?.message || '加载失败');
  }
}

loadPerms();
</script>

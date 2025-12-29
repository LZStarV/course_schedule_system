<template>
  <n-layout>
    <div style="max-width: 400px; margin: 80px auto">
      <n-card title="登录">
        <n-form :model="form" :rules="rules">
          <n-form-item label="用户名" path="username">
            <n-input v-model:value="form.username" />
          </n-form-item>
          <n-form-item label="密码" path="password">
            <n-input v-model:value="form.password" type="password" />
          </n-form-item>
          <n-form-item>
            <n-button type="primary" :loading="loading" @click="onLogin">登录</n-button>
          </n-form-item>
        </n-form>
      </n-card>
    </div>
  </n-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth.store';
import { usePermissionStore } from '@stores/permission.store';
import { NCard, NForm, NFormItem, NInput, NButton, NLayout } from 'naive-ui';

const router = useRouter();
const auth = useAuthStore();
const perm = usePermissionStore();
const loading = ref(false);
const form = ref({ username: '', password: '' });
const rules = {
  username: { required: true, message: '请输入用户名' },
  password: { required: true, message: '请输入密码' },
} as any;

async function onLogin() {
  loading.value = true;
  try {
    const role = await auth.login(form.value.username, form.value.password);
    const target = perm.roleDefaultPath(role);
    if (target) router.push(target);
  } finally {
    loading.value = false;
  }
}
</script>

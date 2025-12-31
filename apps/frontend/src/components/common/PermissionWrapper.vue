<template>
  <slot v-if="allowed" />
  <div v-else>无权限</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePermissionStore } from '@stores/permission.store';
const props = defineProps<{
  module: string;
  operation?: string;
}>();
const perm = usePermissionStore();
const allowed = computed(() =>
  perm.can(props.module, props.operation)
);
</script>

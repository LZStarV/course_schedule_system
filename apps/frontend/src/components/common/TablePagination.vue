<template>
  <div>
    <slot />
    <div>
      <button @click="prev" :disabled="page <= 1">上一页</button>
      <span>{{ page }} / {{ totalPages }}</span>
      <button @click="next" :disabled="page >= totalPages">下一页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ page: number; pageSize: number; total: number }>();
const emit = defineEmits<{ (e: 'update:page', value: number): void }>();
const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
function prev() {
  emit('update:page', props.page - 1);
}
function next() {
  emit('update:page', props.page + 1);
}
</script>

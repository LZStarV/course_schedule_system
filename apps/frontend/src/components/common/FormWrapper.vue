<template>
  <form @submit.prevent="onSubmit">
    <slot />
    <div>
      <button type="submit" :disabled="loading">提交</button>
    </div>
  </form>
</template>

<script setup lang="ts">
const { loading } = defineProps<{ loading?: boolean }>();
const emit = defineEmits<{ (e: 'submit'): void }>();
function onSubmit() {
  emit('submit');
}
</script>

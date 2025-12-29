import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAppStore = defineStore('app', () => {
  const theme = ref<'auto' | 'light' | 'dark'>((localStorage.getItem('theme') as any) || 'auto');
  const sidebarCollapsed = ref(false);
  const locale = ref('zh-CN');

  const isDark = computed(() => {
    if (theme.value === 'auto')
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    return theme.value === 'dark';
  });

  function applyRootClass() {
    const root = document.documentElement;
    if (isDark.value) root.classList.add('dark');
    else root.classList.remove('dark');
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme.value);
    applyRootClass();
  }

  function toggleThemeAutoAware() {
    const next = isDark.value ? 'light' : 'dark';
    theme.value = next;
    localStorage.setItem('theme', theme.value);
    applyRootClass();
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }

  function setLocale(l: string) {
    locale.value = l;
  }

  // 初始应用一次
  applyRootClass();

  return {
    theme,
    isDark,
    sidebarCollapsed,
    locale,
    toggleTheme,
    toggleThemeAutoAware,
    toggleSidebar,
    setLocale,
  };
});

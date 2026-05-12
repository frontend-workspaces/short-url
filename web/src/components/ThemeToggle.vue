<template>
  <button
    @click="toggle"
    :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    class="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200
           bg-slate-100 hover:bg-slate-200 text-slate-600
           dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-amber-400"
  >
    <!-- Sun: visible in dark mode, click to go light -->
    <svg v-if="isDark" class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    <!-- Moon: visible in light mode, click to go dark -->
    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  </button>
</template>

<script setup>
import { useTheme } from '../composables/useTheme';
const { isDark, toggle } = useTheme();
</script>

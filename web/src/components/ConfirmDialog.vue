<template>
  <div
    class="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in"
    @click.self="$emit('cancel')"
  >
    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-slate-700 w-full max-w-sm animate-slide-in-modal">

      <!-- Icon + content -->
      <div class="p-7 text-center">
        <div class="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-slate-100">ออกจากระบบ</h3>
        <p class="text-sm text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
          คุณต้องการออกจากระบบใช่หรือไม่?<br />
          <span class="text-gray-400 dark:text-slate-500 text-xs">Session ของคุณจะสิ้นสุดลง</span>
        </p>
      </div>

      <!-- Buttons -->
      <div class="px-6 pb-6 flex gap-3">
        <button
          @click="$emit('cancel')"
          class="flex-1 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-semibold
                 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800
                 transition-all duration-150"
        >
          ยกเลิก
        </button>
        <button
          @click="$emit('confirm')"
          class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold
                 transition-all duration-150 shadow-lg shadow-red-500/25 hover:shadow-red-500/40
                 hover:-translate-y-0.5 active:translate-y-0"
        >
          ออกจากระบบ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['confirm', 'cancel']);
</script>

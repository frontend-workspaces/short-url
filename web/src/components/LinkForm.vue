<template>
  <div
    class="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
    @click.self="$emit('close')"
  >
    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-slate-700 w-full max-w-md animate-slide-in-modal transition-colors duration-200">

      <!-- Header -->
      <div class="flex justify-between items-center px-6 py-5 border-b border-gray-200 dark:border-slate-700">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h2 class="text-base font-bold text-gray-900 dark:text-slate-100">
            {{ link ? 'แก้ไข Short Link' : 'สร้าง Short Link ใหม่' }}
          </h2>
        </div>
        <button
          @click="$emit('close')"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-150"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
        <!-- Title -->
        <div>
          <label class="block text-sm font-semibold text-gray-800 dark:text-slate-200 mb-1.5">
            Title <span class="text-gray-400 dark:text-slate-500 font-normal text-xs ml-1">(optional)</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            placeholder="ชื่อสำหรับจดจำ"
            class="w-full border border-gray-300 dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-sm
                   bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-all duration-200"
          />
        </div>

        <!-- Original URL -->
        <div>
          <label class="block text-sm font-semibold text-gray-800 dark:text-slate-200 mb-1.5">
            Original URL <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
            <input
              v-model="form.originalUrl"
              type="url"
              required
              placeholder="https://example.com/long-url"
              class="w-full pl-10 pr-4 border border-gray-300 dark:border-slate-600 rounded-xl py-2.5 text-sm
                     bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
            />
          </div>
        </div>

        <!-- Custom code (create only) -->
        <div v-if="!link">
          <label class="block text-sm font-semibold text-gray-800 dark:text-slate-200 mb-1.5">
            Custom Code <span class="text-gray-400 dark:text-slate-500 font-normal text-xs ml-1">(ปล่อยว่างเพื่อสุ่มอัตโนมัติ)</span>
          </label>
          <div class="flex items-stretch border border-gray-300 dark:border-slate-600 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
            <span class="px-3.5 flex items-center text-gray-600 dark:text-slate-400 text-sm font-bold bg-gray-100 dark:bg-slate-700 border-r border-gray-300 dark:border-slate-600 select-none">/</span>
            <input
              v-model="form.code"
              type="text"
              placeholder="my-link"
              class="flex-1 px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        <!-- Active toggle -->
        <div class="flex items-center justify-between py-1">
          <div>
            <p class="text-sm font-semibold text-gray-800 dark:text-slate-200">สถานะ Link</p>
            <p class="text-xs text-gray-500 dark:text-slate-500 mt-0.5">
              {{ form.isActive ? 'Link พร้อมใช้งาน' : 'Link ถูกปิดใช้งาน' }}
            </p>
          </div>
          <button
            type="button"
            @click="form.isActive = !form.isActive"
            :class="form.isActive ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none"
          >
            <span
              :class="form.isActive ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200"
            />
          </button>
        </div>

        <!-- Error -->
        <div
          v-if="error"
          class="flex items-center gap-2 text-red-700 dark:text-red-400 text-sm
                 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40
                 px-4 py-3 rounded-xl animate-scale-in"
        >
          <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          {{ error }}
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-1">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl text-sm font-semibold
                   text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-150"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold
                   hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed
                   transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ loading ? 'กำลังบันทึก...' : 'บันทึก' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useLinksStore } from '../stores/links';

const props = defineProps({ link: Object });
const emit = defineEmits(['close', 'saved']);
const store = useLinksStore();

const form = reactive({
  title: props.link?.title || '',
  originalUrl: props.link?.originalUrl || '',
  code: '',
  isActive: props.link?.isActive ?? true,
});

const error = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;
  try {
    if (props.link) {
      await store.updateLink(props.link._id, {
        title: form.title,
        originalUrl: form.originalUrl,
        isActive: form.isActive,
      });
    } else {
      await store.createLink({
        title: form.title,
        originalUrl: form.originalUrl,
        code: form.code || undefined,
        isActive: form.isActive,
      });
    }
    emit('saved');
  } catch (e) {
    error.value = e.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่';
  } finally {
    loading.value = false;
  }
};
</script>

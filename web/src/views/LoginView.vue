<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">

    <!-- Decorative blobs -->
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-300/20 dark:bg-blue-800/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-300/20 dark:bg-indigo-800/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

    <!-- Theme toggle -->
    <div class="absolute top-5 right-5">
      <ThemeToggle />
    </div>

    <div class="relative w-full max-w-sm animate-slide-up">
      <!-- Card -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-300/50 dark:shadow-black/40 border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">

        <!-- Brand area -->
        <div class="pt-10 pb-7 px-8 text-center border-b border-gray-200 dark:border-slate-700">
          <div class="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/30">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Short Link Manager</h1>
          <p class="text-sm text-gray-600 dark:text-slate-400 mt-1.5">จัดการ Short Link ของคุณได้ในที่เดียว</p>
        </div>

        <!-- Form body -->
        <div class="px-8 py-7">
          <!-- Tabs -->
          <div class="flex bg-gray-100 dark:bg-slate-800 rounded-2xl p-1 mb-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="mode = tab.id; error = ''"
              :class="mode === tab.id
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'"
              class="flex-1 py-2.5 text-sm rounded-xl transition-all duration-200"
            >
              {{ tab.label }}
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Email -->
            <div>
              <label class="block text-sm font-semibold text-gray-800 dark:text-slate-200 mb-1.5">Email</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-gray-500 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  v-model="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  class="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl text-sm
                         bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-semibold text-gray-800 dark:text-slate-200 mb-1.5">Password</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-gray-500 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  v-model="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  class="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl text-sm
                         bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
                />
              </div>
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

            <!-- Submit -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full mt-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm
                     disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200
                     shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
                     hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ loading ? 'กำลังดำเนินการ...' : mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก' }}
            </button>
          </form>
        </div>
      </div>

      <p class="text-center text-gray-500 dark:text-slate-600 text-xs mt-5">
        Short Link Manager &copy; {{ new Date().getFullYear() }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import ThemeToggle from '../components/ThemeToggle.vue';

const router = useRouter();
const auth = useAuthStore();

const tabs = [
  { id: 'login', label: 'เข้าสู่ระบบ' },
  { id: 'register', label: 'สมัครสมาชิก' },
];

const mode = ref('login');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;
  try {
    if (mode.value === 'login') {
      await auth.login(email.value, password.value);
    } else {
      await auth.register(email.value, password.value);
    }
    router.push('/');
  } catch (e) {
    error.value = e.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่';
  } finally {
    loading.value = false;
  }
};
</script>

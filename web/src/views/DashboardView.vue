<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">

    <!-- Sticky Navbar -->
    <nav class="bg-white dark:bg-slate-900 backdrop-blur-md border-b border-gray-200 dark:border-slate-700/60 sticky top-0 z-10 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <span class="text-lg font-bold text-gray-900 dark:text-slate-100 tracking-tight">Short Link</span>
        </div>

        <!-- Right controls -->
        <div class="flex items-center gap-2">
          <span class="hidden sm:flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-full font-medium transition-colors duration-200">
            <span class="w-2 h-2 bg-green-500 rounded-full" />
            {{ auth.user?.email }}
          </span>
          <ThemeToggle />
          <button
            @click="showLogoutConfirm = true"
            class="flex items-center gap-1.5 text-sm text-gray-700 dark:text-slate-300 font-medium hover:text-red-600 dark:hover:text-red-400 px-3 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            ออกจากระบบ
          </button>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <!-- Total links -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm p-5 flex items-center gap-4 animate-slide-up transition-colors duration-200" style="animation-delay:0ms">
          <div class="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-slate-100">{{ store.links.length }}</p>
            <p class="text-sm font-medium text-gray-600 dark:text-slate-400">Links ทั้งหมด</p>
          </div>
        </div>

        <!-- Active links -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm p-5 flex items-center gap-4 animate-slide-up transition-colors duration-200" style="animation-delay:60ms">
          <div class="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center shrink-0">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-slate-100">{{ store.links.filter(l => l.isActive).length }}</p>
            <p class="text-sm font-medium text-gray-600 dark:text-slate-400">Links ที่ใช้งาน</p>
          </div>
        </div>

        <!-- Total clicks -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm p-5 flex items-center gap-4 animate-slide-up transition-colors duration-200" style="animation-delay:120ms">
          <div class="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center shrink-0">
            <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-slate-100">{{ totalClicks.toLocaleString() }}</p>
            <p class="text-sm font-medium text-gray-600 dark:text-slate-400">คลิกทั้งหมด</p>
          </div>
        </div>
      </div>

      <!-- Table header -->
      <div class="flex justify-between items-center mb-4 animate-fade-in" style="animation-delay:180ms">
        <h2 class="text-xl font-bold text-gray-900 dark:text-slate-100">Short Links</h2>
        <button
          @click="openCreate"
          class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold
                 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200
                 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
                 hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          สร้าง Link ใหม่
        </button>
      </div>

      <div class="animate-fade-in" style="animation-delay:220ms">
        <LinkTable
          :links="store.links"
          :loading="store.loading"
          @edit="openEdit"
          @delete="handleDelete"
          @logs="openLogs"
        />
      </div>
    </div>

    <!-- Modals -->
    <LinkForm v-if="showForm" :link="editingLink" @close="showForm = false" @saved="showForm = false" />
    <LogModal v-if="showLogs" :link="viewingLink" @close="showLogs = false" />
    <ConfirmDialog
      v-if="showLogoutConfirm"
      @confirm="handleLogout"
      @cancel="showLogoutConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useLinksStore } from '../stores/links';
import ThemeToggle from '../components/ThemeToggle.vue';
import LinkTable from '../components/LinkTable.vue';
import LinkForm from '../components/LinkForm.vue';
import LogModal from '../components/LogModal.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';

const router = useRouter();
const auth = useAuthStore();
const store = useLinksStore();

const showForm = ref(false);
const editingLink = ref(null);
const showLogs = ref(false);
const viewingLink = ref(null);
const showLogoutConfirm = ref(false);

const totalClicks = computed(() => store.links.reduce((s, l) => s + l.clickCount, 0));

onMounted(() => store.fetchLinks());

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};

const openCreate = () => { editingLink.value = null; showForm.value = true; };
const openEdit = (link) => { editingLink.value = link; showForm.value = true; };
const openLogs = (link) => { viewingLink.value = link; showLogs.value = true; };
const handleDelete = async (id) => {
  if (!confirm('ต้องการลบ link นี้ใช่หรือไม่?')) return;
  await store.deleteLink(id);
};
</script>

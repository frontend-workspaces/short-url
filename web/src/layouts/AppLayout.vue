<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950">

    <!-- Mobile overlay -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0"
    >
      <div
        v-if="ui.sidebarOpen"
        class="fixed inset-0 bg-black/40 z-40 lg:hidden"
        @click="ui.sidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-[270px] bg-white dark:bg-slate-900',
        'border-r border-gray-200 dark:border-slate-700/60 flex flex-col',
        'transition-transform duration-300 lg:static lg:translate-x-0',
        ui.sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <!-- Logo -->
      <div class="px-5 pt-6 pb-5 flex items-center gap-3 border-b border-gray-100 dark:border-slate-800 mb-2">
        <div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <div>
          <span class="text-base font-bold text-gray-900 dark:text-white tracking-tight leading-none">Blly.to</span>
          <p class="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Short Link Manager</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 space-y-0.5 py-2">
        <template v-for="item in navItems">
          <router-link
            v-if="can(item.permission)"
            :key="item.path"
            :to="item.path"
            @click="ui.sidebarOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
            :class="$route.path === item.path
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200'"
          >
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.iconD" />
            </svg>
            {{ item.label }}
          </router-link>
        </template>
      </nav>

      <!-- User info footer -->
      <div class="px-3 py-4 border-t border-gray-100 dark:border-slate-800">
        <div class="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group" @click="goProfile">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0 text-white text-xs font-bold uppercase shadow-sm">
            {{ displayName.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate leading-tight">{{ displayName }}</p>
            <p class="text-xs text-gray-400 dark:text-slate-500 truncate mt-0.5">{{ auth.user?.email }}</p>
          </div>
          <svg class="w-4 h-4 text-gray-300 dark:text-slate-600 group-hover:text-gray-500 dark:group-hover:text-slate-400 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </aside>

    <!-- Main content area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top bar -->
      <header class="flex items-center justify-between px-4 lg:px-6 py-3 bg-transparent shrink-0">
        <button
          class="lg:hidden p-2 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          @click="ui.sidebarOpen = !ui.sidebarOpen"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="ml-auto flex items-center gap-2">
          <!-- Theme toggle -->
          <ThemeToggle />

          <!-- Logout button -->
          <button
            @click="onLogout"
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            title="Logout"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-auto">
        <router-view />
      </main>
    </div>

    <!-- Toasts -->
    <ToastContainer />

    <!-- Modals -->
    <LinkForm
      v-if="ui.showLinkForm"
      :link="ui.editingLink"
      @close="ui.closeForm()"
      @saved="handleFormSaved"
    />
    <LogModal
      v-if="ui.showLogModal && ui.viewingLink"
      :link="ui.viewingLink"
      @close="ui.closeLogs()"
    />
    <ConfirmDialog
      v-if="ui.showLogoutConfirm"
      @confirm="handleLogout"
      @cancel="ui.showLogoutConfirm = false"
    />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useUIStore } from '../stores/ui';
import { useLinksStore } from '../stores/links';
import { useTheme } from '../composables/useTheme';
import { usePermission } from '../composables/usePermission';
import LinkForm from '../components/LinkForm.vue';
import LogModal from '../components/LogModal.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import ThemeToggle from '../components/ThemeToggle.vue';
import ToastContainer from '../components/ToastContainer.vue';

const router = useRouter();
const auth = useAuthStore();
const ui = useUIStore();
const store = useLinksStore();
const { init: initTheme } = useTheme();
const { can } = usePermission();

const navItems = [
  { path: '/dashboard', label: 'Dashboard', permission: 'dashboard', iconD: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { path: '/urls',      label: 'URLs',      permission: 'urls',      iconD: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' },
  { path: '/users',     label: 'Users',     permission: 'users',     iconD: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { path: '/roles',     label: 'Roles',     permission: 'roles',     iconD: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { path: '/docs',      label: 'Docs',      permission: 'docs',      iconD: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { path: '/api-key',            label: 'API Key',        permission: 'api_key',   iconD: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
  { path: '/api-key-management', label: 'API Key Manage', permission: 'api_keys',  iconD: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18' },
];

const displayName = computed(() => {
  if (auth.user?.fullName) return auth.user.fullName;
  const email = auth.user?.email || '';
  return email.split('@')[0] || 'User';
});

const goProfile = () => {
  router.push('/profile');
};

const onLogout = () => {
  ui.showLogoutConfirm = true;
};

const ROUTE_PERMISSION = {
  '/dashboard': 'dashboard',
  '/urls': 'urls',
  '/users': 'users',
  '/roles': 'roles',
  '/docs': 'docs',
  '/api-key': 'api_key',
  '/api-key-management': 'api_keys',
};

onMounted(async () => {
  initTheme();
  if (auth.token && !auth.user) {
    await auth.fetchMe();
  }
  // Redirect if current route has no view permission
  const requiredPerm = ROUTE_PERMISSION[router.currentRoute.value.path];
  if (requiredPerm && !can(requiredPerm)) {
    const first = navItems.find((n) => can(n.permission));
    router.replace(first ? first.path : '/login');
  }
});

const handleCreateLink = () => {
  ui.openCreate();
  ui.sidebarOpen = false;
};

const handleFormSaved = () => {
  ui.closeForm();
  store.fetchAnalytics();
};

const handleLogout = () => {
  ui.showLogoutConfirm = false;
  auth.logout();
  router.push('/login');
};
</script>

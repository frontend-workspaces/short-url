<template>
  <div class="px-4 lg:px-8 py-6">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-slate-100">URLs</h1>
      <button
        @click="ui.openCreate()"
        class="shorten-btn flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-px active:translate-y-0 active:shadow-md"
      >
        <svg class="w-4 h-4 transition-transform duration-200 group-hover:rotate-90 shorten-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
        Shorten URL
      </button>
    </div>

    <!-- Card -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm overflow-hidden">

      <!-- Search + Filter -->
      <div class="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <!-- Search -->
        <div class="relative flex-1 max-w-sm">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="Search URL..."
            class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            @input="currentPage = 1"
          />
        </div>

        <!-- Status filter -->
        <div class="w-44 shrink-0">
          <AppSelect
            v-model="activeFilter"
            @change="currentPage = 1"
            :options="[
              { value: 'all',      label: 'All Statuses' },
              { value: 'active',   label: 'Active',   dot: 'bg-emerald-500' },
              { value: 'inactive', label: 'Inactive', dot: 'bg-gray-400' },
              { value: 'expired',  label: 'Expired',  dot: 'bg-orange-500' },
            ]"
            placeholder="All Statuses"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <!-- Loading -->
        <div v-if="store.loading" class="p-16 flex flex-col items-center gap-3 text-gray-400 dark:text-slate-600">
          <svg class="animate-spin w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span class="text-sm">กำลังโหลด...</span>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredLinks.length === 0" class="p-16 flex flex-col items-center gap-3">
          <div class="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <p class="font-semibold text-gray-700 dark:text-slate-300">ไม่พบลิงค์</p>
          <p class="text-sm text-gray-400 dark:text-slate-600">ลองเปลี่ยน filter หรือสร้างลิงค์ใหม่</p>
        </div>

        <!-- Data table -->
        <table v-else class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wide w-12">No.</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wide w-32">Title</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wide">Short Link</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wide">Original URL</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wide w-16">Visits</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wide w-24">Status</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wide w-32 cursor-pointer select-none"
                @click="toggleSort"
              >
                <span class="flex items-center gap-1">
                  Created At
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wide w-32">Expired At</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wide w-24">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-slate-800">
            <tr
              v-for="(link, idx) in pagedLinks"
              :key="link._id"
              class="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors group"
            >
              <!-- No. -->
              <td class="px-4 py-3.5 text-gray-400 dark:text-slate-600 text-xs">
                {{ (currentPage - 1) * pageSize + idx + 1 }}
              </td>
              <!-- Title -->
              <td class="px-4 py-3.5 max-w-[128px]">
                <span class="text-sm text-gray-700 dark:text-slate-300 truncate block" :title="link.title">
                  {{ link.title || '—' }}
                </span>
              </td>
              <!-- Short Link -->
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-2">
                  <a
                    :href="`${baseShortUrl}/${link.code}`"
                    target="_blank"
                    class="text-blue-600 dark:text-blue-400 hover:underline font-mono text-xs bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg"
                  >
                    /{{ link.code }}
                  </a>
                  <button
                    @click="copyLink(link.code)"
                    class="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-all"
                    :title="copied === link.code ? 'Copied!' : 'Copy'"
                  >
                    <svg v-if="copied !== link.code" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <svg v-else class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </td>
              <!-- Original URL -->
              <td class="px-4 py-3.5 max-w-[200px]">
                <span class="text-xs text-gray-500 dark:text-slate-500 truncate block" :title="link.originalUrl">
                  {{ link.originalUrl }}
                </span>
              </td>
              <!-- Visits -->
              <td class="px-4 py-3.5 text-gray-700 dark:text-slate-300 font-medium text-sm">
                {{ link.clickCount.toLocaleString() }}
              </td>
              <!-- Status -->
              <td class="px-4 py-3.5">
                <span
                  :class="linkStatus(link).cls"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                >
                  <!-- Clock icon for expired -->
                  <svg v-if="isExpired(link)" class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0" />
                  </svg>
                  <!-- Dot for active / inactive -->
                  <span v-else class="w-1.5 h-1.5 rounded-full shrink-0" :class="linkStatus(link).dotCls" />
                  {{ linkStatus(link).label }}
                </span>
              </td>
              <!-- Created At -->
              <td class="px-4 py-3.5 text-xs text-gray-500 dark:text-slate-500">
                {{ formatDate(link.createdAt) }}
              </td>
              <!-- Expired At -->
              <td class="px-4 py-3.5 text-xs">
                <span v-if="link.expiresAt" :class="isExpired(link) ? 'text-orange-500 dark:text-orange-400' : 'text-gray-500 dark:text-slate-500'">
                  {{ formatDate(link.expiresAt) }}
                </span>
                <span v-else class="text-gray-300 dark:text-slate-700">—</span>
              </td>
              <td class="px-4 py-3.5">
                <div class="flex justify-end gap-1">
                  <button @click="ui.openLogs(link)" title="ดู Logs"
                    class="p-1.5 rounded-lg text-gray-400 dark:text-slate-600 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </button>
                  <button @click="ui.openEdit(link)" title="แก้ไข"
                    class="p-1.5 rounded-lg text-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="handleDelete(link._id)" title="ลบ"
                    class="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="filteredLinks.length > 0" class="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-slate-800">
        <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-500">
          <span>{{ paginationInfo }}</span>
          <div class="w-28">
            <AppSelect
              v-model="pageSize"
              @change="currentPage = 1"
              :options="[
                { value: 10,  label: '10 / page' },
                { value: 50,  label: '50 / page' },
                { value: 100, label: '100 / page' },
              ]"
              trigger-class="!py-1.5 !text-xs"
            />
          </div>
        </div>
        <div class="flex items-center gap-1">
          <button
            :disabled="currentPage <= 1"
            @click="currentPage--"
            class="p-1.5 rounded-lg text-gray-500 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
            class="p-1.5 rounded-lg text-gray-500 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useLinksStore } from '../stores/links';
import { useUIStore } from '../stores/ui';
import { useToast } from '../composables/useToast';
import AppSelect from '../components/AppSelect.vue';

const store = useLinksStore();
const ui = useUIStore();
const toast = useToast();

const baseShortUrl = import.meta.env.VITE_BASE_SHORT_URL || '';
const search = ref('');
const activeFilter = ref('all');
const currentPage = ref(1);
const pageSize = ref(10);
const sortDesc = ref(true);
const copied = ref(null);


const isExpired = (link) => !!link.expiresAt && new Date(link.expiresAt) < new Date();

const linkStatus = (link) => {
  if (isExpired(link)) {
    return {
      label: 'Expired',
      cls: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/40',
      dotCls: '',
    };
  }
  if (!link.isActive) {
    return {
      label: 'Inactive',
      cls: 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
      dotCls: 'bg-gray-400 dark:bg-slate-500',
    };
  }
  return {
    label: 'Active',
    cls: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/40',
    dotCls: 'bg-green-500 dark:bg-green-400',
  };
};

const filteredLinks = computed(() => {
  const now = new Date();
  let list = store.links.filter((link) => {
    if (search.value) {
      const q = search.value.toLowerCase();
      if (!link.code.toLowerCase().includes(q) &&
          !link.originalUrl?.toLowerCase().includes(q) &&
          !(link.title || '').toLowerCase().includes(q)) return false;
    }
    const expired = link.expiresAt && new Date(link.expiresAt) < now;
    if (activeFilter.value === 'active')   return link.isActive && !expired;
    if (activeFilter.value === 'inactive') return !link.isActive && !expired;
    if (activeFilter.value === 'expired')  return !!expired;
    return true;
  });

  list = [...list].sort((a, b) => {
    const diff = new Date(b.createdAt) - new Date(a.createdAt);
    return sortDesc.value ? diff : -diff;
  });
  return list;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredLinks.value.length / pageSize.value)));

const pagedLinks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredLinks.value.slice(start, start + pageSize.value);
});

const paginationInfo = computed(() => {
  const total = filteredLinks.value.length;
  if (total === 0) return '0 items';
  const start = (currentPage.value - 1) * pageSize.value + 1;
  const end = Math.min(currentPage.value * pageSize.value, total);
  return `${start}–${end} of ${total}`;
});

const toggleSort = () => { sortDesc.value = !sortDesc.value; };

const copyLink = async (code) => {
  await navigator.clipboard.writeText(`${baseShortUrl}/${code}`);
  copied.value = code;
  toast.success('Link copied to clipboard');
  setTimeout(() => { copied.value = null; }, 2000);
};

const handleDelete = async (id) => {
  if (!confirm('ต้องการลบ link นี้ใช่หรือไม่?')) return;
  try {
    await store.deleteLink(id);
    toast.success('Link deleted');
  } catch {
    toast.error('Failed to delete link');
  }
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');

onMounted(() => store.fetchLinks());
</script>

<style scoped>
.shorten-btn {
  position: relative;
  overflow: hidden;
}

.shorten-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent 0%,
    rgba(255, 255, 255, 0.28) 50%,
    transparent 100%
  );
  transform: skewX(-20deg);
  transition: none;
  pointer-events: none;
}

.shorten-btn:hover::after {
  left: 140%;
  transition: left 0.55s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

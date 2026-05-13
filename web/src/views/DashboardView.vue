<template>
  <div class="px-4 lg:px-8 py-6 space-y-5">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-slate-100">Hi, Welcome back 👋</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-slate-500 flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0" />
          </svg>
          Last updated {{ lastUpdatedText }} • Updates hourly
        </p>
      </div>
      <div class="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-medium px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-800/40 shrink-0">
        <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        Analytics based on most recent 1000 clicks per URL
      </div>
    </div>

    <!-- Stat cards (3 columns) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        title="Total Links"
        :value="analytics?.stats?.totalLinks ?? store.links.length"
        :sparkline="linksCreatedSparkline"
        :dates="timelineDates"
        labelUnit="Links"
        color="green"
      />
      <StatCard
        title="Links Active"
        :value="analytics?.stats?.activeLinks ?? store.links.filter(l => l.isActive).length"
        :sparkline="clicksSparkline"
        :dates="timelineDates"
        labelUnit="Visits"
        color="blue"
      />
      <StatCard
        title="Total Clicks"
        :value="analytics?.stats?.totalClicks ?? totalClicks"
        :sparkline="clicksSparkline"
        :dates="timelineDates"
        labelUnit="Clicks"
        color="indigo"
      />
    </div>

    <!-- Engagement Timeline -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-bold text-gray-900 dark:text-slate-100">Engagement Timeline</h3>
        <span class="text-xs text-gray-500 dark:text-slate-500">last 7 days</span>
      </div>
      <div class="h-52">
        <Bar v-if="timelineChartData" :data="timelineChartData" :options="timelineOptions" />
        <div v-else class="h-full flex items-center justify-center text-sm text-gray-400 dark:text-slate-600">กำลังโหลด...</div>
      </div>
    </div>

    <!-- Traffic by Device + Traffic by Type (2 columns) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Traffic by Device -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-gray-900 dark:text-slate-100">Traffic by Device</h3>
          <span class="text-xs text-gray-500 dark:text-slate-500">last 7 days</span>
        </div>
        <div class="flex flex-col items-center">
          <div class="h-52 w-full max-w-[220px]">
            <Doughnut v-if="deviceChartData" :data="deviceChartData" :options="doughnutOptions" />
            <div v-else class="h-full flex items-center justify-center text-sm text-gray-400 dark:text-slate-600">ไม่มีข้อมูล</div>
          </div>
          <!-- Legend -->
          <div v-if="analytics?.devices?.length" class="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
            <div
              v-for="(d, i) in analytics.devices.slice(0, 5)"
              :key="d.name"
              class="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400"
            >
              <span class="w-2.5 h-2.5 rounded-full" :style="{ background: CHART_COLORS[i % CHART_COLORS.length] }" />
              {{ d.name }}
            </div>
          </div>
          <p v-else class="mt-4 text-sm text-gray-400 dark:text-slate-600">ไม่มีข้อมูลการเข้าชม</p>
        </div>
      </div>

      <!-- Traffic by Type -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-gray-900 dark:text-slate-100">Traffic by Type</h3>
          <span class="text-xs text-gray-500 dark:text-slate-500">last 7 days</span>
        </div>
        <div class="flex flex-col items-center">
          <div class="h-52 w-full max-w-[220px]">
            <Doughnut v-if="trafficTypeChartData" :data="trafficTypeChartData" :options="doughnutOptions" />
            <div v-else class="h-full flex items-center justify-center text-sm text-gray-400 dark:text-slate-600">ไม่มีข้อมูล</div>
          </div>
          <div class="mt-4 flex gap-5 justify-center">
            <div class="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Direct Clicks
            </div>
            <div class="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              QR Code Scans
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Locations -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-bold text-gray-900 dark:text-slate-100">Locations</h3>
        <div class="flex gap-1 bg-gray-100 dark:bg-slate-800 p-0.5 rounded-lg">
          <button
            v-for="tab in ['Countries', 'Cities']"
            :key="tab"
            @click="locationTab = tab"
            class="text-xs px-3 py-1.5 rounded-md font-medium transition-colors duration-150"
            :class="locationTab === tab
              ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm'
              : 'text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300'"
          >{{ tab }}</button>
        </div>
      </div>

      <div v-if="locationRows.length" class="space-y-2.5">
        <div
          v-for="(row, i) in locationRows"
          :key="row.name"
          class="flex items-center gap-3"
        >
          <span class="text-xs text-gray-400 dark:text-slate-600 w-4 text-right shrink-0">{{ i + 1 }}</span>
          <span class="text-sm font-medium text-gray-800 dark:text-slate-200 w-28 shrink-0 truncate">{{ row.name }}</span>
          <div class="flex-1 bg-gray-100 dark:bg-slate-800 rounded-full h-1.5">
            <div
              class="h-1.5 rounded-full bg-blue-500"
              :style="{ width: row.percent + '%' }"
            />
          </div>
          <span class="text-xs text-gray-500 dark:text-slate-500 w-6 text-right shrink-0">{{ row.count }}</span>
          <span class="text-xs text-gray-400 dark:text-slate-600 w-10 text-right shrink-0">{{ row.percent }}%</span>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400 dark:text-slate-600 py-4 text-center">ไม่มีข้อมูลที่ตั้ง</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'vue-chartjs';
import { useLinksStore } from '../stores/links';
import StatCard from '../components/StatCard.vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const store = useLinksStore();

const locationTab = ref('Countries');
const lastUpdatedText = ref('');

const CHART_COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#f97316'];

const analytics = computed(() => store.analytics);

const totalClicks = computed(() => store.links.reduce((s, l) => s + l.clickCount, 0));

// Sparkline arrays (last 7 days)
const timelineDates = computed(() =>
  analytics.value?.timeline?.map((d) => d.date) ?? []
);
const clicksSparkline = computed(() =>
  analytics.value?.timeline?.map((d) => d.clicks) ?? []
);
const linksCreatedSparkline = computed(() =>
  analytics.value?.timeline?.map((d) => d.linksCreated) ?? []
);

// Timeline chart
const timelineChartData = computed(() => {
  const t = analytics.value?.timeline;
  if (!t) return null;
  return {
    labels: t.map((d) => d.date.slice(5)),
    datasets: [
      {
        label: 'Clicks',
        data: t.map((d) => d.clicks),
        backgroundColor: '#06b6d4',
        borderRadius: 4,
        barPercentage: 0.6,
      },
      {
        label: 'QR Scans',
        data: t.map((d) => d.qrScans),
        backgroundColor: '#f59e0b',
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  };
});

const timelineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#9ca3af', font: { size: 11 } },
    },
    y: {
      grid: { color: 'rgba(156,163,175,0.15)' },
      ticks: { color: '#9ca3af', font: { size: 11 }, stepSize: 1 },
      beginAtZero: true,
    },
  },
};

// Device chart
const deviceChartData = computed(() => {
  const devices = analytics.value?.devices;
  if (!devices?.length) return null;
  return {
    labels: devices.map((d) => d.name),
    datasets: [{
      data: devices.map((d) => d.count),
      backgroundColor: CHART_COLORS,
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };
});

// Traffic type chart
const trafficTypeChartData = computed(() => {
  const t = analytics.value?.trafficType;
  if (!t) return null;
  const total = (t.direct || 0) + (t.qr || 0) + (t.referral || 0);
  if (total === 0) return null;
  return {
    labels: ['Direct Clicks', 'QR Code Scans'],
    datasets: [{
      data: [t.direct || 0, t.qr || 0],
      backgroundColor: ['#3b82f6', '#06b6d4'],
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };
});

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '72%',
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
};

// Locations
const locationRows = computed(() => {
  if (!analytics.value?.locations) return [];
  return locationTab.value === 'Countries'
    ? analytics.value.locations.countries
    : analytics.value.locations.cities;
});

onMounted(async () => {
  await Promise.all([store.fetchLinks(), store.fetchAnalytics()]);
  if (analytics.value?.lastUpdated) {
    lastUpdatedText.value = new Date(analytics.value.lastUpdated).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  } else {
    lastUpdatedText.value = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  }
});
</script>

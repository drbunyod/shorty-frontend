<script setup>
import { computed, onMounted, ref } from 'vue';
import api from '@/services/api';
import AnalyticsChart from '@/components/AnalyticsChart.vue';
import { categorySeries, dailySeries } from '@/utils/analytics';

const analytics = ref(null);
const loading = ref(true);
const error = ref('');
const range = ref('30');

const daily = computed(() => dailySeries(analytics.value?.dailyClicks, range.value));
const browsers = computed(() => categorySeries(analytics.value?.browserClicks));
const systems = computed(() => categorySeries(analytics.value?.osClicks));
const countries = computed(() => categorySeries(analytics.value?.countryClicks, 8));
const topLinks = computed(() => ({
  labels: (analytics.value?.topLinks || []).map((link) => `/${link.shortUrl}`),
  values: (analytics.value?.topLinks || []).map((link) => link.clicks)
}));

onMounted(async () => {
  try {
    const response = await api.get('/links/analytics');
    analytics.value = response.data.analytics;
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not load analytics.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="w-[calc(100vw-3rem)] max-w-6xl min-w-0">
    <h2 class="text-3xl font-bold text-heading">Analytics</h2>
    <p class="mt-2 text-body">All your links in one view.</p>
    <p v-if="loading" class="mt-6 text-body">Loading analytics…</p>
    <p v-else-if="error" class="mt-6 text-body">{{ error }}</p>

    <template v-else-if="analytics">
      <div class="mt-6 grid gap-4 sm:grid-cols-3">
        <div class="rounded-base border border-default bg-neutral-primary-soft p-4 shadow-xs">
          <p class="text-sm text-body">Total links</p>
          <p class="mt-1 text-2xl font-bold text-heading">{{ analytics.totalLinks }}</p>
        </div>
        <div class="rounded-base border border-default bg-neutral-primary-soft p-4 shadow-xs">
          <p class="text-sm text-body">Total clicks</p>
          <p class="mt-1 text-2xl font-bold text-heading">{{ analytics.totalClicks }}</p>
        </div>
        <div class="rounded-base border border-default bg-neutral-primary-soft p-4 shadow-xs">
          <p class="text-sm text-body">Active links</p>
          <p class="mt-1 text-2xl font-bold text-heading">{{ analytics.activeLinks }}</p>
        </div>
      </div>

      <div class="mt-6 flex items-center gap-3">
        <label for="allAnalyticsRange" class="text-sm font-medium text-heading">Daily chart</label>
        <select id="allAnalyticsRange" v-model="range" class="rounded-base border border-default bg-neutral-secondary-medium py-1.5 pl-2 pr-6 text-sm text-heading">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      <div class="mt-4 grid min-w-0 gap-4 lg:grid-cols-2">
        <AnalyticsChart class="lg:col-span-2" title="Clicks by day" type="line" label-title="Date (UTC)" :labels="daily.labels" :values="daily.values" />
        <AnalyticsChart class="lg:col-span-2" title="Top 10 links" type="bar" horizontal label-title="Link" :labels="topLinks.labels" :values="topLinks.values" />
        <AnalyticsChart title="Browsers" type="doughnut" :labels="browsers.labels" :values="browsers.values" />
        <AnalyticsChart title="Operating systems" type="doughnut" :labels="systems.labels" :values="systems.values" />
        <AnalyticsChart class="lg:col-span-2" title="Countries" type="bar" horizontal label-title="Country" :labels="countries.labels" :values="countries.values" />
      </div>
    </template>
  </div>
</template>

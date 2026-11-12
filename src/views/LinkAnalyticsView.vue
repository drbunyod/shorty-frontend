<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';
import AnalyticsChart from '@/components/AnalyticsChart.vue';
import { categorySeries, dailySeries } from '@/utils/analytics';
import { publicLinkLabel } from '@/utils/publicLink';

const route = useRoute();
const link = ref(null);
const loading = ref(true);
const error = ref('');
const range = ref('30');

const analytics = computed(() => link.value?.linkAnalytics?.[0] || {});
const daily = computed(() => dailySeries(analytics.value.dailyClicks, range.value));
const browsers = computed(() => categorySeries(analytics.value.browserClicks));
const systems = computed(() => categorySeries(analytics.value.osClicks));
const countries = computed(() => categorySeries(analytics.value.countryClicks, 8));
const status = computed(() => {
  if (!link.value?.active) return 'Inactive';
  if (link.value.expiresAt && new Date(link.value.expiresAt) <= new Date()) return 'Expired';
  return 'Active';
});

onMounted(async () => {
  try {
    const response = await api.get(`/links/${route.params.id}/analytics`);
    link.value = response.data.link;
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not load link analytics.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="w-[calc(100vw-3rem)] max-w-6xl min-w-0">
    <RouterLink to="/links" class="text-sm text-fg-brand hover:underline">← My Links</RouterLink>
    <h2 class="mt-3 text-3xl font-bold text-heading">Link analytics</h2>
    <p v-if="loading" class="mt-6 text-body">Loading analytics…</p>
    <p v-else-if="error" class="mt-6 text-body">{{ error }}</p>

    <template v-else-if="link">
      <p class="mt-2 break-all text-body">{{ publicLinkLabel(link.shortUrl) }}</p>
      <div class="mt-6 grid gap-4 sm:grid-cols-3">
        <div class="rounded-base border border-default bg-neutral-primary-soft p-4 shadow-xs">
          <p class="text-sm text-body">Total clicks</p>
          <p class="mt-1 text-2xl font-bold text-heading">{{ link.clicks }}</p>
        </div>
        <div class="rounded-base border border-default bg-neutral-primary-soft p-4 shadow-xs">
          <p class="text-sm text-body">Status</p>
          <p class="mt-1 text-2xl font-bold text-heading">{{ status }}</p>
        </div>
        <div class="rounded-base border border-default bg-neutral-primary-soft p-4 shadow-xs">
          <p class="text-sm text-body">Created</p>
          <p class="mt-1 text-xl font-bold text-heading">{{ new Date(link.createdAt).toLocaleDateString('en-CA') }}</p>
        </div>
      </div>

      <div class="mt-6 flex items-center gap-3">
        <label for="linkAnalyticsRange" class="text-sm font-medium text-heading">Daily chart</label>
        <select id="linkAnalyticsRange" v-model="range" class="rounded-base border border-default bg-neutral-secondary-medium py-1.5 pl-2 pr-6 text-sm text-heading">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      <div class="mt-4 grid min-w-0 gap-4 lg:grid-cols-2">
        <AnalyticsChart class="lg:col-span-2" title="Clicks by day" type="line" label-title="Date (UTC)" :labels="daily.labels" :values="daily.values" />
        <AnalyticsChart title="Browsers" type="doughnut" :labels="browsers.labels" :values="browsers.values" />
        <AnalyticsChart title="Operating systems" type="doughnut" :labels="systems.labels" :values="systems.values" />
        <AnalyticsChart class="lg:col-span-2" title="Countries" type="bar" horizontal label-title="Country" :labels="countries.labels" :values="countries.values" />
      </div>
    </template>
  </div>
</template>

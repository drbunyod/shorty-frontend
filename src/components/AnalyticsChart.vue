<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  title: { type: String, required: true },
  type: { type: String, required: true },
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
  labelTitle: { type: String, default: 'Category' },
  horizontal: { type: Boolean, default: false }
});

const canvas = ref(null);
const hasData = computed(() => props.values.some((value) => value > 0));
const colors = ['#f97316', '#0891b2', '#7c3aed', '#0f766e', '#db2777', '#ca8a04', '#2563eb', '#64748b'];
let chart;

const renderChart = async () => {
  await nextTick();
  chart?.destroy();
  chart = null;
  if (!canvas.value || !hasData.value) return;

  chart = new Chart(canvas.value, {
    type: props.type,
    data: {
      labels: props.labels,
      datasets: [{
        label: 'Clicks',
        data: props.values,
        borderColor: props.type === 'line' ? '#f97316' : 'transparent',
        backgroundColor: props.type === 'line'
          ? 'rgba(249, 115, 22, 0.12)'
          : props.values.map((_, index) => colors[index % colors.length]),
        fill: props.type === 'line',
        tension: 0.25
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: props.horizontal ? 'y' : 'x',
      plugins: { legend: { display: props.type === 'doughnut', position: 'bottom' } },
      scales: props.type === 'doughnut' ? undefined : {
        x: props.horizontal
          ? { beginAtZero: true, ticks: { precision: 0 } }
          : { ticks: { maxTicksLimit: 8 } },
        y: props.horizontal
          ? { ticks: { autoSkip: false } }
          : { beginAtZero: true, ticks: { precision: 0 } }
      }
    }
  });
};

watch(
  () => [props.type, props.horizontal, props.labels, props.values],
  renderChart,
  { deep: true }
);
onMounted(renderChart);
onUnmounted(() => chart?.destroy());
</script>

<template>
  <section class="min-w-0 rounded-base border border-default bg-neutral-primary-soft p-4 shadow-xs">
    <h3 class="mb-4 text-lg font-semibold text-heading">{{ title }}</h3>
    <div v-if="hasData" class="relative h-72 w-full min-w-0">
      <canvas ref="canvas" role="img" :aria-label="`${title} chart`"></canvas>
    </div>
    <p v-else class="flex h-40 items-center justify-center text-sm text-body">No clicks yet.</p>

    <details v-if="hasData" class="mt-4 text-sm text-body">
      <summary class="cursor-pointer text-fg-brand">View data</summary>
      <div class="mt-2 max-h-48 overflow-auto">
        <table class="w-full text-left">
          <thead><tr><th scope="col" class="py-1 pr-3">{{ labelTitle }}</th><th scope="col" class="py-1">Clicks</th></tr></thead>
          <tbody>
            <tr v-for="(label, index) in labels" :key="`${label}-${index}`" class="border-t border-default">
              <td class="py-1 pr-3">{{ label }}</td>
              <td class="py-1">{{ values[index] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </section>
</template>

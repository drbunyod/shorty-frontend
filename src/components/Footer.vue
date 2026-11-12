<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import api from '@/services/api';

const totalLinks = ref(null);

const refreshCount = async () => {
  try {
    const response = await api.get('/links/count');
    totalLinks.value = response.data.totalLinks;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  refreshCount();
  window.addEventListener('shorty:links-changed', refreshCount);
});

onUnmounted(() => window.removeEventListener('shorty:links-changed', refreshCount));
</script>

<template>
  <footer class="bg-neutral-primary-soft">
    <div class="mx-auto w-full max-w-7xl pb-4 md:pb-6">
      <hr class="mb-4 md:mb-6 border-default sm:mx-auto" />
      <div class="flex flex-col items-center gap-2 px-4 text-center sm:flex-row sm:justify-between sm:text-left lg:px-0">
        <span class="text-sm text-body" aria-live="polite">
          Links shortened: {{ totalLinks ?? '—' }}
        </span>
        <span class="text-sm text-body sm:text-right">
          © 2026 <a href="/" class="hover:underline">Shorty</a>
        </span>
      </div>
    </div>
  </footer>
</template>

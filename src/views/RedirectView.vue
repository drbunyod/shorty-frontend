<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';

const route = useRoute();
const password = ref('');
const status = ref('loading');
const message = ref('');
const submitting = ref(false);

const resolveLink = async (withPassword = false) => {
  submitting.value = true;
  message.value = '';

  try {
    const path = `/links/redirect/${encodeURIComponent(route.params.shortUrl)}`;
    const response = withPassword
      ? await api.post(path, { password: password.value })
      : await api.get(path, { params: { t: Date.now() } });
    window.location.replace(response.data.originalUrl);
  } catch (err) {
    const code = err.response?.data?.code;
    if (code === 'PASSWORD_REQUIRED' || code === 'INVALID_PASSWORD') {
      status.value = 'password';
    } else {
      status.value = 'error';
    }
    message.value = err.response?.data?.message || 'Could not open this link.';
  } finally {
    submitting.value = false;
  }
};

onMounted(() => resolveLink());
</script>

<template>
  <div class="flex w-[calc(100vw-3rem)] max-w-md flex-col items-center gap-5 text-center">
    <h2 v-if="status === 'loading'" class="text-3xl font-bold text-heading">
      Opening link…
    </h2>

    <template v-else-if="status === 'password'">
      <h2 class="text-3xl font-bold text-heading">Password required</h2>
      <p class="text-body">Enter the password to open this link.</p>
      <form
        class="w-full max-w-sm rounded-base border border-default bg-neutral-primary-soft px-6 py-6 text-left shadow-xs sm:px-8"
        @submit.prevent="resolveLink(true)"
      >
        <label for="linkPassword" class="mb-2.5 block text-sm font-medium text-heading">Password</label>
        <input
          id="linkPassword"
          v-model="password"
          type="password"
          autocomplete="off"
          required
          class="w-full rounded-base border border-default bg-neutral-secondary-medium px-2.5 py-2 text-sm text-heading focus:border-brand focus:ring-brand-soft"
        />
        <p v-if="message && message !== 'This link requires a password.'" class="mt-2 text-sm text-red-500">
          {{ message }}
        </p>
        <div class="mt-4 text-right">
          <button
            type="submit"
            :disabled="submitting"
            class="rounded-base border border-transparent bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-strong focus:outline-none focus:ring-1 focus:ring-brand-soft disabled:opacity-50"
          >
            {{ submitting ? 'Opening…' : 'Open link' }}
          </button>
        </div>
      </form>
    </template>

    <template v-else>
      <h2 class="text-3xl font-bold text-heading">Link unavailable</h2>
      <p class="text-body">{{ message }}</p>
      <RouterLink to="/" class="text-fg-brand hover:underline">Go to home page</RouterLink>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import api from '@/services/api';
import ShortLinkResult from '@/components/ShortLinkResult.vue';
import AdvancedLinkOptions from '@/components/AdvancedLinkOptions.vue';
import { publicLinkUrl } from '@/utils/publicLink';

const auth = useAuthStore();
const { isAuthenticated } = storeToRefs(auth);

const showAdvancedOptions = ref(false);
const showShortUrl = ref(false);

const originalUrl = ref('');
const customShortUrl = ref('');
const password = ref('');
const expiresIn = ref('');
const errors = ref({});

const shortUrl = ref('');
const qrCode = ref('');

const handleSubmit = async () => {
  try {
    const response = await api.post('/links', {
      originalUrl: originalUrl.value,
      customShortUrl: customShortUrl.value,
      password: password.value,
      expiresIn: expiresIn.value ?? null
    });
    const link = response.data.link;

    originalUrl.value = '';
    customShortUrl.value = '';
    password.value = '';
    expiresIn.value = '';
    errors.value = {};
    shortUrl.value = publicLinkUrl(link.shortUrl);
    qrCode.value = link.qrCode;
    showShortUrl.value = true;
    window.dispatchEvent(new Event('shorty:links-changed'));
  } catch (err) {
    errors.value = err.response?.data?.errors || {};
    console.error(err);
  }
};
</script>

<template>
  <div class="flex flex-col items-center gap-6 md:gap-8 lg:gap-10">
    <h2 class="text-4xl font-bold tracking-tight text-heading lg:text-5xl">
      Paste your link
    </h2>

    <form
      @submit.prevent="handleSubmit"
      class="flex flex-col w-full items-center gap-4 px-4"
    >
      <div>
        <ul>
          <li
            v-for="error in errors"
            :key="error.path"
            class="text-sm text-red-500 list-disc list-inside"
          >
            {{ error.msg }}
          </li>
        </ul>
      </div>

      <input
        v-model="originalUrl"
        type="text"
        class="bg-neutral-secondary-medium border border-brand text-heading text-sm rounded-base focus:ring-brand-soft w-full md:w-8/9 lg:w-6/9 px-3 py-2.5 shadow-xs placeholder:text-body"
        placeholder="https://example.com"
        required
      />

      <button
        @click="showAdvancedOptions = !showAdvancedOptions"
        class="flex items-center text-sm text-brand cursor-pointer"
        type="button"
      >
        Advanced options
        <svg
          v-if="!showAdvancedOptions"
          class="w-4 h-4 ms-1.5 -me-0.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 9-7 7-7-7"
          />
        </svg>
        <svg
          v-else
          class="w-4 h-4 ms-1.5 -me-0.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m9 5 7 7-7 7"
          />
        </svg>
      </button>

      <AdvancedLinkOptions
        v-show="showAdvancedOptions"
        v-model:custom-short-url="customShortUrl"
        v-model:password="password"
        v-model:expires-in="expiresIn"
      />

      <button
        class="text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-1 focus:ring-brand-soft font-medium leading-5 rounded-base text-sm px-4 py-2 focus:outline-none cursor-pointer"
        type="submit"
      >
        Shorten
      </button>
    </form>

    <ShortLinkResult v-if="showShortUrl" :short-url="shortUrl" :qr-code="qrCode" />

    <p
      :class="{ invisible: isAuthenticated }"
      class="font-normal text-body text-center text-sm sm:px-16 xl:px-48"
    >
      <RouterLink to="/login" class="text-fg-brand">Login</RouterLink> or
      <RouterLink to="/register" class="text-fg-brand">register</RouterLink> to
      manage your links and see link analytics.
    </p>
  </div>
</template>

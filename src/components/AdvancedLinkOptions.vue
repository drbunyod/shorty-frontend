<script setup>
import { ref } from 'vue';
import { publicLinkPrefix } from '@/utils/publicLink';

const customShortUrl = defineModel('customShortUrl', { type: String, default: '' });
const password = defineModel('password', { type: String, default: '' });
const expiresIn = defineModel('expiresIn', { type: String, default: '' });
const showPassword = ref(false);
</script>

<template>
  <div class="flex flex-col gap-3">
    <div>
      <label
        for="customShortUrl"
        class="mb-2.5 text-sm font-medium text-heading"
        >Custom URL
      </label>
      <div class="flex shadow-xs">
        <span
          class="inline-flex items-center px-3 text-sm text-body bg-neutral-tertiary border border-default-medium border-e-0"
        >
            {{ publicLinkPrefix() }}
        </span>
        <input
          v-model="customShortUrl"
          type="text"
          id="customShortUrl"
          class="bg-neutral-secondary-medium border border-default text-heading text-sm rounded-base focus:ring-brand-soft focus:border-brand w-full px-2.5 py-2 placeholder:text-body"
        />
      </div>
    </div>
    <div>
      <label for="password" class="mb-2.5 text-sm font-medium text-heading"
        >Password
      </label>
      <div class="flex shadow-xs">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          id="password"
          class="bg-neutral-secondary-medium border border-default text-heading text-sm rounded-base focus:ring-brand-soft focus:border-brand w-full px-2.5 py-2 placeholder:text-body"
        />
        <span
          @click="showPassword = !showPassword"
          class="inline-flex items-center px-3 text-sm text-body bg-neutral-tertiary border border-default-medium border-s-0 hover:bg-gray-200 cursor-pointer"
        >
          <svg
            v-if="!showPassword"
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-width="2"
              d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
            />
            <path
              stroke="currentColor"
              stroke-width="2"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5"
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
              d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </span>
      </div>
    </div>
    <div>
      <label for="expiresIn" class="mb-2.5 text-sm font-medium text-heading"
        >Expires In
      </label>
      <select
        v-model="expiresIn"
        id="expiresIn"
        class="block w-full px-2.5 py-2 bg-neutral-secondary-medium border border-default text-heading text-sm rounded-base focus:ring-brand-soft focus:border-brand shadow-xs placeholder:text-body"
      >
        <option value=""></option>
        <option value="600">10 minutes</option>
        <option value="3600">60 minutes</option>
        <option value="86400">1 day</option>
        <option value="604800">7 days</option>
        <option value="18144000">30 days</option>
      </select>
    </div>
  </div>
</template>

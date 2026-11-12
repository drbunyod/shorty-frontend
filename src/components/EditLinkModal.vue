<script setup>
import { ref } from 'vue';
import api from '@/services/api';
import { publicLinkPrefix } from '@/utils/publicLink';

const props = defineProps({
  link: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'saved']);

const showModalPassword = ref(false);
const modalLink = ref({ ...props.link, password: props.link.password ?? '' });
const expiration = ref(props.link.expiresAt ? 'keep' : 'never');
const errors = ref([]);
const saving = ref(false);

const handleEdit = async () => {
  const payload = { active: modalLink.value.active };
  const shortUrl = modalLink.value.shortUrl.trim();
  if (shortUrl !== props.link.shortUrl) payload.customShortUrl = shortUrl;

  const password = modalLink.value.password.trim();
  if (password !== (props.link.password ?? '')) {
    payload.password = password || null;
  }

  if (expiration.value !== 'keep') {
    payload.expiresIn = expiration.value === 'never'
      ? null
      : Number(expiration.value);
  }

  saving.value = true;
  errors.value = [];
  try {
    const response = await api.put(`/links/${props.link.id}`, payload);
    emit('saved', response.data.link);
  } catch (err) {
    errors.value = err.response?.data?.errors?.map((error) => error.msg) || [
      err.response?.data?.message || 'Could not save this link. Please try again.'
    ];
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div
    class="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center w-full md:inset-0 h-full max-h-full"
    tabindex="-1"
  >
    <div
      @click="$emit('close')"
      class="fixed inset-0 bg-black/25 backdrop-blur-sm -z-10"
    ></div>
    <div
      @click.self="$emit('close')"
      class="relative p-4 w-full max-w-md max-h-full"
    >
      <div
        class="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6"
      >
        <div
          class="flex items-center justify-between border-b border-default pb-4 md:pb-5"
        >
          <h3 class="text-lg font-medium text-heading">Edit Link</h3>
          <button
            @click="$emit('close')"
            type="button"
            class="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center cursor-pointer"
          >
            <svg
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
                d="M6 18 17.94 6M18 18 6.06 6"
              />
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleEdit">
          <ul v-if="errors.length" class="mt-4 text-sm text-red-500 list-disc list-inside">
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
          </ul>
          <div class="grid gap-4 grid-cols-2 py-4 md:py-6">
            <div class="col-span-2">
              <label
                for="shortUrl"
                class="block mb-2.5 text-sm font-medium text-heading"
                >Short URL</label
              >
              <div class="flex">
                <span
                  class="inline-flex items-center px-3 text-sm text-body bg-neutral-tertiary border border-default-medium border-e-0"
                >
                  {{ publicLinkPrefix() }}
                </span>
                <input
                  v-model="modalLink.shortUrl"
                  type="text"
                  id="shortUrl"
                  class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body"
                  required
                />
              </div>
            </div>
            <div class="col-span-2">
              <label
                for="originalUrl"
                class="block mb-2.5 text-sm font-medium text-heading"
                >Original URL</label
              >
              <input
                v-model="modalLink.originalUrl"
                type="text"
                id="originalUrl"
                class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body"
                disabled
              />
            </div>
            <div class="col-span-2 sm:col-span-1">
              <label
                for="password"
                class="block mb-2.5 text-sm font-medium text-heading"
                >Password</label
              >
              <div class="flex">
                <input
                  v-model="modalLink.password"
                  :type="showModalPassword ? 'text' : 'password'"
                  id="password"
                  class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body"
                />
                <span
                  @click="showModalPassword = !showModalPassword"
                  class="inline-flex items-center px-3 text-sm text-body bg-neutral-tertiary border border-s-0 border-default-medium hover:bg-gray-200 cursor-pointer shadow-xs"
                >
                  <svg
                    v-if="!showModalPassword"
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
            <div class="col-span-2 sm:col-span-1">
              <label
                for="expiresIn"
                class="block mb-2.5 text-sm font-medium text-heading"
                >Expires In</label
              >
              <select
                v-model="expiration"
                id="expiresIn"
                class="block w-full px-2.5 py-2 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
              >
                <option value="never">Never</option>
                <option
                  v-if="link.expiresAt"
                  class="font-bold"
                  value="keep"
                >
                  {{
                    new Date(link.expiresAt).toLocaleString('en-CA', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })
                  }}
                </option>
                <option value="600">10 minutes</option>
                <option value="3600">60 minutes</option>
                <option value="86400">1 day</option>
                <option value="604800">7 days</option>
                <option value="18144000">30 days</option>
              </select>
            </div>
            <div class="col-span-2 flex mt-2">
              <input
                v-model="modalLink.active"
                type="checkbox"
                id="isActive"
              />
              <label
                for="isActive"
                class="ml-2 text-sm font-medium text-heading"
                >Active</label
              >
            </div>
          </div>
          <div
            class="flex items-center justify-end space-x-4 border-t border-default pt-4 md:pt-6"
          >
            <button
              type="submit"
              :disabled="saving"
              class="inline-flex items-center text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-5.5 py-2 focus:outline-none cursor-pointer"
            >
              {{ saving ? 'Saving…' : 'Save' }}
            </button>
            <button
              @click="$emit('close')"
              type="button"
              class="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2 focus:outline-none cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

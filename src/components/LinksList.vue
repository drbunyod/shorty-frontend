<script setup>
import LinkActions from '@/components/LinkActions.vue';
import { publicLinkLabel, publicLinkUrl } from '@/utils/publicLink';


defineProps({
  links: {
    type: Array,
    required: true
  }
});

defineEmits(['edit', 'delete']);
</script>

<template>
  <div v-for="link in links" :key="link.id">
    <div
      class="flex flex-col w-full lg:w-xl my-3.5 px-2 py-3 bg-neutral-primary-soft text-body border border-default rounded-base shadow-xs"
    >
      <div class="grid grid-cols-[72px_1fr] lg:grid-cols-[96px_1fr]">
        <div class="flex flex-col items-center">
          <img :src="link.qrCode" class="w-18 lg:w-24" alt="QR Code" />
        </div>

        <div class="grid py-1 pl-1 pr-2.5 gap-4">
          <div>
            <div class="flex justify-between">
              <p>
                <a
                  :href="publicLinkUrl(link.shortUrl)"
                  class="text-black hover:text-brand hover:underline"
                  target="_blank"
                  >{{ publicLinkLabel(link.shortUrl) }}</a
                >
              </p>
              <p>
                <span
                  v-if="!link.active"
                  class="bg-danger-soft text-fg-danger-strong text-xs font-medium px-1.5 py-0.5 rounded"
                  >Inactive</span
                >
                <span
                  v-else-if="
                    link.expiresAt && new Date(link.expiresAt) < new Date()
                  "
                  class="bg-warning-soft text-fg-warning text-xs font-medium px-1.5 py-0.5 rounded"
                  >Expired</span
                >
                <span
                  v-else-if="link.active"
                  class="bg-success-soft text-fg-success-strong text-xs font-medium px-1.5 py-0.5 rounded"
                  >Active</span
                >
              </p>
            </div>
            <p class="text-sm">{{ link.originalUrl }}</p>
          </div>
          <div
            class="grid grid-cols-2 md:grid-cols-4 text-center gap-2 md:gap-0"
          >
            <div>
              <p class="text-sm">Clicks</p>
              <p>{{ link.clicks }}</p>
            </div>
            <div class="border-s border-s-default">
              <p class="text-sm">Password</p>
              <p v-if="link.password" class="hover:underline cursor-pointer">
                ***
              </p>
              <p v-else>-</p>
            </div>
            <div class="md:border-s md:border-s-default">
              <p class="text-sm">Expires</p>
              <p>
                {{
                  link.expiresAt
                    ? new Date(link.expiresAt).toLocaleString('en-CA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })
                    : '-'
                }}
              </p>
            </div>
            <div class="border-s border-s-default">
              <p class="text-sm">Created</p>
              <p>
                {{
                  link.createdAt
                    ? new Date(link.createdAt).toLocaleString('en-CA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })
                    : ''
                }}
              </p>
            </div>
          </div>
          <div class="flex justify-end mt-2.5 md:mt-0">
            <LinkActions :link="link" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

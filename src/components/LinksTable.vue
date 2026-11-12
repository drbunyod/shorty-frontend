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
  <div class="max-w-full overflow-x-auto rounded-base border border-default bg-neutral-primary-soft shadow-xs">
    <table class="w-full min-w-[960px] text-left text-sm text-body">
      <thead class="bg-neutral-secondary-medium text-heading">
        <tr>
          <th scope="col" class="px-3 py-3 font-medium">QR</th>
          <th scope="col" class="px-3 py-3 font-medium">Short URL</th>
          <th scope="col" class="px-3 py-3 font-medium">Original URL</th>
          <th scope="col" class="px-3 py-3 font-medium">Status</th>
          <th scope="col" class="px-3 py-3 font-medium">Clicks</th>
          <th scope="col" class="px-3 py-3 font-medium">Password</th>
          <th scope="col" class="px-3 py-3 font-medium">Expires</th>
          <th scope="col" class="px-3 py-3 font-medium">Created</th>
          <th scope="col" class="px-3 py-3 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="link in links" :key="link.id" class="border-t border-default hover:bg-neutral-secondary-medium">
          <td class="px-3 py-2">
            <img
              :src="link.qrCode"
              width="48"
              height="48"
              class="block size-12 min-w-12 max-w-none object-contain"
              :alt="`QR code for ${link.shortUrl}`"
            />
          </td>
          <td class="px-3 py-2 whitespace-nowrap">
            <a
              :href="publicLinkUrl(link.shortUrl)"
              target="_blank"
              rel="noopener noreferrer"
              class="text-heading hover:text-brand hover:underline"
            >{{ publicLinkLabel(link.shortUrl) }}</a>
          </td>
          <td class="max-w-64 truncate px-3 py-2" :title="link.originalUrl">
            {{ link.originalUrl }}
          </td>
          <td class="px-3 py-2">
            <span v-if="!link.active" class="rounded bg-danger-soft px-1.5 py-0.5 text-xs text-fg-danger-strong">Inactive</span>
            <span v-else-if="link.expiresAt && new Date(link.expiresAt) < new Date()" class="rounded bg-warning-soft px-1.5 py-0.5 text-xs text-fg-warning">Expired</span>
            <span v-else class="rounded bg-success-soft px-1.5 py-0.5 text-xs text-fg-success-strong">Active</span>
          </td>
          <td class="px-3 py-2">{{ link.clicks }}</td>
          <td class="px-3 py-2">{{ link.password ? '***' : '-' }}</td>
          <td class="px-3 py-2 whitespace-nowrap">
            {{ link.expiresAt ? new Date(link.expiresAt).toLocaleDateString('en-CA') : '-' }}
          </td>
          <td class="px-3 py-2 whitespace-nowrap">
            {{ link.createdAt ? new Date(link.createdAt).toLocaleDateString('en-CA') : '-' }}
          </td>
          <td class="px-3 py-2">
            <LinkActions :link="link" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

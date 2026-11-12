<script setup>
const props = defineProps({
  shortUrl: { type: String, required: true },
  qrCode: { type: String, required: true }
});

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.shortUrl);
  } catch (err) {
    console.error('Failed to copy link: ', err);
  }
};
</script>

<template>
  <div class="flex flex-col items-center w-7/10 md:w-1/2 lg:w-3/10 gap-5">
    <div class="flex">
      <input
        :value="shortUrl"
        type="text"
        class="bg-neutral-secondary-medium border border-default text-heading text-sm border-e-0 rounded-base focus:ring-brand-soft w-full px-2.5 py-2 shadow-xs"
        readonly
      />
      <span
        @click="copyToClipboard"
        class="inline-flex items-center px-2.5 text-sm text-white bg-brand border border-brand border-s-0 hover:bg-brand-strong hover:border-brand-strong shadow-xs cursor-pointer"
        ><svg
          class="w-6 h-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14 4v3a1 1 0 0 1-1 1h-3m4 10v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2m11-3v10a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V7.87a1 1 0 0 1 .24-.65l2.46-2.87a1 1 0 0 1 .76-.35H18a1 1 0 0 1 1 1Z"
          />
        </svg>
      </span>
    </div>

    <div class="border-2 border-default">
      <img :src="qrCode" class="w-24" alt="QR code" />
    </div>
  </div>
</template>

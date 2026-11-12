<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const username = ref('');
const password = ref('');
const errors = ref('');

const handleSubmit = async () => {
  try {
    await auth.login({
      username: username.value,
      password: password.value
    });

    router.push('/');
  } catch (err) {
    errors.value = err.response?.data?.message;
    console.error(err);
  }
};
</script>

<template>
  <div class="flex flex-col items-center gap-5">
    <h3 class="text-3xl font-bold tracking-tight text-heading lg:text-3xl">
      Login
    </h3>

    <form
      @submit.prevent="handleSubmit"
      class="flex flex-col w-full items-center gap-5 px-4"
    >
      <div class="flex flex-col gap-3">
        <div>
          <ul v-if="errors">
            <li class="text-xs text-red-500 list-disc list-inside">
              {{ errors }}
            </li>
          </ul>
        </div>
        <div>
          <label for="username" class="mb-2.5 text-sm font-medium text-heading"
            >Username
          </label>
          <input
            v-model="username"
            type="text"
            id="username"
            class="bg-neutral-secondary-medium border border-default text-heading text-sm rounded-base focus:ring-brand-soft focus:border-brand w-full px-2.5 py-2 placeholder:text-body"
            required
          />
        </div>
        <div>
          <label for="password" class="mb-2.5 text-sm font-medium text-heading"
            >Password
          </label>
          <input
            v-model="password"
            id="password"
            type="password"
            class="bg-neutral-secondary-medium border border-default text-heading text-sm rounded-base focus:ring-brand-soft focus:border-brand w-full px-2.5 py-2 placeholder:text-body"
            required
          />
        </div>
      </div>

      <button
        class="text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-1 focus:ring-brand-soft font-medium leading-5 rounded-base text-sm px-5 py-2 mt-2 focus:outline-none cursor-pointer"
        type="submit"
      >
        Login
      </button>
    </form>

    <p class="font-normal text-body text-center text-sm sm:px-16 xl:px-48">
      Don't have an account yet?<br />Click here to
      <RouterLink to="/register" class="text-fg-brand">register</RouterLink>.
    </p>
  </div>
</template>

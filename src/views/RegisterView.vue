<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const errors = ref({});

const handleSubmit = async () => {
  try {
    await auth.register({
      username: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value
    });

    router.push('/');
  } catch (err) {
    errors.value = err.response?.data?.errors || {};
    console.error(err);
  }
};
</script>

<template>
  <div class="flex flex-col items-center gap-5">
    <h3 class="text-3xl font-bold tracking-tight text-heading lg:text-3xl">
      Register
    </h3>

    <form
      @submit.prevent="handleSubmit"
      class="flex flex-col w-full items-center gap-5 px-4"
    >
      <div class="flex flex-col gap-3">
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
            type="password"
            id="password"
            class="bg-neutral-secondary-medium border border-default text-heading text-sm rounded-base focus:ring-brand-soft focus:border-brand w-full px-2.5 py-2 placeholder:text-body"
            required
          />
        </div>
        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-heading"
            >Confirm Password
          </label>
          <input
            v-model="confirmPassword"
            type="password"
            id="confirmPassword"
            class="bg-neutral-secondary-medium border border-default text-heading text-sm rounded-base focus:ring-brand-soft focus:border-brand w-full px-2.5 py-2 placeholder:text-body"
            required
          />
        </div>
      </div>

      <button
        class="text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-1 focus:ring-brand-soft font-medium leading-5 rounded-base text-sm px-5 py-2 mt-2 focus:outline-none cursor-pointer"
        type="submit"
      >
        Register
      </button>
    </form>

    <p class="font-normal text-body text-center text-sm sm:px-16 xl:px-48">
      Already have an account?<br />Click here to
      <RouterLink to="/login" class="text-fg-brand">login</RouterLink>.
    </p>
  </div>
</template>

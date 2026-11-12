<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ChangePasswordForm from '@/components/ChangePasswordForm.vue';

const auth = useAuthStore();

const username = ref(auth.user.username);
const profileErrors = ref({});
const showProfileSaved = ref(false);

const handleProfileUpdate = async () => {
  try {
    await auth.updateUser({
      username: username.value
    });
    profileErrors.value = {};
    showProfileSaved.value = true;
    setTimeout(() => {
      showProfileSaved.value = false;
    }, 1000);
  } catch (err) {
    profileErrors.value = err.response?.data?.errors || {};
    console.error(err);
  }
};
</script>

<template>
  <div class="flex flex-col gap-5">
    <h3 class="text-3xl font-bold tracking-tight text-heading lg:text-3xl">
      Account Settings
    </h3>

    <div
      class="w-full max-w-sm bg-neutral-primary-soft py-6 px-8 border border-default rounded-base shadow-xs"
    >
      <form @submit.prevent="handleProfileUpdate">
        <h5 class="text-xl font-semibold text-heading mb-3">Update Profile</h5>
        <div>
          <ul>
            <li
              v-for="error in profileErrors"
              :key="error.path"
              class="text-sm text-red-500 list-disc list-inside"
            >
              {{ error.msg }}
            </li>
          </ul>
        </div>
        <div>
          <label for="username" class="my-2.5 text-sm font-medium text-heading"
            >Username
          </label>
          <input
            v-model="username"
            type="text"
            id="username"
            class="mb-2.5 bg-neutral-secondary-medium border border-default text-heading text-sm rounded-base focus:ring-brand-soft focus:border-brand w-full px-2.5 py-2 placeholder:text-body"
            required
          />
        </div>
        <div class="text-right">
          <span v-if="showProfileSaved" class="text-sm text-brand mr-3"
            >Saved!</span
          >
          <button
            class="text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-1 focus:ring-brand-soft font-medium leading-5 rounded-base text-sm px-5 py-2 mt-2 focus:outline-none cursor-pointer"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>

    <ChangePasswordForm />
  </div>
</template>

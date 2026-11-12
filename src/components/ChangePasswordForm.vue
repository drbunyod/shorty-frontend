<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const oldPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const passwordErrors = ref({});
const showPasswordSaved = ref(false);

const handlePasswordUpdate = async () => {
  try {
    await auth.updateUserPassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
      confirmNewPassword: confirmNewPassword.value
    });

    oldPassword.value = '';
    newPassword.value = '';
    confirmNewPassword.value = '';
    passwordErrors.value = {};
    showPasswordSaved.value = true;
    setTimeout(() => {
      showPasswordSaved.value = false;
    }, 1000);
  } catch (err) {
    passwordErrors.value = err.response?.data?.errors || {};
    console.error(err);
  }
};
</script>

<template>
  <div class="w-full max-w-sm bg-neutral-primary-soft py-6 px-8 border border-default rounded-base shadow-xs">
    <form @submit.prevent="handlePasswordUpdate">
      <h5 class="text-xl font-semibold text-heading mb-3">Change Password</h5>
      <div>
        <ul>
          <li
            v-for="error in passwordErrors"
            :key="error.path"
            class="text-sm text-red-500 list-disc list-inside"
          >
            {{ error.msg }}
          </li>
        </ul>
      </div>
      <div>
        <label
          for="oldPassword"
          class="my-2.5 text-sm font-medium text-heading"
          >Old Password
        </label>
        <input
          v-model="oldPassword"
          type="password"
          id="oldPassword"
          class="mb-2.5 bg-neutral-secondary-medium border border-default text-heading text-sm rounded-base focus:ring-brand-soft focus:border-brand w-full px-2.5 py-2 placeholder:text-body"
          required
        />
      </div>
      <div>
        <label
          for="newPassword"
          class="mb-2.5 text-sm font-medium text-heading"
          >New Password
        </label>
        <input
          v-model="newPassword"
          type="password"
          id="newPassword"
          class="mb-2.5 bg-neutral-secondary-medium border border-default text-heading text-sm rounded-base focus:ring-brand-soft focus:border-brand w-full px-2.5 py-2 placeholder:text-body"
          required
        />
      </div>
      <div>
        <label
          for="confirmNewPassword"
          class="block text-sm font-medium text-heading"
          >Confirm New Password
        </label>
        <input
          v-model="confirmNewPassword"
          type="password"
          id="confirmNewPassword"
          class="mb-2.5 bg-neutral-secondary-medium border border-default text-heading text-sm rounded-base focus:ring-brand-soft focus:border-brand w-full px-2.5 py-2 placeholder:text-body"
          required
        />
      </div>
      <div class="text-right">
        <span v-if="showPasswordSaved" class="text-sm text-brand mr-3"
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
</template>

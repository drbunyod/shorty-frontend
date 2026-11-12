<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const showUserMenu = ref(false);
const showMobileMenu = ref(false);
const userMenuRef = ref(null);
const logoutError = ref('');

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const { user, isAuthenticated } = storeToRefs(auth);

const handleLogout = async () => {
  if (!confirm('Are you sure you want to log out?')) return;

  logoutError.value = '';
  try {
    await auth.logout();
    await router.push('/login');
  } catch {
    logoutError.value = 'Could not log out. Please try again.';
  }
};

watch(
  () => route.path,
  () => {
    showUserMenu.value = false;
    showMobileMenu.value = false;
  }
);

const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <nav class="bg-neutral-primary border-b border-default">
    <div
      class="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4"
    >
      <RouterLink
        to="/"
        class="flex items-center space-x-3 rtl:space-x-reverse"
      >
        <img src="@/assets/logo.png" class="h-7" alt="Shorty Logo" />
      </RouterLink>
      <div
        class="inline-flex relative md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
      >
        <div
          v-if="isAuthenticated"
          @click.stop="showUserMenu = !showUserMenu"
          class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-neutral-tertiary rounded-full cursor-pointer"
        >
          <button class="font-medium text-body cursor-pointer" type="button">
            {{ user ? user.username.charAt(0) : '' }}
          </button>
        </div>
        <div
          v-if="isAuthenticated"
          ref="userMenuRef"
          :class="{ hidden: !showUserMenu }"
          class="absolute z-50 top-full right-0 mt-1.5 bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-40"
        >
          <div class="px-4 py-3 text-sm border-b border-default">
            <span class="block break-all text-heading font-medium">{{
              user ? `@${user.username}` : 'Not logged in'
            }}</span>
          </div>
          <ul class="p-2 text-sm text-body font-medium">
            <li>
              <RouterLink
                to="/account"
                class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                >Settings</RouterLink
              >
            </li>
            <li>
              <button
                @click="handleLogout"
                class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded cursor-pointer"
                type="button"
              >
                Logout
              </button>
            </li>
          </ul>
          <p v-if="logoutError" role="alert" class="px-4 pb-3 text-xs text-red-500">{{ logoutError }}</p>
        </div>
        <RouterLink
          v-if="!isAuthenticated"
          to="/login"
          class="text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium font-medium leading-5 rounded-base text-sm px-5 py-2 focus:outline-none"
        >
          Login
        </RouterLink>
        <button
          @click="showMobileMenu = !showMobileMenu"
          type="button"
          class="inline-flex items-center p-2 w-9 h-9 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
          aria-controls="navbar-cta"
          :aria-expanded="showMobileMenu"
        >
          <span class="sr-only">Menu</span>
          <svg
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
              stroke-linecap="round"
              stroke-width="2"
              d="M5 7h14M5 12h14M5 17h14"
            />
          </svg>
        </button>
      </div>
      <div
        :class="{ hidden: !showMobileMenu }"
        class="items-center justify-between w-full md:flex md:w-auto md:order-1"
        id="navbar-cta"
      >
        <ul
          class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary"
        >
          <li>
            <RouterLink
              to="/"
              class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
              >Home</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/links"
              class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
              >Links</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/analytics"
              class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
              >Analytics</RouterLink
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style>
#navbar-cta .router-link-active {
  color: var(--color-orange-500);
}
</style>

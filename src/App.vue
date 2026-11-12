<script setup>
import { RouterView } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <Navbar />
  <div class="flex flex-1 mx-auto max-w-7xl p-6 lg:p-8">
    <RouterView />
  </div>
  <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import api from '@/services/api';
import EditLinkModal from '@/components/EditLinkModal.vue';
import LinksList from '@/components/LinksList.vue';
import LinksTable from '@/components/LinksTable.vue';

const auth = useAuthStore();
const { isAuthenticated } = storeToRefs(auth);

const links = ref([]);
const view = ref('list');

const showModal = ref(false);
const modalLink = ref(null);

const openModal = (link) => {
  modalLink.value = link;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  modalLink.value = null;
};

const handleLinkSaved = (updatedLink) => {
  links.value = links.value.map((link) =>
    link.id === updatedLink.id ? updatedLink : link
  );
  closeModal();
};

const deleteLink = async (link) => {
  const confirm = window.confirm('Delete this link?');
  if (!confirm) return;

  try {
    await api.delete(`/links/${link.id}`);
    links.value = links.value.filter((l) => l.id !== link.id);
    window.dispatchEvent(new Event('shorty:links-changed'));
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  if (!isAuthenticated.value) return;

  try {
    const response = await api.get('/links');
    links.value = response.data.links;
  } catch (err) {
    console.error(err);
  }
});
</script>

<template>
  <div
    v-if="isAuthenticated"
    :class="view === 'table' ? 'w-[calc(100vw-3rem)] max-w-7xl min-w-0' : 'w-xs md:w-lg lg:w-xl'"
  >
    <div class="flex items-center mb-5 gap-2">
      <h3 class="text-3xl font-bold tracking-tight text-heading">My Links</h3>
      <span
        class="inline-flex items-center px-3 py-1 ring-1 ring-inset ring-brand-subtle text-fg-brand-strong text-sm rounded-2xl bg-brand-softer"
        >{{ links.length }}</span
      >
    </div>

    <div class="mb-5 flex gap-4" role="group" aria-label="Links view">
      <label class="inline-flex items-center gap-2 text-sm text-heading cursor-pointer">
        <input v-model="view" type="radio" name="links-view" value="list" class="accent-orange-500" />
        List View
      </label>
      <label class="inline-flex items-center gap-2 text-sm text-heading cursor-pointer">
        <input v-model="view" type="radio" name="links-view" value="table" class="accent-orange-500" />
        Table View
      </label>
    </div>

    <p v-if="!links.length" class="text-sm text-body">No links yet.</p>

    <LinksList v-if="view === 'list'" :links="links" @edit="openModal" @delete="deleteLink" />

    <EditLinkModal
      v-if="showModal"
      :link="modalLink"
      @close="closeModal"
      @saved="handleLinkSaved"
    />

    <LinksTable v-if="view === 'table'" :links="links" @edit="openModal" @delete="deleteLink" />
  </div>

  <div v-else>
    <p class="font-normal text-body text-center">
      <RouterLink to="/login" class="text-fg-brand">Login</RouterLink> or
      <RouterLink to="/register" class="text-fg-brand">register</RouterLink> to
      manage your links and see link analytics.
    </p>
  </div>
</template>

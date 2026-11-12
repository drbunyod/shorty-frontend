import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    async login(credentials) {
      const res = await api.post('/auth/login', credentials);
      this.user = res.data.user;
    },

    async register(data) {
      const res = await api.post('/auth/register', data);
      this.user = res.data.user;
    },

    async logout() {
      await api.post('/auth/logout');
      this.user = null;
    },

    async fetchUser() {
      try {
        const res = await api.get('/auth/me');
        this.user = res.data.user;
      } catch {
        this.user = null;
      }
    },

    async updateUser(data) {
      const res = await api.put(`/auth/users/${this.user.id}`, data);
      this.user = res.data.user;
    },

    async updateUserPassword(data) {
      await api.put(`/auth/users/${this.user.id}/password`, data);
    }
  }
});

import { defineStore } from 'pinia';
import api from '../api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
  }),
  actions: {
    async login(email, password) {
      const { data } = await api.post('/auth/login', { email, password });
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('token', data.token);
    },
    async register(email, password) {
      const { data } = await api.post('/auth/register', { email, password });
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('token', data.token);
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
  },
});

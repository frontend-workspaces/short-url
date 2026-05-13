import { defineStore } from 'pinia';
import api from '../api';

const buildPermissions = (roles = []) => {
  const perms = {};
  for (const role of roles) {
    for (const [menu, actions] of Object.entries(role.permissions || {})) {
      if (!perms[menu]) perms[menu] = { view: false, edit: false, delete: false };
      for (const [action, val] of Object.entries(actions)) {
        if (val) perms[menu][action] = true;
      }
    }
  }
  return perms;
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
    permissions: null,
    apiKeyId: null,
    apiKey: null,
    apiKeyStatus: null,
    apiKeyExpiresAt: null,
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
    async fetchMe() {
      const { data } = await api.get('/auth/me');
      this.user = data.user;
      this.permissions = buildPermissions(data.user?.roles || []);
    },
    async updateProfile(fullName) {
      const { data } = await api.put('/auth/profile', { fullName });
      this.user = data.user;
      return data.user;
    },
    async changePassword(currentPassword, newPassword) {
      await api.put('/auth/change-password', { currentPassword, newPassword });
    },
    async fetchApiKey() {
      const { data } = await api.get('/auth/api-key');
      this.apiKeyId = data.keyId || null;
      this.apiKey = data.apiKey || null;
      this.apiKeyStatus = data.apiKeyStatus || null;
      this.apiKeyExpiresAt = data.apiKeyExpiresAt || null;
    },
    async regenerateApiKey() {
      const { data } = await api.post('/auth/api-key/regenerate');
      this.apiKeyId = data.keyId;
      this.apiKey = data.apiKey;
      this.apiKeyStatus = data.apiKeyStatus;
      this.apiKeyExpiresAt = data.apiKeyExpiresAt;
    },
    logout() {
      this.token = null;
      this.user = null;
      this.permissions = null;
      this.apiKeyId = null;
      this.apiKey = null;
      this.apiKeyStatus = null;
      this.apiKeyExpiresAt = null;
      localStorage.removeItem('token');
    },
  },
});

import { defineStore } from 'pinia';
import { supabase } from '../supabase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    role: null,
    isAuthenticated: false,
  }),
  actions: {
    async login(username, password) {
      const { data, error } = await supabase
        .from('utilisateur')
        .select('*, appartenir (groupe (role))')
        .eq('pseudo', username)
        .single();

      if (error || !data) {
        throw new Error('Nom d’utilisateur ou mot de passe incorrect');
      }

      this.user = username;
      this.role = data.appartenir?.[0]?.groupe?.role || null;
      this.isAuthenticated = true;

      if (!this.role) {
        throw new Error("Impossible de déterminer le rôle de l'utilisateur.");
      }

      // Sauvegarder la session
      localStorage.setItem(
        'session',
        JSON.stringify({ username: this.user, role: this.role })
      );
    },

    logout() {
      this.user = null;
      this.role = null;
      this.isAuthenticated = false;
      localStorage.removeItem('session');
    },

    loadSession() {
      const storedSession = localStorage.getItem('session');
      if (storedSession) {
        const sessionData = JSON.parse(storedSession);
        this.user = sessionData.username;
        this.role = sessionData.role;
        this.isAuthenticated = true;
      }
    },
  },
});

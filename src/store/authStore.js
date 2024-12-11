import { defineStore } from 'pinia';
import { supabase } from '../supabase';
import router from '../router'; // Import the router

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    role: null,
    isAuthenticated: false,
    inactivityTimer: null,
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

      // Démarrer le timer d'inactivité
      this.startInactivityTimer();

      this.redirectBasedOnRole();
    },

    logout() {
      this.user = null;
      this.role = null;
      this.isAuthenticated = false;
      localStorage.removeItem('session');
      this.clearInactivityTimer();
    },

    loadSession() {
      const storedSession = localStorage.getItem('session');
      if (storedSession) {
        const sessionData = JSON.parse(storedSession);
        this.user = sessionData.username;
        this.role = sessionData.role;
        this.isAuthenticated = true;

        // Démarrer le timer d'inactivité
        this.startInactivityTimer();

        this.redirectBasedOnRole();
      }
    },

    startInactivityTimer() {
      this.clearInactivityTimer();
      this.inactivityTimer = setTimeout(() => {
        this.logout();
        alert('Votre session a expiré en raison de l\'inactivité.');
      }, 15 * 60 * 1000); // 15 minutes
    },

    clearInactivityTimer() {
      if (this.inactivityTimer) {
        clearTimeout(this.inactivityTimer);
        this.inactivityTimer = null;
      }
    },

    resetInactivityTimer() {
      if (this.isAuthenticated) {
        this.startInactivityTimer();
      }
    },

    redirectBasedOnRole() {
      if (this.role === 'administrateur') {
        window.location.href = 'http://localhost:5173/administrateur';
      } else if (this.role === 'collaborateur') {
        window.location.href = 'http://localhost:5173/collaborateur';
      }
    },
  },
});

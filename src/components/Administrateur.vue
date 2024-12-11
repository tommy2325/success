<template>
  <div>
    <div class="header">
      <h1>Administrateur</h1>
      <div class="user-info">
        <span>{{ authStore.user }}</span>
        <button @click="logout" class="logout-button">Déconnexion</button>
      </div>
    </div>

    <div class="main-actions">
      <router-link to="/administrateur/utilisateurs" class="nav-button">Utilisateurs</router-link>
      <router-link to="/administrateur/questionnaires" class="nav-button">Questionnaires</router-link>
      <router-link to="/administrateur/dashboard" class="nav-button">Dashboard</router-link>
      <router-link to="/administrateur/correction" class="nav-button">Correction</router-link>
    </div>

    <div class="component-container">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style scoped>
.header {
  background-color: #c59edb;
  width: 100%;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
}

.header h1 {
  margin: 0;
  color: white;
  font-size: 2rem;
  text-align: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info span {
  margin-right: 10px;
  color: white;
  font-size: 1rem;
}

.logout-button {
  background-color: #e74c3c;
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #c0392b;
}

.main-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 100px;
}

.nav-button {
  text-decoration: none;
  background-color: #b48ac6;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  display: inline-block;
}

.nav-button:hover {
  background-color: #9a75a3;
}

.component-container {
  margin-top: 150px;
  padding: 20px;
  text-align: center;
}
</style>

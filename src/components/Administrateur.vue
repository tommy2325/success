<template>
  <div>
    <div class="header">
      <h1>Administrateur</h1>
      <div class="user-info">
        <span>{{ username }}</span>
        <button class="logout-button" @click="logout">Déconnexion</button>
      </div>
    </div>

    <div class="main-actions">
      <button @click="loadComponent('utilisateurs')">Utilisateurs</button>
      <button @click="loadComponent('questionnaires')">Questionnaires</button>
      <button @click="loadComponent('dashboard')">Dashboard</button>
    </div>

    <div class="component-container">
      <Utilisateur v-if="currentComponent === 'utilisateurs'" />
      <Questionnaires v-if="currentComponent === 'questionnaires'" />
      <Dashboard v-if="currentComponent === 'dashboard'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Utilisateur from './Utilisateur.vue';
import Questionnaires from './Questionnaires.vue';
import Dashboard from './Dashboard.vue';

const props = defineProps({
  username: {
    type: String,
    required: true
  }
});

const emit = defineEmits();
const currentComponent = ref(null);

const loadComponent = (componentName) => {
  currentComponent.value = componentName;
};

const logout = () => {
  emit('logout');
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
  justify-content: center;
  align-items: center;
}

.header h1 {
  margin: 0;
  color: white;
  font-size: 2rem;
  text-align: center;
  flex-grow: 1;
}

.user-info {
  display: flex;
  align-items: center;
  position: absolute;
  top: 20px;
  right: 20px;
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
  margin-left: 10px;
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

button {
  background-color: #b48ac6;
  color: white;
  padding: 20px 40px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 24px;
}

button:hover {
  background-color: #b48ac6;
}

.component-container {
  margin-top: 120px;
  text-align: center;
}
.component-container {
  margin-top: 120px;
  text-align: center;
}
</style>


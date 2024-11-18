<template>
<<<<<<< HEAD
  <div class="administrateur-container">
    <header class="admin-header">
      <h1>Espace Administrateur</h1>
      <div class="user-info">
        <span>{{ username }}</span>
        <button @click="logout">Déconnexion</button>
      </div>
    </header>

    <nav class="admin-nav">
      <ul>
        <li @click="showSection('dashboard')">Dashboard</li>
        <li @click="showSection('evaluation')">Évaluations</li>
        <li @click="showSection('questionnaires')">Questionnaires</li>
      </ul>
    </nav>

    <div class="admin-content">
      <div v-if="currentSection === 'dashboard'">
        <h2>Dashboard</h2>
        <!-- Contenu relatif au dashboard -->
      </div>
      <div v-if="currentSection === 'evaluation'">
        <h2>Évaluations</h2>
        <!-- Contenu relatif aux évaluations -->
      </div>
      <div v-if="currentSection === 'questionnaires'">
        <h2>Questionnaires</h2>
        <!-- Contenu relatif aux questionnaires -->
      </div>
=======
  <div>
    <div class="header">
      <h1>Administrateur</h1>
      <div class="user-info">
        <span>{{ username }}</span>
        <!-- Bouton de déconnexion modifié -->
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
>>>>>>> 0e9bd09dc72236f89149cb4caa9aee4885622191
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
<<<<<<< HEAD
import { defineProps, defineEmits } from 'vue';
=======
import Utilisateur from './Utilisateur.vue';
import Questionnaires from './Questionnaires.vue';
import Dashboard from './Dashboard.vue';
>>>>>>> 0e9bd09dc72236f89149cb4caa9aee4885622191

const props = defineProps({
  username: {
    type: String,
    required: true
  }
});

const emit = defineEmits();
<<<<<<< HEAD
const currentSection = ref('dashboard');

const showSection = (section) => {
  currentSection.value = section;
};

const logout = () => {
  emit('logout'); 
=======
const currentComponent = ref(null);

const loadComponent = (componentName) => {
  currentComponent.value = componentName;
};

// Logique de déconnexion (vous pouvez ajouter ici votre logique de déconnexion)
const logout = () => {
  emit('logout');
>>>>>>> 0e9bd09dc72236f89149cb4caa9aee4885622191
};
</script>

<style scoped>
<<<<<<< HEAD

.administrateur-container {
  padding: 20px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
=======
.header {
  background-color: #c59edb;
  width:98%;
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
>>>>>>> 0e9bd09dc72236f89149cb4caa9aee4885622191
}

.user-info {
  display: flex;
  align-items: center;
<<<<<<< HEAD
}

.user-info span {
  margin-right: 20px;
}

.admin-nav {
  margin-top: 20px;
}

.admin-nav ul {
  list-style-type: none;
  padding: 0;
}

.admin-nav li {
  display: inline;
  margin-right: 20px;
  cursor: pointer;
}

.admin-content {
  margin-top: 30px;
=======
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
>>>>>>> 0e9bd09dc72236f89149cb4caa9aee4885622191
}
</style>

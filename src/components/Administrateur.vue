<template>
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  username: {
    type: String,
    required: true
  }
});

const emit = defineEmits();
const currentSection = ref('dashboard');

const showSection = (section) => {
  currentSection.value = section;
};

const logout = () => {
  emit('logout'); 
};
</script>

<style scoped>

.administrateur-container {
  padding: 20px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
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
}
</style>

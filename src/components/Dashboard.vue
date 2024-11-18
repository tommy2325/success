<template>
    <div class="dashboard-container">
      <h2>Dashboard</h2>
      <div class="stat-cards">
        <div class="stat-card">
          <h3>Total Utilisateurs</h3>
          <p>{{ totalUtilisateurs }}</p>
        </div>
        <div class="stat-card">
          <h3>Total Questionnaires</h3>
          <p>{{ totalQuestionnaires }}</p>
        </div>
        <div class="stat-card">
          <h3>Total Évaluations</h3>
          <p>{{ totalEvaluations }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const totalUtilisateurs = ref(0);
  const totalQuestionnaires = ref(0);
  const totalEvaluations = ref(0);
  
  const fetchStats = async () => {
    totalUtilisateurs.value = 4; 
    totalQuestionnaires.value = 4;
    totalEvaluations.value = 4;
  };
  
  onMounted(fetchStats);
  </script>
  
  <style scoped>
  .dashboard-container {
    padding: 20px;
  }
  
  .stat-cards {
    display: flex;
    gap: 20px;
  }
  
  .stat-card {
    background-color: #f8f8f8;
    border-radius: 8px;
    padding: 20px;
    width: 200px;
    text-align: center;
  }
  </style>
  
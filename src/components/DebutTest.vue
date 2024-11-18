<template>
    <div>
      <div class="header">
        <h1>Début du Test</h1>
        <div class="user-info">
          <span>{{ username }}</span>
          <button @click="goBack">Retour</button>
        </div>
      </div>
  
      <div class="test-info">
        <h3>Catégorie :</h3>
        <p>Développement Web</p>
        <h3>Nombre de questions :</h3>
        <p>20</p>
        <h3>Nombre de points :</h3>
        <p>100</p>
        <h3>Temps du test :</h3>
        <p>60 minutes</p>
  
        <button class="start-btn">Démarrer</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  import { useRouter } from 'vue-router';
  
  const props = defineProps({
    username: {
      type: String,
      required: true
    }
  });
  
  const router = useRouter();
  
  const goBack = () => {
    router.push({ name: 'Collaborateur' });
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
  }
  
  .header h1 {
    margin: 0;
    color: white;
    font-size: 2rem;
    flex-grow: 1;
    text-align: center;
  }
  
  .user-info {
    display: flex;
    align-items: center;
  }
  
  .user-info span {
    margin-right: 20px;
    color: white;
    font-size: 1rem;
  }
  
  .test-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
  }
  
  .test-info h3 {
    font-size: 1.2rem;
    margin: 10px 0 5px;
  }
  
  .test-info p {
    margin: 5px 0 20px;
    font-size: 1rem;
  }
  
  .start-btn {
    padding: 10px 20px;
    background-color: #c59edb;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .start-btn:hover {
    background-color: #b48ac6;
  }
  </style>
  
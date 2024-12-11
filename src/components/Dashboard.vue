<template>
  <header>
    <h1>Dashboard</h1>
  </header>
  <div class="dashboard-container">
    <div class="stat-cards">
      <div class="stat-card">
        <h3>Total Utilisateur</h3>
        <p>{{ totalutilisateur }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Questionnaire</h3>
        <p>{{ totalquestionnaire }}</p>
      </div>
      <div class="stat-card">
        <h3>Questionnaires réalisés</h3>
        <p>{{ totalReponse }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';  
const totalutilisateur = ref(0);
const totalquestionnaire = ref(0);
const totalReponse = ref(0);

const fetchStats = async () => {
  try {
    // Récupérer le nombre total d'utilisateurs
    const { count: utilisateurCount, error: utilisateurError } = await supabase
      .from('utilisateur')  // Table Utilisateur (singulier)
      .select('id_utilisateur', { count: 'exact' });

    if (utilisateurError) {
      console.error('Erreur lors de la récupération des utilisateurs:', utilisateurError);
    } else {
      totalutilisateur.value = utilisateurCount; // Stocker le nombre total d'utilisateurs
    }

    // Récupérer le nombre total de questionnaires
    const { count: questionnaireCount, error: questionnaireError } = await supabase
      .from('questionnaire')  // Table Questionnaire (singulier)
      .select('*', { count: 'exact' });

    if (questionnaireError) {
      console.error('Erreur lors de la récupération des questionnaires:', questionnaireError);
    } else {
      totalquestionnaire.value = questionnaireCount; // Stocker le nombre total de questionnaires
    }

    // Récupérer le nombre total de réponses
    const { count: reponseCount, error: reponseError } = await supabase
      .from('reponse')  // Table Reponse (singulier)
      .select('*', { count: 'exact' });

    if (reponseError) {
      console.error('Erreur lors de la récupération des réponses:', reponseError);
    } else {
      totalReponse.value = reponseCount; // Stocker le nombre total de réponses
    }

  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
  }
};

// Appeler la fonction pour récupérer les statistiques au moment où le composant est monté
onMounted(() => {
  fetchStats();
});
</script>

<style scoped>

header {
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  padding: 20px;
  text-align: center;
  border-radius: 7px;
}
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

<template>
  <div>
    <!-- Header commun -->
    <div class="header">
      <h1 v-if="!showEvaluation">Début du Test</h1>
      <h1 v-else>Évaluation</h1>
      <div class="user-info">
        <span>{{ username }}</span>
        <button @click="goBack" v-if="!showEvaluation">Retour</button>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-if="!showEvaluation" class="test-info">
      <h3>Nom du questionnaire :</h3>
      <p>{{ questionnaire.nom }}</p>
      <h3>Temps du questionnaire :</h3>
      <p>{{ questionnaire.temps_de_passage }} minutes</p>
      <h3>Note sur :</h3>
      <p>{{ totalPoints }} points</p>

      <button class="start-btn" @click="startEvaluation">Démarrer</button>
    </div>

    <!-- Composant Evaluation -->
    <Evaluation 
      v-if="showEvaluation" 
      :username="username" 
      :questionnaire="questionnaire"
    />
    <router-view></router-view>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';
import { supabase } from '../supabase';
import Evaluation from './Evaluation.vue'; // Import du composant Evaluation

// Propriétés
const props = defineProps({
  username: {
    type: String,
    required: true
  },
  questionnaire: {
    type: Object,
    required: true
  }
});

// Variables réactives
const totalPoints = ref(0);
const showEvaluation = ref(false);

// Chargement des points total à l'ouverture
onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('question')
      .select('points')
      .eq('id_questionnaire', props.questionnaire.id_questionnaire);

    if (error) {
      console.error('Erreur lors de la récupération des questions :', error);
    } else {
      totalPoints.value = data.reduce((acc, question) => acc + question.points, 0);
    }
  } catch (error) {
    console.error("Erreur lors du calcul des points :", error);
  }
});

// Retour à la page précédente
const goBack = () => {
  history.back();
};

const startEvaluation = () => {
  router.push({ name: 'Evaluation', params: { id_questionnaire: props.questionnaire.id_questionnaire } });
};
</script>

<style scoped>
/* Header commun */
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

/* Bouton Retour */
.header .user-info button {
  background-color: white;
  color: #c59edb;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.header .user-info button:hover {
  background-color: #e7d7f3;
}

/* Informations du test */
.test-info {
  margin-top: 80px;
  text-align: center;
}

.test-info h3 {
  color: #333;
}

.start-btn {
  padding: 10px 20px;
  background-color: #c59edb;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.start-btn:hover {
  background-color: #a87ac4;
}
</style>

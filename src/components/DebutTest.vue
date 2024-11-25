<template>
  <div>
    <div class="header">
      <h1>Début du Test</h1>
      <div class="user-info">
        <span>{{ username }}</span>
        <button @click="goBack">Retour</button>
      </div>
    </div>

    <div class="test-info" v-if="questionnaire">
      <h3>Nom du questionnaire :</h3>
      <p>{{ questionnaire.nom }}</p>
      <h3>Temps du questionnaire :</h3>
      <p>{{ questionnaire.temps_de_passage }} minutes</p>
      <h3>Note sur :</h3>
      <p>{{ totalPoints }} points</p>

      <button class="start-btn">Démarrer</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';

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

const totalPoints = ref(0);

onMounted(async () => {
  try {
    // Calcul de la note totale basée sur les questions du questionnaire
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

const goBack = () => {
  history.back();
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

.test-info {
  margin-top: 80px;
  text-align: center;
}

.start-btn {
  padding: 10px 20px;
  background-color: #c59edb;
  color: white;
  border: none;
  cursor: pointer;
}
</style>

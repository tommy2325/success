<template>
  <div>
    <div v-if="!showDebutTest">
      <div class="header">
        <h1>Accueil Collaborateur</h1>
        <div class="user-info">
          <span>{{ username }}</span>
          <button class="logout-button" @click="logout">Déconnexion</button>
        </div>
      </div>

      <div class="collaborateur-container">
        <div class="main-content">
          <div class="sidebar">
            <button class="sidebar-btn">Statistiques</button>
          </div>

          <div class="questionnaire-section">
            <div class="code-input">
              <label for="code">CODE :</label>
              <input type="text" id="code" v-model="inputCode" placeholder="*code*" />
              <button class="code-btn" @click="checkCode">OK</button>
            </div>

            <div v-if="questionnaireData">
              <h3>Nom du questionnaire :</h3>
              <p>{{ questionnaireData.nom }}</p>
              <h3>Temps du questionnaire :</h3>
              <p>{{ questionnaireData.temps_de_passage }} minutes</p>
              <h3>Note sur :</h3>
              <p>{{ totalPoints }} points</p>

              <button class="start-btn" @click="startEvaluation">Démarrer</button>
            </div>

            <div class="questionnaire-list">
              <h3>Questionnaires réalisés :</h3>
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Date</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="passage in passages" :key="passage.id_passer">
                    <td>{{ passage.nom_questionnaire }}</td>
                    <td>{{ formatDate(passage.date) }}</td>
                    <td>{{ passage.note }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <button class="back-btn">Retour</button>
      </div>
    </div>

    <Evaluation v-if="showDebutTest" :username="username" :userId="userId" :questionnaire="questionnaireData" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import { defineProps, defineEmits } from 'vue';
import Evaluation from './Evaluation.vue'; 

const props = defineProps({
  username: {
    type: String,
    required: true
  },
  userId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits();
const passages = ref([]);
const inputCode = ref('');
const questionnaireData = ref(null);
const showDebutTest = ref(false);
const totalPoints = ref(0);

const logout = () => {
  emit('logout');
};

const fetchPassages = async () => {
  const { data, error } = await supabase
    .from('Passer')
    .select(`
      id_passer,
      date,
      note,
      Questionnaire (nom)
    `)
    .eq('id_utilisateur', props.userId)
    .order('date', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des passages :", error);
  } else {
    passages.value = data.map(passage => ({
      id_passer: passage.id_passer,
      date: passage.date,
      note: passage.note,
      nom_questionnaire: passage.Questionnaire.nom
    }));
  }
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('fr-FR', options);
};

const checkCode = async () => {
  try {
    const { data, error } = await supabase
      .from('questionnaire')
      .select('id_questionnaire, nom, temps_de_passage, code')
      .eq('code', inputCode.value)
      .single();

    if (error || !data) {
      alert('Code incorrect');
    } else {
      questionnaireData.value = data; // Sauvegarde les données du questionnaire
      totalPoints.value = await fetchTotalPoints(data.id_questionnaire); // Récupère les points totaux
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du code :", error);
    alert('Erreur lors de la vérification du code');
  }
};

const fetchTotalPoints = async (questionnaireId) => {
  const { data, error } = await supabase
    .from('question')
    .select('points')
    .eq('id_questionnaire', questionnaireId);

  if (error) {
    console.error('Erreur lors de la récupération des points totaux :', error);
    return 0;
  } else {
    return data.reduce((acc, question) => acc + question.points, 0);
  }
};

const startEvaluation = () => {
  showDebutTest.value = true;
};

onMounted(() => {
  fetchPassages();
});
</script>

<style scoped>
.header {
  background-color: #c59edb;
  width: 98%;
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

.collaborateur-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  padding: 80px 20px 20px; 
}

.main-content {
  display: flex;
  width: 100%;
  margin-top: 20px;
}

.sidebar {
  width: 200px;
  background-color: #d9d9d9;
  padding: 10px;
}

.sidebar-btn {
  width: 100%;
  padding: 10px;
  font-size: 1.2rem;
  background-color: #d9d9d9;
  color: black;
  border: none;
  text-align: center;
  cursor: pointer;
}

.questionnaire-section {
  flex: 1;
  padding: 20px;
}

.code-input {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.code-input label {
  font-size: 1.1rem;
  margin-right: 10px;
}

.code-input input {
  padding: 5px;
  width: 100px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.code-btn {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #c59edb;
  color: white;
  border: none;
  cursor: pointer;
}

.questionnaire-list h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: left;
}

.back-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #c59edb;
  color: white;
  border: none;
  cursor: pointer;
}

.start-btn {
  padding: 10px 20px;
  background-color: #c59edb;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 20px;
}
</style>

<template>
  <div>
    <header>
      <h1>Gestion des Questionnaires</h1>
    </header>

    <section>
      <button @click="showCreationForm">Créer un Questionnaire</button>

      <!-- Modal for creating a questionnaire -->
      <div v-if="showCreation">
        <CreationQ @refresh="fetchQuestionnaires" @cancel="hideCreationForm" />
      </div>

      <table v-else class="data-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
            </th>
            <th>Nom</th>
            <th>Date de création</th>
            <th>Temps</th>
            <th>Code</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(questionnaire, index) in questionnaires" :key="questionnaire.id">
            <td>
              <input 
                type="checkbox" 
                :checked="selectedQuestionnaires.includes(questionnaire.id)"
                @change="toggleQuestionnaireSelection(questionnaire.id)"
              />
            </td>
            <td>{{ questionnaire.nom }}</td>
            <td>{{ questionnaire.date_creation }}</td>
            <td>{{ questionnaire.temps_de_passage }} minutes</td>
            <td>{{ questionnaire.code }}</td>
            <td>
              <button @click="editQuestionnaire(questionnaire.id)">Modifier</button>
              <button @click="deleteQuestionnaire(questionnaire.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import CreationQ from './CreationQ.vue';

const questionnaires = ref([]);
const showCreation = ref(false);
const selectAll = ref(false);
const selectedQuestionnaires = ref([]);

const fetchQuestionnaires = async () => {
  const { data, error } = await supabase.from('questionnaire').select('*');
  if (error) {
    console.error('Erreur lors de la récupération des questionnaires:', error);
  } else {
    questionnaires.value = data;
  }
};

const showCreationForm = () => {
  showCreation.value = true;
};

const hideCreationForm = () => {
  showCreation.value = false;
};

const editQuestionnaire = (questionnaireId) => {
  console.log('Modifier le questionnaire', questionnaireId);
};

const deleteQuestionnaire = (questionnaireId) => {
  console.log('Supprimer le questionnaire', questionnaireId);
};

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedQuestionnaires.value = questionnaires.value.map((q) => q.id);
  } else {
    selectedQuestionnaires.value = [];
  }
};

const toggleQuestionnaireSelection = (id) => {
  if (selectedQuestionnaires.value.includes(id)) {
    selectedQuestionnaires.value = selectedQuestionnaires.value.filter((qid) => qid !== id);
  } else {
    selectedQuestionnaires.value.push(id);
  }
  selectAll.value = questionnaires.value.length === selectedQuestionnaires.value.length;
};

onMounted(() => {
  fetchQuestionnaires();
});
</script>

<style scoped>
header {
  background-color: #c59edb;
  color: white;
  padding: 20px;
  text-align: center;
}

button {
  background-color: #c59edb;
  border: none;
  padding: 10px;
  color: white;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #b48ac6;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table th, table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.data-table th {
  background-color: #f0f0f0;
}

.data-table tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>

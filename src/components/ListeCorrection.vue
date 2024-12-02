<template>
  <div>
    <h2>Correction des Questionnaires</h2>
    <table>
      <thead>
        <tr>
          <th>Nom du Questionnaire</th>
          <th>Utilisateur</th>
          <th>Note</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="passage in passages" :key="passage.id_passer">
          <td @click="showCorrection(passage.id_questionnaire)">{{ passage.nom_questionnaire }}</td>
          <td>{{ passage.utilisateur }}</td>
          <td>{{ passage.note }}</td>
          <td>{{ formatDate(passage.date) }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="selectedQuestionnaire">
      <h3>Correction pour {{ selectedQuestionnaire.nom }}</h3>
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Réponse Utilisateur</th>
            <th>Bonne Réponse</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="correction in corrections" :key="correction.id_question">
            <td>{{ correction.question }}</td>
            <td>{{ correction.reponse_utilisateur }}</td>
            <td>{{ correction.bonne_reponse }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';

const passages = ref([]);
const selectedQuestionnaire = ref(null);
const corrections = ref([]);
const utilisateurs = ref({});
const questionnaires = ref({});

const fetchPassages = async () => {
  const { data, error } = await supabase
    .from('passer')
    .select(`
      id_passer,
      date,
      note,
      id_utilisateur,
      id_questionnaire
    `)
    .order('date', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des passages :", error);
  } else {
    passages.value = data;
    console.log(passages.value); // Vérifiez les données récupérées
    fetchUtilisateurs();
  }
};

const fetchUtilisateurs = async () => {
  const { data, error } = await supabase
    .from('utilisateur')
    .select('id_utilisateur, pseudo');

  if (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
  } else {
    utilisateurs.value = data.reduce((acc, utilisateur) => {
      acc[utilisateur.id_utilisateur] = utilisateur.pseudo;
      return acc;
    }, {});
    console.log(utilisateurs.value); // Vérifiez les données récupérées
    fetchQuestionnaires();
  }
};

const fetchQuestionnaires = async () => {
  const { data, error } = await supabase
    .from('questionnaire')
    .select('id_questionnaire, nom');

  if (error) {
    console.error("Erreur lors de la récupération des questionnaires :", error);
  } else {
    questionnaires.value = data.reduce((acc, questionnaire) => {
      acc[questionnaire.id_questionnaire] = questionnaire.nom;
      return acc;
    }, {});
    console.log(questionnaires.value); // Vérifiez les données récupérées
    mapPassages();
  }
};

const mapPassages = () => {
  passages.value = passages.value.map(passage => ({
    ...passage,
    utilisateur: utilisateurs.value[passage.id_utilisateur],
    nom_questionnaire: questionnaires.value[passage.id_questionnaire]
  }));
  console.log(passages.value); // Vérifiez les données mappées
};

const showCorrection = async (id_questionnaire) => {
  selectedQuestionnaire.value = passages.value.find(p => p.id_questionnaire === id_questionnaire);

  const { data, error } = await supabase
    .from('question')
    .select(`
      id_question,
      titre,
      reponse (titre, etre_bonne_reponse)
    `)
    .eq('id_questionnaire', id_questionnaire);

  if (error) {
    console.error("Erreur lors de la récupération des corrections :", error);
  } else {
    corrections.value = data.map(question => ({
      question: question.titre,
      reponse_utilisateur: question.reponse.find(r => !r.etre_bonne_reponse)?.titre || 'N/A',
      bonne_reponse: question.reponse.find(r => r.etre_bonne_reponse)?.titre || 'N/A'
    }));
  }
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('fr-FR', options);
};

onMounted(() => {
  fetchPassages();
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ccc;
}

th {
  background-color: #f0f0f0;
}

td {
  cursor: pointer;
}

td:hover {
  background-color: #f9f9f9;
}
</style>
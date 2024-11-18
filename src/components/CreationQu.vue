<template>
    <div class="creation-qu-container">
      <h2>Création de Questions</h2>
  
      <div class="question-counter">
        <span>Question {{ currentQuestionIndex + 1 }}/{{ totalQuestions }}</span>
      </div>
  
      <form @submit.prevent="createQuestion">
        <label>Titre de la question :
          <input v-model="newQuestion.titre" type="text" required />
        </label>
  
        <div v-for="(reponse, index) in newQuestion.reponses" :key="index" class="option-container">
          <label>
            Option {{ index + 1 }} :
            <input v-model="reponse.titre" type="text" :placeholder="'Option ' + (index + 1)" required />
          </label>
          <label>
            <input type="checkbox" v-model="reponse.bonne_reponse" :value="true" />
            Bonne réponse
          </label>
        </div>
  
        <button type="button" @click="addResponse">Ajouter une réponse</button>
  
        <div class="modal-actions">
          <button type="submit">Valider la question</button>
          <button type="button" @click="goBack">Retour</button>
        </div>
      </form>
  
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { supabase } from '../supabase';  // Importer la connexion à Supabase
  import { useRouter } from 'vue-router'; // Pour la navigation entre les pages
  
  const router = useRouter();
  
  const newQuestion = ref({
    titre: '',
    reponses: [
      { titre: '', bonne_reponse: false },
      { titre: '', bonne_reponse: false },
      { titre: '', bonne_reponse: false },
      { titre: '', bonne_reponse: false }
    ]
  });
  
  const currentQuestionIndex = ref(0);
  const totalQuestions = ref(20);  // Total des questions à créer (fixe pour l'instant)
  
  const errorMessage = ref(null);
  const successMessage = ref(null);
  
  // Ajouter une réponse
  const addResponse = () => {
    if (newQuestion.value.reponses.length < 6) {
      newQuestion.value.reponses.push({ titre: '', bonne_reponse: false });
    }
  };
  
  // Créer la question dans la base de données
  const createQuestion = async () => {
    errorMessage.value = null;
    successMessage.value = null;
  
    if (newQuestion.value.titre && newQuestion.value.reponses.every(r => r.titre)) {
      // Vérifier qu'une seule bonne réponse est cochée
      const bonneReponseCount = newQuestion.value.reponses.filter(r => r.bonne_reponse).length;
  
      if (bonneReponseCount !== 1) {
        errorMessage.value = "Veuillez sélectionner une seule bonne réponse.";
        return;
      }
  
      // Insertion de la question dans la table "question"
      const { data, error } = await supabase.from('question').insert([{
        titre: newQuestion.value.titre,
        points: 10  // Points par défaut, tu peux ajuster selon tes besoins
      }]);
  
      if (error) {
        errorMessage.value = `Erreur lors de l'ajout de la question: ${error.message}`;
        return;
      }
  
      const questionId = data[0].id_question;
  
      // Insertion des réponses dans la table "réponse"
      const reponses = newQuestion.value.reponses.map((reponse, index) => ({
        id_question: questionId,
        titre: reponse.titre,
        etre_bonne_reponse: reponse.bonne_reponse
      }));
  
      const { error: reponseError } = await supabase.from('reponse').insert(reponses);
  
      if (reponseError) {
        errorMessage.value = `Erreur lors de l'ajout des réponses: ${reponseError.message}`;
        return;
      }
  
      // Création de la relation entre la question et le questionnaire
      const { error: relationError } = await supabase.from('contenir').insert([{
        id_question: questionId,
        id_questionnaire: 1 // ID du questionnaire à associer (exemple: ID 1)
      }]);
  
      if (relationError) {
        errorMessage.value = `Erreur lors de la relation question/questionnaire: ${relationError.message}`;
        return;
      }
  
      successMessage.value = 'Question ajoutée avec succès !';
  
      // Réinitialiser la question pour la prochaine
      newQuestion.value = {
        titre: '',
        reponses: [
          { titre: '', bonne_reponse: false },
          { titre: '', bonne_reponse: false },
          { titre: '', bonne_reponse: false },
          { titre: '', bonne_reponse: false }
        ]
      };
  
      currentQuestionIndex.value++;  // Passer à la question suivante
  
      if (currentQuestionIndex.value >= totalQuestions.value) {
        successMessage.value = "Toutes les questions ont été ajoutées.";
      }
    } else {
      errorMessage.value = "Veuillez remplir tous les champs.";
    }
  };
  
  // Fonction pour revenir à la page précédente (Collaborateur.vue)
  const goBack = () => {
    router.push('/collaborateur'); // Redirige vers la page Collaborateur
  };
  </script>
  
  <style scoped>
  .creation-qu-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
  
  h2 {
    text-align: center;
    color: #5f4b8b;
  }
  
  .question-counter {
    text-align: right;
    font-size: 1rem;
    color: #777;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  label {
    font-size: 1rem;
  }
  
  input {
    padding: 8px;
    margin-top: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .option-container {
    display: flex;
    flex-direction: column;
  }
  
  .modal-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  button {
    background-color: #c59edb;
    border: none;
    padding: 10px 15px;
    color: white;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #b48ac6;
  }
  
  .error-message {
    color: red;
    font-size: 0.9rem;
    margin-top: 10px;
  }
  
  .success-message {
    color: green;
    font-size: 0.9rem;
    margin-top: 10px;
  }
  </style>
  
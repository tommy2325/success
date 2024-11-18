<template>
  <div class="modal">
    <div class="modal-content">
      <h2>Créer un nouveau questionnaire</h2>
      <form @submit.prevent="createQuestionnaire">
        <label>Nom du QCM:
          <input v-model="qcm.nom" type="text" required />
        </label>
        
        <label>Temps (minutes):
          <input v-model="qcm.temps" type="number" min="1" required />
        </label>
        
        <label>Mot de passe:
          <input v-model="qcm.mot_de_passe" type="password" />
        </label>
        
        <div class="modal-actions">
          <button type="submit">Créer</button>
          <button type="button" @click="cancel">Annuler</button>
        </div>
      </form>
      
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../supabase';  // Importer la connexion à Supabase

const emit = defineEmits(['refresh', 'cancel']);

const qcm = ref({
  nom: '',
  temps: '',
  mot_de_passe: ''
});

const errorMessage = ref(null);
const successMessage = ref(null);

// Créer un questionnaire
const createQuestionnaire = async () => {
  errorMessage.value = null;
  successMessage.value = null;

  // Vérifie que tous les champs sont remplis avant d'ajouter
  if (qcm.value.nom && qcm.value.temps) {
    const { data, error } = await supabase.from('questionnaire').insert([{
      nom: qcm.value.nom,
      date_creation: new Date().toISOString().split('T')[0],  // Date du jour au format YYYY-MM-DD
      code: qcm.value.mot_de_passe,
      temps_de_passage: qcm.value.temps
    }]);

    if (error) {
      errorMessage.value = `Erreur lors de la création du questionnaire: ${error.message}`;
    } else {
      successMessage.value = 'Questionnaire créé avec succès!';
      qcm.value = { nom: '', temps: '', mot_de_passe: '' };
      emit('refresh');
    }
  } else {
    errorMessage.value = "Veuillez remplir tous les champs du formulaire.";
  }
};

// Annuler la création du questionnaire
const cancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h2 {
  color: #c59edb;
  margin-bottom: 20px;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

input, select {
  padding: 8px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
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

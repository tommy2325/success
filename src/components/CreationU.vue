<template>
  <div>
    <h2>Créer un nouvel utilisateur</h2>
    <form @submit.prevent="createUser">
      <label>Nom d'utilisateur:
        <input v-model="user.pseudo" type="text" required />
      </label>
      <label>Nom:
        <input v-model="user.nom" type="text" required />
      </label>
      <label>Email:
        <input v-model="user.email" type="email" required />
      </label>
      <label>Groupe:
        <select v-model="user.groupe" required>
          <option value="1">Equipe Dev</option>
          <option value="2">Equipe RH</option>
          <option value="3">Equipe Marketing</option>
          <option value="4">Equipe Finance</option>
        </select>
      </label>
      <button type="submit">Créer</button>
      <button type="button" @click="cancel">Annuler</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../supabase'; 

const emit = defineEmits(['refresh', 'cancel']);

const user = ref({
  pseudo: '',
  nom: '',
  email: '',
  groupe: '1' 
});

const createUser = async () => {
  try {
    // Vérification de la session utilisateur
    const userSession = supabase.auth.user();
    console.log('Session utilisateur:', userSession); // Log pour vérifier la session de l'utilisateur
    
    if (!userSession) {
      alert('Vous devez être connecté pour créer un utilisateur.');
      return;
    }

    // Insertion de l'utilisateur dans la table Utilisateur
    const { data: userData, error: userError } = await supabase
      .from('Utilisateur')
      .insert([{
        pseudo: user.value.pseudo,
        email: user.value.email,
        mot_de_passe: 'motdepassepardefaut',  // Tu devras sécuriser le mot de passe par la suite
        groupe: user.value.groupe
      }]);

    console.log('Données utilisateur:', userData); // Log pour afficher les données de l'utilisateur créé

    if (userError) {
      console.error('Erreur lors de l\'insertion dans Utilisateur:', userError);
      throw new Error(userError.message);
    }

    const userId = userData[0].id_utilisateur;
    console.log('ID utilisateur créé:', userId); // Log pour vérifier l'ID de l'utilisateur

    // Insertion dans la table Appartenir
    const { error: groupError } = await supabase
      .from('Appartenir')
      .insert([{
        id_utilisateur: userId,
        id_groupe: user.value.groupe
      }]);

    if (groupError) {
      console.error('Erreur lors de l\'insertion dans Appartenir:', groupError);
      throw new Error(groupError.message);
    }

    console.log('Utilisateur créé et associé au groupe avec succès');
    
    // Réinitialiser le formulaire après succès
    user.value = { pseudo: '', nom: '', email: '', groupe: '1' };
    
    emit('refresh'); 
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
  }
};

const cancel = () => {
  emit('cancel');
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
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
</style>

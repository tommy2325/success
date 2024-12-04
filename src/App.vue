<template>
  <div>
    <!-- Barre supérieure pour déconnexion -->
    <div v-if="isLoggedIn" class="top-bar">
      <button @click="logout" class="logout-btn">Déconnexion</button>
    </div>

    <!-- Formulaire de connexion -->
    <div v-if="!isLoggedIn" class="login-container">
      <div class="header">
        <h1>Success</h1>
      </div>
      <div class="login-box">
        <h2>Connexion</h2>
        <form @submit.prevent="submitForm">
          <div class="input-group">
            <label for="username">Nom d'utilisateur:</label>
            <input type="text" v-model="username" id="username" required />
          </div>
          <div class="input-group">
            <label for="password">Mot de passe:</label>
            <input type="password" v-model="password" id="password" required />
          </div>
          <button type="submit" class="submit-btn">Se connecter</button>
        </form>
      </div>
    </div>
  
    <!-- Affichage selon le rôle de l'utilisateur -->
    <Administrateur v-if="isLoggedIn && userRole === 'administrateur'" :username="username" @logout="logout" />
    <Collaborateur v-if="isLoggedIn && userRole === 'collaborateur'" :username="username" @logout="logout" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from './supabase';
import bcrypt from 'bcryptjs';
import Administrateur from './components/Administrateur.vue';
import Collaborateur from './components/Collaborateur.vue';

const username = ref('');
const password = ref('');
const isLoggedIn = ref(false);
const userRole = ref(null);
const router = useRouter();

// Vérifier la session existante au chargement
const storedSession = localStorage.getItem('session');
if (storedSession) {
  const sessionData = JSON.parse(storedSession);
  isLoggedIn.value = true;
  userRole.value = sessionData.role;
  username.value = sessionData.username;
}

const submitForm = async () => {
  try {
    const { data, error } = await supabase
      .from('utilisateur')
      .select(`*, appartenir (groupe (role))`)
      .eq('pseudo', username.value)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération des données:', error);
      alert('Nom d’utilisateur ou mot de passe incorrect');
      return;
    }

    if (data) {
      const validPassword = await bcrypt.compare(password.value, data.mot_de_passe);
      if (validPassword) {
        userRole.value = data.appartenir[0].groupe.role;
        isLoggedIn.value = true;

        // Enregistrer la session
        localStorage.setItem('session', JSON.stringify({
          username: username.value,
          role: userRole.value
        }));

        // Rediriger selon le rôle
        if (userRole.value === 'administrateur') {
          router.push('/administrateur');
        } else if (userRole.value === 'collaborateur') {
          router.push('/collaborateur');
        }
      } else {
        alert('Nom d’utilisateur ou mot de passe incorrect');
      }
    }
  } catch (err) {
    console.error('Erreur lors de la soumission:', err);
  }
};

const logout = () => {
  isLoggedIn.value = false;
  userRole.value = null;
  username.value = '';
  password.value = '';

  // Supprimer la session
  localStorage.removeItem('session');

  // Rediriger vers la page de connexion
  router.push('/');
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 98vh;
  background-color: #e5e5e5;
}

.header {
  background-color: #c59edb;
  width: 100%;
  text-align: center;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
}

.header h1 {
  margin: 0;
  color: white;
  font-size: 2rem;
}

.login-box {
  background-color: #d9d9d9;
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-btn {
  background-color: #c59edb;
  border: none;
  padding: 10px 20px;
  color: white;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #b48ac6;
}
</style>

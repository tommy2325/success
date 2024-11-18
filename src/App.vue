<template>
  <div>
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

    <Administrateur v-if="isLoggedIn && userRole === 'administrateur'" :username="username" @logout="logout" />
    <Collaborateur v-if="isLoggedIn && userRole === 'collaborateur'" :username="username" @logout="logout" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from './supabase';
import Administrateur from './components/Administrateur.vue';
import Collaborateur from './components/Collaborateur.vue';
 
const username = ref('');
const password = ref('');
const isLoggedIn = ref(false);
const userRole = ref(null);
const router = useRouter();

const submitForm = async () => {
  try {
    const { data, error } = await supabase
      .from('utilisateur')
      .select(`*, appartenir (groupe (role))`)
      .eq('pseudo', username.value)
      .eq('mot_de_passe', password.value)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération des données:', error);
      alert('Nom d’utilisateur ou mot de passe incorrect');
      return;
    }

    if (data) {
      userRole.value = data.appartenir[0].groupe.role;
      isLoggedIn.value = true;
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

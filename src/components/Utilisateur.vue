<template>
  <div>
    <header>
      <h1>Gestion des Utilisateurs</h1>
    </header>

    <section>
      <button @click="showCreationForm">Créer un utilisateur</button>

      <!-- Champ de recherche -->
      <div>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un utilisateur par pseudo"
          @input="searchUser"
        />
      </div>

      <div v-if="showCreation">
        <CreationU @refresh="fetchUtilisateurs" @cancel="hideCreationForm" />
      </div>

      <table v-else class="data-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
            </th>
            <th>Nom d'utilisateur</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Groupe</th>
            <th>Mot de passe</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(utilisateur, index) in filteredUtilisateurs" :key="utilisateur.id">
            <td>
              <input
                type="checkbox"
                :value="utilisateur.id"
                v-model="selectedUsers"
              />
            </td>
            <td>{{ utilisateur.pseudo }}</td>
            <td>{{ utilisateur.nom }}</td>
            <td>{{ utilisateur.email }}</td>
            <td>{{ utilisateur.appartenir[0]?.groupe.nom || 'N/A' }}</td>
            <td>{{ utilisateur.mot_de_passe }}</td>
            <td>
              <button @click="editUser(utilisateur)">Modifier</button>
              <button @click="confirmDeleteUser(utilisateur)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Modale de modification utilisateur -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Modifier l'utilisateur</h3>
        <label for="editNom">Nom d'utilisateur:</label>
        <input type="text" v-model="editUtilisateur.pseudo" id="editNom" />

        <label for="editPassword">Mot de passe:</label>
        <input type="password" v-model="editUtilisateur.mot_de_passe" id="editPassword" />

        <label for="editGroupe">Groupe:</label>
        <select v-model="editUtilisateur.groupe_id" id="editGroupe">
          <option v-for="groupe in groupes" :key="groupe.id" :value="groupe.id">{{ groupe.nom }}</option>
        </select>

        <button @click="updateUser">Mettre à jour</button>
        <button @click="closeEditModal">Annuler</button>
      </div>
    </div>

    <!-- Modale de suppression utilisateur -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h3>Mot de passe requis</h3>
        <input
          type="password"
          v-model="motDePasse"
          placeholder="Entrez votre mot de passe"
        />
        <button @click="verifyPassword">Vérifier</button>
        <button @click="closeDeleteModal">Annuler</button>
      </div>
    </div>

    <!-- Confirmation de suppression -->
    <div v-if="showConfirmModal" class="modal">
      <div class="modal-content">
        <h3>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</h3>
        <button @click="deleteUser">Supprimer</button>
        <button @click="closeConfirmModal">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { supabase } from "../supabase";
import CreationU from "./CreationU.vue";

const utilisateurs = ref([]);
const groupes = ref([]);
const showCreation = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showConfirmModal = ref(false);
const motDePasse = ref("");
const editUtilisateur = ref({});
const userToDelete = ref(null);
const selectAll = ref(false); // Case pour "Tout cocher"
const selectedUsers = ref([]); // Liste des utilisateurs sélectionnés
const searchQuery = ref(""); // Valeur pour la recherche

// Fonction pour récupérer les utilisateurs
const fetchUtilisateurs = async () => {
  const { data, error } = await supabase
    .from("utilisateur")
    .select(`*, appartenir (groupe (nom, role))`);
  if (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
  } else {
    utilisateurs.value = data;
  }
};

// Fonction pour récupérer les groupes
const fetchGroupes = async () => {
  const { data, error } = await supabase.from("groupe").select("*");
  if (error) {
    console.error("Erreur lors de la récupération des groupes:", error);
  } else {
    groupes.value = data;
  }
};

// Fonction pour afficher le formulaire de création
const showCreationForm = () => {
  showCreation.value = true;
};

// Fonction pour cacher le formulaire de création
const hideCreationForm = () => {
  showCreation.value = false;
};

// Fonction pour modifier un utilisateur
const editUser = (utilisateur) => {
  editUtilisateur.value = { ...utilisateur };
  showEditModal.value = true;
};

// Fonction pour fermer la modale de modification
const closeEditModal = () => {
  showEditModal.value = false;
};

// Fonction pour mettre à jour un utilisateur
const updateUser = async () => {
  console.log("Tentative de mise à jour de l'utilisateur:", editUtilisateur.value);

  const { error } = await supabase
    .from("utilisateur")
    .update({
      pseudo: editUtilisateur.value.pseudo,
      mot_de_passe: editUtilisateur.value.mot_de_passe,
      groupe_id: editUtilisateur.value.groupe_id,
    })
    .eq("id", editUtilisateur.value.id);

  if (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error.message);
    alert("Une erreur est survenue lors de la mise à jour de l'utilisateur.");
  } else {
    fetchUtilisateurs();
    closeEditModal();
  }
};

// Fonction pour confirmer la suppression d'un utilisateur
const confirmDeleteUser = (utilisateur) => {
  userToDelete.value = utilisateur;
  showDeleteModal.value = true;
};

// Fonction pour vérifier le mot de passe avant la suppression
const verifyPassword = async () => {
  const { data, error } = await supabase
    .from("utilisateur")
    .select("mot_de_passe")
    .eq("id", userToDelete.value.id)
    .single();

  if (error || data.mot_de_passe !== motDePasse.value) {
    alert("Mot de passe incorrect !");
  } else {
    closeDeleteModal();
    showConfirmModal.value = true;
  }
};

// Fonction pour supprimer un utilisateur
const deleteUser = async () => {
  const { error } = await supabase.from("utilisateur").delete().eq("id", userToDelete.value.id);

  if (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
  } else {
    fetchUtilisateurs();
    closeConfirmModal();
  }
};

// Fonction pour fermer la modale de suppression
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  motDePasse.value = "";
};

// Fonction pour fermer la modale de confirmation
const closeConfirmModal = () => {
  showConfirmModal.value = false;
};

// Fonction pour gérer le changement de la case "tout cocher"
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedUsers.value = utilisateurs.value.map((utilisateur) => utilisateur.id);
  } else {
    selectedUsers.value = [];
  }
};

// Fonction de recherche
const searchUser = () => {
  // Met à jour la liste des utilisateurs filtrés à chaque changement dans le champ de recherche
  filteredUtilisateurs.value = utilisateurs.value.filter((utilisateur) =>
    utilisateur.pseudo.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};

// Utilisateur filtré en fonction de la recherche
const filteredUtilisateurs = computed(() => {
  return utilisateurs.value.filter((utilisateur) =>
    utilisateur.pseudo.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Au montage du composant, on récupère les utilisateurs et les groupes
onMounted(() => {
  fetchUtilisateurs();
  fetchGroupes();
});
</script>

<style scoped>
/* Styles */
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

table th,
table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

input[type="checkbox"] {
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
}

input[type="text"],
input[type="password"],
select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

input[type="text"] {
  margin-top: 10px;
}
</style>

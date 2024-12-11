<template>
  <div>
    <header>
      <h1>Gestion des Utilisateurs</h1>
    </header>

    <section>
      <div class="button-group">
        <button @click="showCreationForm">Créer un utilisateur</button>
        <button @click="showCreationGroupForm">Créer un groupe</button>
        <button v-if="selectedUsers.length >= 2" @click="confirmDeleteSelectedUsers">Supprimer sélectionnés</button>
      </div>

      <div >
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

      <div v-if="showCreationGroup">
        <CreationG @refresh="fetchGroupes" @cancel="hideCreationGroupForm" />
      </div>

      <!-- Tableau déroulant avec scroll -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
              </th>
              <th>Nom d'utilisateur</th>
              <th>Groupe</th>
              <th>Rôle</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="utilisateur in filteredUtilisateurs" :key="utilisateur.id_utilisateur">
              <td>
                <input
                  type="checkbox"
                  :value="utilisateur.id_utilisateur"
                  v-model="selectedUsers"
                />
              </td>
              <td>{{ utilisateur.pseudo }}</td>
              <td>{{ utilisateur.appartenir[0]?.groupe.nom || 'N/A' }}</td>
              <td>{{ utilisateur.appartenir[0]?.groupe.role || 'N/A' }}</td>
              <td>
                <button @click="editUser(utilisateur)">Modifier</button>
                <button @click="confirmDeleteUser(utilisateur)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
          <option v-for="groupe in groupes" :key="groupe.id_groupe" :value="groupe.id_groupe">{{ groupe.nom }}</option>
        </select>

        <button @click="updateUser">Mettre à jour</button>
        <button @click="closeEditModal">Annuler</button>
      </div>
    </div>

    <!-- Confirmation de suppression -->
    <div v-if="showConfirmModal" class="modal">
      <div class="modal-content">
        <h3>Êtes-vous sûr de vouloir supprimer ces utilisateurs :</h3>
        <ul>
          <li v-for="user in usersToDelete" :key="user.id_utilisateur">{{ user.pseudo }}</li>
        </ul>
        <button @click="deleteUsers">Supprimer</button>
        <button @click="closeConfirmModal">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import bcrypt from 'bcryptjs';
import { supabase } from "../supabase";
import CreationU from "./CreationU.vue";
import CreationG from "./CreationG.vue";

const utilisateurs = ref([]);
const groupes = ref([]);
const showCreation = ref(false);
const showCreationGroup = ref(false);
const showEditModal = ref(false);
const showConfirmModal = ref(false);
const editUtilisateur = ref({});
const usersToDelete = ref([]); // Liste des utilisateurs à supprimer
const selectAll = ref(false); // Case pour "Tout cocher"
const selectedUsers = ref([]); // Liste des utilisateurs sélectionnés
const searchQuery = ref(""); // Valeur pour la recherche
const currentUser = ref(null); // Utilisateur connecté

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

// Fonction pour afficher/masquer la ligne détaillée
const toggleRow = (index) => {
  expandedRowIndex.value = expandedRowIndex.value === index ? null : index;
};

// Fonction pour afficher le formulaire de création
const showCreationForm = () => {
  showCreation.value = true;
};

// Fonction pour cacher le formulaire de création
const hideCreationForm = () => {
  showCreation.value = false;
};

// Fonction pour afficher le formulaire de création de groupe
const showCreationGroupForm = () => {
  showCreationGroup.value = true;
};

// Fonction pour cacher le formulaire de création de groupe
const hideCreationGroupForm = () => {
  showCreationGroup.value = false;
};

// Fonction pour modifier un utilisateur
const editUser = (utilisateur) => {
  editUtilisateur.value = {
    ...utilisateur,
    groupe_id: utilisateur.appartenir[0]?.groupe.id_groupe || null
  };
  showEditModal.value = true;
};

// Fonction pour fermer la modale de modification
const closeEditModal = () => {
  showEditModal.value = false;
};

const updateUser = async () => {
  console.log("Tentative de mise à jour de l'utilisateur:", editUtilisateur.value);

  try {
    const hashedPassword = await bcrypt.hash(editUtilisateur.value.mot_de_passe, 10);

    const { error } = await supabase
      .from("utilisateur")
      .update({
        pseudo: editUtilisateur.value.pseudo,
        mot_de_passe: hashedPassword,
      })
      .eq("id_utilisateur", editUtilisateur.value.id_utilisateur);

    if (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error.message);
      alert("Une erreur est survenue lors de la mise à jour de l'utilisateur.");
    } else {
      const { error: groupError } = await supabase
        .from("appartenir")
        .update({ id_groupe: editUtilisateur.value.groupe_id })
        .eq("id_utilisateur", editUtilisateur.value.id_utilisateur);

      if (groupError) {
        console.error("Erreur lors de la mise à jour du groupe de l'utilisateur:", groupError.message);
        alert("Une erreur est survenue lors de la mise à jour du groupe de l'utilisateur.");
      } else {
        fetchUtilisateurs();
        closeEditModal();
      }
    }
  } catch (error) {
    console.error("Erreur lors du hachage du mot de passe:", error);
    alert("Une erreur est survenue lors du hachage du mot de passe.");
  }
};

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedUsers.value = utilisateurs.value.map((utilisateur) => utilisateur.id_utilisateur);
  } else {
    selectedUsers.value = [];
  }
};

const searchUser = () => {
  filteredUtilisateurs.value = utilisateurs.value.filter((utilisateur) =>
    utilisateur.pseudo.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};

const filteredUtilisateurs = computed(() => {
  return utilisateurs.value.filter((utilisateur) =>
    utilisateur.pseudo.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(() => {
  fetchUtilisateurs();
  fetchGroupes();
  currentUser.value = JSON.parse(localStorage.getItem('currentUser'));
});
</script>

<style scoped>
header {
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  padding: 20px;
  text-align: center;
  border-radius: 7px;
}

button {
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  border: none;
  padding: 10px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin: 5px;
  border-radius: 5px;
}

button:hover {
  background-color: #9e66d3;
}

input[type="text"] {
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 15px;
  width: 300px;
}

.table-container {
  max-height: 450px;
  overflow-y: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.data-table th {
  background-color: #f4f4f4;
  position: sticky;
  top: 0;
  z-index: 1;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.modal-content {
  text-align: center;
}

.modal button {
  margin-top: 20px;
}
</style>
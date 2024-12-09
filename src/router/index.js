import { createRouter, createWebHistory } from 'vue-router';
import Administrateur from '../components/Administrateur.vue';
import Collaborateur from '../components/Collaborateur.vue';

// Sous-composants pour les sections
import Utilisateurs from '../components/Utilisateur.vue';
import Questionnaires from '../components/Questionnaires.vue';
import Dashboard from '../components/Dashboard.vue';
import Correction from '../components/Correction.vue';

/// sous composants sections
import EditQuestions from '../components/EditQuestions.vue';
import Evaluation from '../components/Evaluation.vue';

import ListeCorrection from '../components/ListeCorrection.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../App.vue'),
  },
  {
    path: '/administrateur',
    component: Administrateur,
    children: [
      {
        path: 'utilisateurs',
        name: 'Utilisateurs',
        component: Utilisateurs,
      },
      {
        path: 'questionnaires',
        name: 'Questionnaires',
        component: Questionnaires,
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'correction',
        name: 'Correction',
        component: ListeCorrection,
      },
    ],
  },
  {
    path: '/collaborateur',
    name: 'Collaborateur',
    component: Collaborateur,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});



export default router;
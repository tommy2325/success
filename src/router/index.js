import { createRouter, createWebHistory } from 'vue-router';
import Administrateur from '../components/Administrateur.vue';

// Sous-composants pour les sections
import Utilisateurs from '../components/Utilisateur.vue';
import Questionnaires from '../components/Questionnaires.vue';
import Dashboard from '../components/Dashboard.vue';
import Correction from '../components/Correction.vue';

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
        component: Correction,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
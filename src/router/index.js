import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import Collaborateur from '../components/Collaborateur.vue';
import Administrateur from '../components/Administrateur.vue';
import Utilisateur from '../components/Utilisateur.vue';  // Importer le composant Utilisateur
import Questionnaires from '../components/Questionnaires.vue';  // Importer le composant Questionnaires
import Dashboard from '../components/Dashboard.vue';  // Importer le composant Dashboard

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App, // Composant principal
  },
  {
    path: '/administrateur',
    name: 'Administrateur',
    component: Administrateur,
    props: true,
  },
  {
    path: '/collaborateur',
    name: 'Collaborateur',
    component: Collaborateur,
    props: true,
  },
  {
    path: '/utilisateurs',
    name: 'Utilisateur',
    component: Utilisateur,  // Route pour le composant Utilisateur
  },
  {
    path: '/questionnaires',
    name: 'Questionnaires',
    component: Questionnaires,  // Route pour le composant Questionnaires
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,  // Route pour le composant Dashboard
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard pour gérer l'accès via le code
router.beforeEach((to, from, next) => {
  if (to.path === '/' && to.query.code) {
    const code = to.query.code;

    if (code === '1234') {
      next({ name: 'Collaborateur', query: { username: 'Collaborateur' } });
    } else if (code === 'admin') {
      next({ name: 'Administrateur', query: { username: 'Administrateur' } });
    } else {
      alert("Code incorrect");
      next(false);
    }
  } else {
    next();
  }
});

export default router;

import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import Collaborateur from '../components/Collaborateur.vue';
import Administrateur from '../components/Administrateur.vue';
import Utilisateur from '../components/Utilisateur.vue';
import Questionnaires from '../components/Questionnaires.vue';
import Dashboard from '../components/Dashboard.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App,
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
    component: Utilisateur,
  },
  {
    path: '/questionnaires',
    name: 'Questionnaires',
    component: Questionnaires,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

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

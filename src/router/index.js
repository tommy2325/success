import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import Collaborateur from '../components/Collaborateur.vue';
import Administrateur from '../components/Administrateur.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
  },
  {
    path: '/administrateur',
    name: 'Administrateur',
    component: Administrateur,
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

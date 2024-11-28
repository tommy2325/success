import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import Collaborateur from '../components/Collaborateur.vue';
import Administrateur from '../components/Administrateur.vue';
import Utilisateur from '../components/Utilisateur.vue';
import Questionnaires from '../components/Questionnaires.vue';
import Dashboard from '../components/Dashboard.vue';
import EditQuestions from '../components/EditQuestions.vue';
import Evaluation from '../components/Evaluation.vue';

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
  {
    path: '/edit-questions/:questionnaireId',
    name: 'EditQuestions',
    component: EditQuestions,
    props: true,
  },
  {
    path: '/evaluation/:questionnaireId',
    name: 'Evaluation',
    component: Evaluation,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
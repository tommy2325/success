import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Vérifier la session
const storedSession = localStorage.getItem('session');
if (storedSession) {
  const sessionData = JSON.parse(storedSession);
  // Rediriger selon le rôle stocké
  if (sessionData.role === 'administrateur') {
    router.push('/administrateur');
  } else if (sessionData.role === 'collaborateur') {
    router.push('/collaborateur');
  }
}

const app = createApp(App);
app.use(router);
app.mount('#app');

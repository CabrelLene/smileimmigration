import { createRouter, createWebHistory } from '@ionic/vue-router';
import Home from '@/views/Home.vue';
import Evaluation from '@/views/Evaluation.vue';
import Programmes from '@/views/Programmes.vue';
import ProgrammeDetail from '@/views/ProgrammeDetail.vue';
import Profil from '@/views/Profil.vue';
import Progression from '@/views/Progression.vue';
import Simulation from '@/views/Simulation.vue';
import Login from '@/views/Auth/Login.vue';
import Signup from '@/views/Auth/Signup.vue';

import { auth } from '@/services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home, name: 'home' },
    { path: '/evaluation', component: Evaluation, name: 'evaluation' },
    { path: '/programmes', component: Programmes, name: 'programmes' },
    { path: '/programme/:slug', component: ProgrammeDetail, name: 'programme-detail' },
    { path: '/profil', component: Profil, name: 'profil', meta: { auth: true } },
    { path: '/progression', component: Progression, name: 'progression', meta: { auth: true } },
    { path: '/simulation', component: Simulation, name: 'simulation', meta: { auth: true } },
    { path: '/login', component: Login, name: 'login' },
    { path: '/signup', component: Signup, name: 'signup' },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
});

// Guard simple qui attend la résolution initiale d'auth
const getCurrentUser = () =>
  new Promise((resolve) => {
    const remove = onAuthStateChanged(auth, (u) => { remove(); resolve(u); });
  });

router.beforeEach(async (to) => {
  if (!to.meta.auth) return true;
  const u = await getCurrentUser();
  if (!u) return { name: 'login', query: { next: to.fullPath } };
  return true;
});

export default router;

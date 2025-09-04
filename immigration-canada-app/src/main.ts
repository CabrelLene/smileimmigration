import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/display.css';

import './theme/variables.css';
import './theme/theme.css';

import { useAuthStore } from './store/auth.ts';

const app = createApp(App);
const pinia = createPinia();

app.use(IonicVue).use(pinia).use(router);

// démarre l'écoute de l'état Firebase Auth
const authStore = useAuthStore();
authStore.init();

router.isReady().then(() => app.mount('#app'));

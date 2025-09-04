<template>
  <ion-page>
    <ion-content class="page">
      <div class="wrap glass">
        <h2>Connexion</h2>
        <form class="form" @submit.prevent="submit">
          <ion-item class="it">
            <ion-label position="stacked">Email</ion-label>
            <ion-input type="email" v-model="email" required />
          </ion-item>
          <ion-item class="it">
            <ion-label position="stacked">Mot de passe</ion-label>
            <ion-input type="password" v-model="password" required />
          </ion-item>
          <div v-if="auth.error" class="err">{{ auth.error }}</div>
          <div class="actions">
            <ion-button :disabled="auth.loading" type="submit">Se connecter</ion-button>
            <ion-button fill="clear" @click="$router.push({name:'signup'})">Créer un compte</ion-button>
          </div>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRoute, useRouter } from 'vue-router';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const email = ref('');
const password = ref('');

async function submit() {
  const ok = await auth.signIn(email.value, password.value);
  if (ok) {
    const next = (route.query.next as string) || '/profil';
    router.push(next);
  }
}
</script>

<style scoped>
.page { padding: 26px 14px 80px; }
.wrap { max-width: 520px; margin: 0 auto; padding: 18px; }
.form { display:grid; gap: 12px; }
.it { --background: transparent; border-radius: 14px; }
.actions { display:flex; gap: 10px; justify-content:flex-end; }
.err { color: #ff7b7b; font-weight: 600; }
</style>

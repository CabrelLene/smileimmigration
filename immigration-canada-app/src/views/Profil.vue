<template>
  <ion-page>
    <ion-content class="page">
      <div class="wrap glass">
        <header class="head">
          <h2>Mon profil</h2>
          <div class="right">
            <ion-button size="small" fill="outline" @click="logout">Se déconnecter</ion-button>
            <ion-button size="small" @click="save" :disabled="saving">Enregistrer</ion-button>
          </div>
        </header>

        <form class="form">
          <ion-item class="it">
            <ion-label position="stacked">Prénom</ion-label>
            <ion-input v-model="firstName" />
          </ion-item>

          <ion-item class="it">
            <ion-label position="stacked">Âge</ion-label>
            <ion-input type="number" v-model.number="age" />
          </ion-item>

          <ion-item class="it">
            <ion-label position="stacked">Niveau d’études</ion-label>
            <ion-select v-model="education" interface="popover">
              <ion-select-option value="secondaire">Secondaire</ion-select-option>
              <ion-select-option value="college">Collège</ion-select-option>
              <ion-select-option value="bachelor">Baccalauréat</ion-select-option>
              <ion-select-option value="master">Maîtrise</ion-select-option>
              <ion-select-option value="phd">Doctorat</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item class="it">
            <ion-label position="stacked">Expérience (années)</ion-label>
            <ion-input type="number" v-model.number="yearsExperience" />
          </ion-item>

          <ion-item class="it">
            <ion-label position="stacked">Expérience au Canada (années)</ion-label>
            <ion-input type="number" v-model.number="canadaExperience" />
          </ion-item>

          <ion-item class="it">
            <ion-label position="stacked">Province d’intérêt</ion-label>
            <ion-input v-model="provinceInterest" placeholder="ex: QC, ON, BC..." />
          </ion-item>
        </form>

        <div class="hint" v-if="saved">✅ Profil enregistré.</div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton
} from '@ionic/vue';
import { ref, watchEffect } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useUserStore } from '@/store/user';

const auth = useAuthStore();
const userStore = useUserStore();

const firstName = ref<string>('');
const age = ref<number | undefined>();
const education = ref<any>(null);
const yearsExperience = ref<number | undefined>();
const canadaExperience = ref<number | undefined>();
const provinceInterest = ref<string>('');

watchEffect(() => {
  const p = auth.profile;
  if (!p) return;
  firstName.value = (p.firstName || '') as string;
  age.value = p.age;
  education.value = p.education ?? null;
  yearsExperience.value = p.yearsExperience;
  canadaExperience.value = p.canadaExperience;
  provinceInterest.value = p.provinceInterest || '';
});

const saving = ref(false);
const saved = ref(false);

async function save() {
  if (!auth.user) return;
  saving.value = true; saved.value = false;
  await auth.saveProfile({
    firstName: firstName.value || undefined,
    age: age.value,
    education: education.value || null,
    yearsExperience: yearsExperience.value ?? 0,
    canadaExperience: canadaExperience.value ?? 0,
    provinceInterest: provinceInterest.value || null
  });
  // Répercute aussi dans le store d'évaluation
  if (age.value) userStore.set('age', age.value);
  if (education.value) userStore.set('education', education.value);
  userStore.set('yearsExperience', yearsExperience.value ?? 0);
  userStore.set('canadaExperience', canadaExperience.value ?? 0);
  if (provinceInterest.value) userStore.set('provinceInterest', provinceInterest.value);
  saving.value = false; saved.value = true;
}

function logout() {
  auth.signOut();
}
</script>

<style scoped>
.page { padding: 26px 14px 80px; }
.wrap { max-width: 780px; margin: 0 auto; padding: 18px; }
.head { display:flex; align-items:center; justify-content:space-between; margin-bottom: 12px; }
.form { display:grid; gap: 12px; grid-template-columns: repeat(2, minmax(0,1fr)); }
.it { --background: transparent; border-radius: 14px; }
.hint { margin-top: 10px; opacity: .9; }
.right { display:flex; gap: 10px; }
@media (max-width: 820px) { .form { grid-template-columns: 1fr; } }
</style>

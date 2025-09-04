<template>
  <ion-page>
    <ion-content class="page">
      <div class="container">

        <!-- En-tête -->
        <header class="head">
          <div class="title">
            <h2 class="hero-title">Mon profil</h2>
            <p class="sub">Garde tes informations à jour pour des recommandations plus précises.</p>
          </div>
          <div class="actions-head">
            <ion-button size="small" fill="outline" @click="logout">Se déconnecter</ion-button>
            <ion-button size="small" @click="save" :disabled="saving">Enregistrer</ion-button>
          </div>
        </header>

        <!-- Bloc Identité -->
        <section class="glass card section">
          <h3>Identité</h3>
          <div class="grid-3">
            <ion-item class="it">
              <ion-label position="stacked">Prénom</ion-label>
              <ion-input v-model="firstName" placeholder="Ex: Alex" />
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">Email</ion-label>
              <ion-input :value="auth.user?.email || ''" disabled />
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">Province d’intérêt</ion-label>
              <ion-input v-model="provinceInterest" placeholder="ex : QC, ON, BC…" />
            </ion-item>
          </div>
        </section>

        <!-- Bloc Profil d’immigration -->
        <section class="glass card section">
          <h3>Profil d’immigration</h3>
          <div class="grid-4">
            <ion-item class="it">
              <ion-label position="stacked">Âge</ion-label>
              <ion-input type="number" inputmode="numeric" v-model.number="age" placeholder="Ex: 28" />
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">Études</ion-label>
              <ion-select v-model="education" interface="popover" placeholder="Sélectionner">
                <ion-select-option value="secondaire">Secondaire</ion-select-option>
                <ion-select-option value="college">Collège</ion-select-option>
                <ion-select-option value="bachelor">Baccalauréat</ion-select-option>
                <ion-select-option value="master">Maîtrise</ion-select-option>
                <ion-select-option value="phd">Doctorat</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">Expérience (années)</ion-label>
              <ion-input type="number" inputmode="numeric" v-model.number="yearsExperience" placeholder="Ex: 4" />
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">Expérience au Canada (années)</ion-label>
              <ion-input type="number" inputmode="numeric" v-model.number="canadaExperience" placeholder="Ex: 0" />
            </ion-item>
          </div>

          <div class="hint">
            <small>Ces infos aident à calculer ton admissibilité globale (ex. Entrée Express, PNP).</small>
          </div>
        </section>

        <!-- Bloc Langue (aperçu) -->
        <section class="glass card section">
          <h3>Langue — aperçu</h3>
          <div class="lang-grid">
            <div class="pill">Test: <strong>{{ userStore.profile.language.test ?? '—' }}</strong></div>
            <div class="pill">Lecture: <strong>{{ userStore.profile.language.reading ?? '—' }}</strong></div>
            <div class="pill">Écriture: <strong>{{ userStore.profile.language.writing ?? '—' }}</strong></div>
            <div class="pill">Compr. orale: <strong>{{ userStore.profile.language.listening ?? '—' }}</strong></div>
            <div class="pill">Expression orale: <strong>{{ userStore.profile.language.speaking ?? '—' }}</strong></div>
          </div>
          <div class="lang-actions">
            <ion-button size="small" fill="clear" @click="$router.push({name:'evaluation'})">
              Mettre à jour mes scores
            </ion-button>
          </div>
        </section>

        <!-- Barre d’actions persistantes (mobile-friendly) -->
        <div class="actions-bottom">
          <ion-button class="cta" @click="save" :disabled="saving">Enregistrer</ion-button>
          <span class="saved" v-if="saved">✅ Profil enregistré</span>
        </div>

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

  // Sync vers le store “évaluation” pour cohérence immédiate
  if (age.value) userStore.set('age', age.value);
  if (education.value) userStore.set('education', education.value);
  userStore.set('yearsExperience', yearsExperience.value ?? 0);
  userStore.set('canadaExperience', canadaExperience.value ?? 0);
  if (provinceInterest.value) userStore.set('provinceInterest', provinceInterest.value);

  saving.value = false; saved.value = true;
  setTimeout(() => (saved.value = false), 2500);
}

function logout() {
  auth.signOut();
}
</script>

<style scoped>
.page { padding: 26px 14px 100px; }

.head {
  display:flex; align-items:flex-end; justify-content:space-between; gap: 16px;
  margin: 8px 0 16px;
}
.sub { opacity:.9; margin-top: 6px; }
.actions-head { display:flex; gap: 10px; align-items:center; }

.section { margin-top: 16px; }
.section h3 { margin: 0 0 12px; font-weight: 800; letter-spacing: -.02em; }

.grid-3 { display:grid; gap: 12px; grid-template-columns: repeat(3, minmax(0,1fr)); }
.grid-4 { display:grid; gap: 12px; grid-template-columns: repeat(4, minmax(0,1fr)); }

@media (max-width: 1100px){ .grid-4 { grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width: 820px){
  .grid-3, .grid-4 { grid-template-columns: 1fr; }
  .actions-head { display: none; }
}

.it { --background: transparent; border-radius: var(--r-lg); }

.hint { margin-top: 8px; opacity: .9; }

.lang-grid {
  display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px;
}
.pill {
  padding: 6px 10px; border-radius: 999px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  font-size: .92rem;
}
.lang-actions { display:flex; justify-content:flex-end; margin-top: 8px; }

.actions-bottom {
  position: sticky; bottom: 12px; display:flex; gap: 12px; align-items:center; justify-content:flex-end;
  margin-top: 18px; padding: 8px 10px;
}
.actions-bottom .cta {
  background: linear-gradient(180deg, #7dd3fc, #60a5fa); color:#0b1220; font-weight: 800;
  border-radius: 14px; box-shadow: 0 8px 24px rgba(96,165,250,.35);
}
.saved { font-size: .95rem; opacity: .9; }
</style>

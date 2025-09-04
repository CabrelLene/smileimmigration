<template>
  <ion-page>
    <ion-content :fullscreen="true" class="page">
      <div class="container">

        <!-- En-tête -->
        <header class="head">
          <div class="title">
            <h2 class="hero-title">Évaluation d’admissibilité</h2>
            <p class="sub">Renseigne ton profil et tes scores de langue — on calcule ton CLB et on suggère les programmes adaptés.</p>
          </div>
          <progress-bar :percent="store.profile.progress" />
        </header>

        <!-- Bloc Profil -->
        <section class="glass card form-section">
          <h3>Ton profil</h3>
          <div class="grid-2">
            <ion-item class="it">
              <ion-label position="stacked">Âge</ion-label>
              <ion-input type="number" inputmode="numeric" placeholder="Ex: 28" v-model.number="age"/>
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">Niveau d’études</ion-label>
              <ion-select interface="popover" v-model="education" placeholder="Sélectionner">
                <ion-select-option value="secondaire">Secondaire</ion-select-option>
                <ion-select-option value="college">Collège</ion-select-option>
                <ion-select-option value="bachelor">Baccalauréat</ion-select-option>
                <ion-select-option value="master">Maîtrise</ion-select-option>
                <ion-select-option value="phd">Doctorat</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">Expérience pro (années)</ion-label>
              <ion-input type="number" inputmode="numeric" placeholder="Ex: 3" v-model.number="yearsExperience"/>
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">Expérience au Canada (années)</ion-label>
              <ion-input type="number" inputmode="numeric" placeholder="Ex: 0" v-model.number="canadaExperience"/>
            </ion-item>
          </div>
        </section>

        <!-- Bloc Langue -->
        <section class="glass card form-section">
          <div class="sec-head">
            <h3>Compétences linguistiques</h3>
            <div class="clb-pill" v-if="overallCLB !== null">
              CLB moyen: <strong>{{ overallCLB }}</strong>
            </div>
          </div>

          <div class="grid-3 compact-top">
            <ion-item class="it">
              <ion-label position="stacked">Test</ion-label>
              <ion-select interface="popover" v-model="test" placeholder="Choisir un test">
                <ion-select-option value="IELTS">IELTS (EN)</ion-select-option>
                <ion-select-option value="CELPIP">CELPIP (EN)</ion-select-option>
                <ion-select-option value="TEF">TEF Canada (FR)</ion-select-option>
                <ion-select-option value="TCF">TCF Canada (FR)</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item class="it" v-if="test==='TEF'">
              <ion-label position="stacked">Période TEF</ion-label>
              <ion-select interface="popover" v-model="tefEra">
                <ion-select-option value="after_2023_12_10">Après le 10 déc. 2023</ion-select-option>
                <ion-select-option value="era_2019_10_to_2023_12_10">1 oct. 2019 → 10 déc. 2023</ion-select-option>
                <ion-select-option value="before_2019_09_30">Avant le 30 sept. 2019</ion-select-option>
              </ion-select>
            </ion-item>

            <div class="it hintbox" v-if="test">
              <div class="mini">
                <template v-if="test==='IELTS'">
                  <span>IELTS :</span> entre des bandes (ex: 6.5, 7, 7.5…). Conversion CLB auto.
                </template>
                <template v-else-if="test==='CELPIP'">
                  <span>CELPIP :</span> le niveau (4–12) correspond au CLB.
                </template>
                <template v-else-if="test==='TEF'">
                  <span>TEF :</span> saisis les <b>scores /699</b> (ou anciens scores) selon la période.
                </template>
                <template v-else-if="test==='TCF'">
                  <span>TCF :</span> Lecture/Écoute sur 699, Écriture/Oral niveaux <b>1–20</b>.
                </template>
              </div>
            </div>
          </div>

          <!-- Inputs compétences -->
          <div class="grid-4">
            <ion-item class="it">
              <ion-label position="stacked">
                Lecture
                <small class="help" v-if="test==='TCF'">TCF: 342–699</small>
                <small class="help" v-else-if="test==='TEF'">TEF: (300–699) selon période</small>
              </ion-label>
              <ion-input
                type="number"
                :step="stepReading"
                :min="minReading"
                :max="maxReading"
                v-model.number="reading"
                :placeholder="phReading"
                @ionBlur="recalcCLB"
              />
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">
                Écriture
                <small class="help" v-if="test==='TCF'">TCF: niveau 1–20</small>
                <small class="help" v-else-if="test==='TEF'">TEF: (300–699) ou 268–699</small>
              </ion-label>
              <ion-input
                type="number"
                :step="stepWriting"
                :min="minWriting"
                :max="maxWriting"
                v-model.number="writing"
                :placeholder="phWriting"
                @ionBlur="recalcCLB"
              />
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">
                Compréhension orale
                <small class="help" v-if="test==='TCF'">TCF: 331–699</small>
                <small class="help" v-else-if="test==='TEF'">TEF: (300–699) ou 306–699</small>
              </ion-label>
              <ion-input
                type="number"
                :step="stepListening"
                :min="minListening"
                :max="maxListening"
                v-model.number="listening"
                :placeholder="phListening"
                @ionBlur="recalcCLB"
              />
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">
                Expression orale
                <small class="help" v-if="test==='TCF'">TCF: niveau 1–20</small>
                <small class="help" v-else-if="test==='TEF'">TEF: (300–699) ou 328–699</small>
              </ion-label>
              <ion-input
                type="number"
                :step="stepSpeaking"
                :min="minSpeaking"
                :max="maxSpeaking"
                v-model.number="speaking"
                :placeholder="phSpeaking"
                @ionBlur="recalcCLB"
              />
            </ion-item>
          </div>

          <div class="tips">
            <small v-if="test==='TEF'">ℹ️ Les équivalences changent selon la période; vérifie la date de ton test.</small>
            <small v-if="test==='TCF'">⚠️ Écriture/Oral en <b>niveaux (1–20)</b>, pas sur 699.</small>
          </div>
        </section>

        <!-- Actions -->
        <div class="actions">
          <button class="btn-primary" @click="submit">Voir mes programmes</button>
          <ion-button fill="clear" size="default" @click="resetForm">Réinitialiser</ion-button>
        </div>

        <!-- Résultats -->
        <section v-if="suggestions.length" class="glass card results">
          <h3>Meilleures correspondances</h3>
          <div class="list">
            <card-programme
              v-for="s in suggestions"
              :key="s.key"
              :title="s.title"
              :reason="s.reason"
              :score="s.score"
              :slug="s.slug"
            />
          </div>
        </section>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonContent, IonItem, IonInput,
  IonSelect, IonSelectOption, IonLabel, IonButton
} from '@ionic/vue';
import ProgressBar from '@/components/ProgressBar.vue';
import CardProgramme from '@/components/CardProgramme.vue';
import { useUserStore } from '@/store/user';
import { ref, computed, watch } from 'vue';
import { suggestPrograms } from '@/services/eligibility';
import {
  ieltsAllToCLB, celpipAllToCLB, fromDirectCLB,
  tefAllToCLB, tcfAllToCLB, type TefEra
} from '@/services/clb';

const store = useUserStore();

// champs profil
const age = ref<number | undefined>(store.profile.age);
const education = ref<any>(store.profile.education ?? null);
const yearsExperience = ref<number | undefined>(store.profile.yearsExperience);
const canadaExperience = ref<number | undefined>(store.profile.canadaExperience);

// langue
const test = ref<'IELTS' | 'TEF' | 'TCF' | 'CELPIP' | null>(store.profile.language.test ?? null);
const tefEra = ref<TefEra>('after_2023_12_10');

const reading = ref<number | undefined>();
const writing = ref<number | undefined>();
const listening = ref<number | undefined>();
const speaking = ref<number | undefined>();

const suggestions = ref<any[]>([]);
const overallCLB = ref<number | null>(null);

// placeholders & contraintes dynamiques
const phReading   = computed(() => test.value==='IELTS' ? 'Ex: 7'   : test.value==='TCF' ? 'Ex: 520' : 'Ex: 500');
const phWriting   = computed(() => test.value==='IELTS' ? 'Ex: 6.5' : test.value==='TCF' ? 'Ex: 12'  : 'Ex: 480');
const phListening = computed(() => test.value==='IELTS' ? 'Ex: 7.5' : test.value==='TCF' ? 'Ex: 510' : 'Ex: 480');
const phSpeaking  = computed(() => test.value==='IELTS' ? 'Ex: 6'   : test.value==='TCF' ? 'Ex: 13'  : 'Ex: 470');

const stepReading   = computed(() => test.value==='IELTS' ? 0.5 : 1);
const stepWriting   = computed(() => test.value==='IELTS' ? 0.5 : (test.value==='TCF' ? 1 : 1));
const stepListening = computed(() => test.value==='IELTS' ? 0.5 : 1);
const stepSpeaking  = computed(() => test.value==='IELTS' ? 0.5 : (test.value==='TCF' ? 1 : 1));

const minReading   = computed(() => test.value==='TCF' ? 342 : undefined);
const maxReading   = computed(() => test.value==='TCF' ? 699 : undefined);
const minWriting   = computed(() => test.value==='TCF' ? 1   : undefined);
const maxWriting   = computed(() => test.value==='TCF' ? 20  : undefined);
const minListening = computed(() => test.value==='TCF' ? 331 : undefined);
const maxListening = computed(() => test.value==='TCF' ? 699 : undefined);
const minSpeaking  = computed(() => test.value==='TCF' ? 1   : undefined);
const maxSpeaking  = computed(() => test.value==='TCF' ? 20  : undefined);

function recalcCLB() {
  let v: number | null = null;
  if (reading.value && writing.value && listening.value && speaking.value) {
    if (test.value === 'IELTS') {
      v = ieltsAllToCLB({ reading: reading.value, writing: writing.value, listening: listening.value, speaking: speaking.value }).overall;
    } else if (test.value === 'CELPIP') {
      v = celpipAllToCLB({ reading: reading.value, writing: writing.value, listening: listening.value, speaking: speaking.value }).overall;
    } else if (test.value === 'TEF') {
      v = tefAllToCLB({ reading: reading.value, writing: writing.value, listening: listening.value, speaking: speaking.value }, tefEra.value).overall;
    } else if (test.value === 'TCF') {
      v = tcfAllToCLB({ reading: reading.value, writing: writing.value, listening: listening.value, speaking: speaking.value }).overall;
    } else {
      v = fromDirectCLB({ reading: reading.value, writing: writing.value, listening: listening.value, speaking: speaking.value }).overall;
    }
  }
  overallCLB.value = v;
}

watch([test, reading, writing, listening, speaking, tefEra], recalcCLB);

function submit() {
  // persist profil de base
  store.set('age', age.value);
  store.set('education', education.value);
  store.set('yearsExperience', yearsExperience.value ?? 0);
  store.set('canadaExperience', canadaExperience.value ?? 0);
  store.setLanguage({
    test: test.value,
    reading: reading.value,
    writing: writing.value,
    listening: listening.value,
    speaking: speaking.value
  });

  // calcule CLB si pas déjà fait
  recalcCLB();

  suggestions.value = suggestPrograms({
    age: age.value,
    education: education.value,
    yearsExperience: yearsExperience.value,
    canadaExperience: canadaExperience.value,
    language: { CLB: overallCLB.value ?? 0 }
  });
}

function resetForm() {
  age.value = store.profile.age ?? undefined;
  education.value = store.profile.education ?? null;
  yearsExperience.value = store.profile.yearsExperience ?? undefined;
  canadaExperience.value = store.profile.canadaExperience ?? undefined;

  reading.value = writing.value = listening.value = speaking.value = undefined;
  test.value = store.profile.language.test ?? null;
  tefEra.value = 'after_2023_12_10';
  overallCLB.value = null;
  suggestions.value = [];
}
</script>

<style scoped>
.page { padding: 26px 14px 90px; }

.head {
  display:flex; align-items:flex-end; justify-content:space-between; gap: 16px;
  margin: 8px 0 16px;
}
.title .sub { opacity:.9; margin-top: 6px; }

.form-section { margin-top: 14px; }
.form-section h3 { margin: 0 0 12px; font-weight: 800; letter-spacing: -.02em; }

.grid-2 { display:grid; gap: 12px; grid-template-columns: repeat(2, minmax(0,1fr)); }
.grid-3 { display:grid; gap: 12px; grid-template-columns: repeat(3, minmax(0,1fr)); }
.grid-4 { display:grid; gap: 12px; grid-template-columns: repeat(4, minmax(0,1fr)); }

@media (max-width: 980px){
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
}

.it { --background: transparent; border-radius: var(--r-lg); }
.compact-top { margin-top: -2px; }

.hintbox {
  display:flex; align-items:center; padding: 8px 12px;
  background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
  border-radius: var(--r-lg);
}
.hintbox .mini { font-size: .92rem; opacity:.95; }
.hintbox .mini span { font-weight: 700; }

.help { display:block; font-size:.78rem; opacity:.85; margin-top: 2px; }

.sec-head { display:flex; align-items:center; justify-content:space-between; margin-bottom: 8px; }
.clb-pill {
  font-size: .95rem;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(125,211,252,.15);
  border: 1px solid rgba(125,211,252,.35);
}

.actions {
  margin: 14px 0 6px;
  display:flex; gap: 10px; justify-content:flex-end; align-items:center;
}

.results { margin-top: 16px; }
.list { display:grid; grid-template-columns: 1fr; gap: 10px; }
</style>

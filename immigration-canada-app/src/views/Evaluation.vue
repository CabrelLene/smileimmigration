<template>
  <ion-page>
    <ion-content :fullscreen="true" class="page">
      <div class="wrap glass">
        <header class="head">
          <h2>Évaluation d’admissibilité</h2>
          <progress-bar :percent="store.profile.progress" />
        </header>

        <form class="form" @submit.prevent="submit">
          <div class="row">
            <ion-item class="it">
              <ion-label position="stacked">Âge</ion-label>
              <ion-input type="number" placeholder="Ex: 28" v-model.number="age"/>
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">Niveau d’études</ion-label>
              <ion-select interface="popover" v-model="education">
                <ion-select-option value="secondaire">Secondaire</ion-select-option>
                <ion-select-option value="college">Collège</ion-select-option>
                <ion-select-option value="bachelor">Baccalauréat</ion-select-option>
                <ion-select-option value="master">Maîtrise</ion-select-option>
                <ion-select-option value="phd">Doctorat</ion-select-option>
              </ion-select>
            </ion-item>
          </div>

          <div class="row">
            <ion-item class="it">
              <ion-label position="stacked">Expérience pro (années)</ion-label>
              <ion-input type="number" placeholder="Ex: 3" v-model.number="yearsExperience"/>
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">Expérience au Canada (années)</ion-label>
              <ion-input type="number" placeholder="Ex: 0" v-model.number="canadaExperience"/>
            </ion-item>
          </div>

          <div class="row">
            <ion-item class="it">
              <ion-label position="stacked">Test de langue</ion-label>
              <ion-select interface="popover" v-model="test">
                <ion-select-option value="IELTS">IELTS (en)</ion-select-option>
                <ion-select-option value="CELPIP">CELPIP (en)</ion-select-option>
                <ion-select-option value="TEF">TEF Canada (fr)</ion-select-option>
                <ion-select-option value="TCF">TCF Canada (fr)</ion-select-option>
              </ion-select>
            </ion-item>

            <!-- Époque TEF (obligatoire pour un mapping exact) -->
            <ion-item class="it" v-if="test==='TEF'">
              <ion-label position="stacked">Quand as-tu passé le TEF ?</ion-label>
              <ion-select interface="popover" v-model="tefEra">
                <ion-select-option value="after_2023_12_10">Après le 10 déc. 2023</ion-select-option>
                <ion-select-option value="era_2019_10_to_2023_12_10">Du 1 oct. 2019 au 10 déc. 2023</ion-select-option>
                <ion-select-option value="before_2019_09_30">Avant le 30 sept. 2019 (ancien score)</ion-select-option>
              </ion-select>
            </ion-item>
          </div>

          <!-- SAISIE DES 4 COMPÉTENCES -->
          <div class="row four">
            <ion-item class="it">
              <ion-label position="stacked">
                Lecture (Reading)
                <span class="hint-mini" v-if="test==='TEF'">TEF: 300–699 (selon époque)</span>
                <span class="hint-mini" v-else-if="test==='TCF'">TCF: 342–699</span>
              </ion-label>
              <ion-input
                type="number"
                step="1"
                :min="test==='TCF' ? 342 : undefined"
                :max="test==='TCF' ? 699 : undefined"
                v-model.number="reading"
                :placeholder="test==='TCF' ? 'Ex: 520' : (test==='IELTS' ? 'Ex: 7' : 'Ex: 500')"
              />
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">
                Écriture (Writing)
                <span class="hint-mini" v-if="test==='TEF'">TEF: 300–699 (ou 268–699)</span>
                <span class="hint-mini" v-else-if="test==='TCF'">TCF: niveau 1–20</span>
              </ion-label>
              <ion-input
                :type="test==='TCF' ? 'number' : 'number'"
                :step="test==='TCF' ? 1 : 0.5"
                :min="test==='TCF' ? 1 : undefined"
                :max="test==='TCF' ? 20 : undefined"
                v-model.number="writing"
                :placeholder="test==='TCF' ? 'Ex: 12' : (test==='IELTS' ? 'Ex: 6.5' : 'Ex: 480')"
              />
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">
                Compréhension orale (Listening)
                <span class="hint-mini" v-if="test==='TEF'">TEF: 300–699 (ou 306–699)</span>
                <span class="hint-mini" v-else-if="test==='TCF'">TCF: 331–699</span>
              </ion-label>
              <ion-input
                type="number"
                step="1"
                :min="test==='TCF' ? 331 : undefined"
                :max="test==='TCF' ? 699 : undefined"
                v-model.number="listening"
                :placeholder="test==='TCF' ? 'Ex: 510' : (test==='IELTS' ? 'Ex: 7.5' : 'Ex: 480')"
              />
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">
                Expression orale (Speaking)
                <span class="hint-mini" v-if="test==='TEF'">TEF: 300–699 (ou 328–699)</span>
                <span class="hint-mini" v-else-if="test==='TCF'">TCF: niveau 1–20</span>
              </ion-label>
              <ion-input
                :type="test==='TCF' ? 'number' : 'number'"
                :step="test==='TCF' ? 1 : 0.5"
                :min="test==='TCF' ? 1 : undefined"
                :max="test==='TCF' ? 20 : undefined"
                v-model.number="speaking"
                :placeholder="test==='TCF' ? 'Ex: 13' : (test==='IELTS' ? 'Ex: 6.5' : 'Ex: 470')"
              />
            </ion-item>
          </div>

          <div class="tips">
            <small v-if="test==='TCF'">
              ⚠️ Pour le TCF Canada, **Écriture** et **Expression orale** sont des <b>niveaux 1–20</b> (pas sur 699).
            </small>
            <small v-if="test==='TEF'">
              ℹ️ IRCC exprime les équivalences TEF par périodes; choisis la période correcte pour un CLB/NCLC exact.
            </small>
          </div>

          <div class="actions">
            <ion-button class="cta" type="submit">Voir mes programmes</ion-button>
          </div>
        </form>

        <section v-if="suggestions.length" class="results">
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
import { ref } from 'vue';
import { suggestPrograms } from '@/services/eligibility';
import {
  ieltsAllToCLB, celpipAllToCLB, fromDirectCLB,
  tefAllToCLB, tcfAllToCLB, type TefEra
} from '@/services/clb';

const store = useUserStore();

const age = ref<number | undefined>(store.profile.age);
const education = ref<any>(store.profile.education ?? null);
const yearsExperience = ref<number | undefined>(store.profile.yearsExperience);
const canadaExperience = ref<number | undefined>(store.profile.canadaExperience);

const test = ref<'IELTS' | 'TEF' | 'TCF' | 'CELPIP' | null>(store.profile.language.test ?? null);
const tefEra = ref<TefEra>('after_2023_12_10');

const reading = ref<number | undefined>();
const writing = ref<number | undefined>();
const listening = ref<number | undefined>();
const speaking = ref<number | undefined>();

const suggestions = ref<any[]>([]);

function submit() {
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

  let overallCLB = 0;

  if (test.value === 'IELTS' && reading.value && writing.value && listening.value && speaking.value) {
    overallCLB = ieltsAllToCLB({
      reading: reading.value, writing: writing.value, listening: listening.value, speaking: speaking.value
    }).overall;
  } else if (test.value === 'CELPIP' && reading.value && writing.value && listening.value && speaking.value) {
    overallCLB = celpipAllToCLB({
      reading: reading.value, writing: writing.value, listening: listening.value, speaking: speaking.value
    }).overall;
  } else if (test.value === 'TEF' && reading.value && writing.value && listening.value && speaking.value) {
    overallCLB = tefAllToCLB({
      reading: reading.value, writing: writing.value, listening: listening.value, speaking: speaking.value
    }, tefEra.value).overall;
  } else if (test.value === 'TCF' && reading.value && writing.value && listening.value && speaking.value) {
    overallCLB = tcfAllToCLB({
      reading: reading.value, writing: writing.value, listening: listening.value, speaking: speaking.value
    }).overall;
  } else if (test.value && reading.value && writing.value && listening.value && speaking.value) {
    // fallback: si on veut saisir directement des CLB par compétence
    overallCLB = fromDirectCLB({
      reading: reading.value, writing: writing.value, listening: listening.value, speaking: speaking.value
    }).overall;
  }

  suggestions.value = suggestPrograms({
    age: age.value,
    education: education.value,
    yearsExperience: yearsExperience.value,
    canadaExperience: canadaExperience.value,
    language: { CLB: overallCLB }
  });
}
</script>

<style scoped>
.page { padding: 26px 14px 80px; }
.wrap { max-width: 980px; margin: 0 auto; padding: 18px; }
.head { display:flex; align-items:center; justify-content:space-between; gap: 16px; margin-bottom: 12px; }
.form { display:grid; gap: 14px; }
.row { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
.row.four { grid-template-columns: repeat(2, minmax(0,1fr)); }
.it { --background: transparent; border-radius: 14px; }
.hint-mini { display:block; font-size:.74rem; opacity:.8; margin-top: 2px; }
.tips { margin-top: 6px; }
.actions { display:flex; justify-content:flex-end; margin-top: 6px; }
.results { margin-top: 18px; }
.list { display:grid; grid-template-columns: 1fr; gap: 10px; }
@media (max-width: 820px) {
  .row, .row.four { grid-template-columns: 1fr; }
}
</style>

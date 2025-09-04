<template>
  <ion-page>
    <ion-content class="page">
      <div class="wrap glass">
        <div class="head">
          <h2>Mode Simulation — “Et si…”</h2>
          <div class="actions">
            <ion-button size="small" fill="outline" @click="refreshList" :disabled="loading">Actualiser</ion-button>
          </div>
        </div>
        <p>Teste des scénarios : augmenter ton score de langue, ajouter 1 an d’expérience, etc. Sauvegarde et compare.</p>

        <!-- Widgets de simulation rapide -->
        <div class="grid">
          <div class="card">
            <h3>+0.5 sur chaque compétence (IELTS)</h3>
            <ion-button size="small" @click="simulateDelta(0.5)">Simuler</ion-button>
            <p v-if="resultA">CLB moyen ≈ <strong>{{ resultA }}</strong>.</p>
            <div class="save" v-if="resultA">
              <ion-input v-model="nameA" placeholder="Nom du scénario (ex: IELTS +0.5)"></ion-input>
              <ion-button size="small" @click="saveScenarioA">Enregistrer</ion-button>
            </div>
          </div>

          <div class="card">
            <h3>+1 an d’expérience</h3>
            <ion-button size="small" @click="simulateXP(1)">Simuler</ion-button>
            <p v-if="resultB">Score “Entrée Express” estimé: <strong>{{ resultB }}</strong>/100</p>
            <div class="save" v-if="resultB !== undefined">
              <ion-input v-model="nameB" placeholder="Nom du scénario (ex: +1 an XP)"></ion-input>
              <ion-button size="small" @click="saveScenarioB">Enregistrer</ion-button>
            </div>
          </div>
        </div>

        <!-- Liste des scénarios sauvegardés -->
        <section class="list">
          <h3>Mes scénarios sauvegardés</h3>
          <div v-if="loading" class="muted">Chargement…</div>
          <div v-else-if="!scenarios.length" class="muted">Aucun scénario pour l’instant.</div>

          <div v-for="s in scenarios" :key="s.id" class="item">
            <div class="meta">
              <strong>{{ s.name }}</strong>
              <small class="dim">
                CLB: {{ s.result.overallCLB ?? '—' }} · EE: {{ s.result.expressEntryScore ?? '—' }}
              </small>
            </div>
            <div class="buttons">
              <ion-button size="small" fill="outline" @click="loadScenario(s)">Charger</ion-button>
              <ion-button size="small" color="danger" fill="outline" @click="removeScenario(s)">Supprimer</ion-button>
            </div>
          </div>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton, IonInput } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { useAuthStore } from '@/store/auth';
import { ieltsAllToCLB } from '@/services/clb';
import { suggestPrograms } from '@/services/eligibility';
import { v4 as uuid } from 'uuid';
import {
  listSimulations, saveSimulation, deleteSimulation,
  type Simulation, type SimParams
} from '@/services/simulations';

const store = useUserStore();
const auth = useAuthStore();

const resultA = ref<number | undefined>();
const resultB = ref<number | undefined>();
const nameA = ref('IELTS +0.5');
const nameB = ref('+1 an expérience');

const scenarios = ref<Simulation[]>([]);
const loading = ref(false);

// Helpers
function baseParams(): SimParams {
  return {
    age: store.profile.age,
    education: store.profile.education,
    yearsExperience: store.profile.yearsExperience,
    canadaExperience: store.profile.canadaExperience,
    language: { ...store.profile.language }
  };
}
function calcEE(clbOverall: number | undefined) {
  // retrouve le score EE estimé depuis suggestPrograms
  const sug = suggestPrograms({
    age: store.profile.age,
    education: store.profile.education,
    yearsExperience: store.profile.yearsExperience,
    canadaExperience: store.profile.canadaExperience,
    language: { CLB: clbOverall ?? 0 }
  });
  return sug.find(s => s.key === 'express-entry')?.score;
}

// Simulations actions
function simulateDelta(delta:number) {
  const l = store.profile.language;
  if (!l.reading || !l.writing || !l.listening || !l.speaking) return;
  const clb = ieltsAllToCLB({
    reading: l.reading + delta,
    writing: l.writing + delta,
    listening: l.listening + delta,
    speaking: l.speaking + delta
  });
  resultA.value = clb.overall;
}

function simulateXP(years:number) {
  const clb =
    (store.profile.language.reading && store.profile.language.writing && store.profile.language.listening && store.profile.language.speaking)
      ? ieltsAllToCLB({
          reading: store.profile.language.reading!,
          writing: store.profile.language.writing!,
          listening: store.profile.language.listening!,
          speaking: store.profile.language.speaking!
        }).overall
      : undefined;
  const ee = suggestPrograms({
    age: store.profile.age,
    education: store.profile.education,
    yearsExperience: (store.profile.yearsExperience ?? 0) + years,
    canadaExperience: store.profile.canadaExperience,
    language: { CLB: clb ?? 0 }
  }).find(s => s.key==='express-entry')?.score;
  resultB.value = ee;
}

// Sauvegardes (Firestore si connecté, sinon localStorage)
const LS_KEY = 'simulations:list';

function loadLocal() {
  const raw = localStorage.getItem(LS_KEY);
  scenarios.value = raw ? (JSON.parse(raw) as Simulation[]) : [];
}
function saveLocal() {
  localStorage.setItem(LS_KEY, JSON.stringify(scenarios.value));
}

async function refreshList() {
  loading.value = true;
  try {
    if (auth.user) {
      scenarios.value = await listSimulations(auth.user.uid);
    } else {
      loadLocal();
    }
  } finally {
    loading.value = false;
  }
}

async function saveScenarioA() {
  if (!resultA.value) return;
  const sim: Simulation = {
    id: uuid(),
    name: nameA.value || 'IELTS +0.5',
    params: { ...baseParams(), delta: { type: 'ielts+0.5' } },
    result: { overallCLB: resultA.value, expressEntryScore: calcEE(resultA.value) }
  };
  if (auth.user) {
    await saveSimulation(auth.user.uid, sim);
  } else {
    scenarios.value = [sim, ...scenarios.value];
    saveLocal();
  }
  await refreshList();
}

async function saveScenarioB() {
  if (resultB.value === undefined) return;
  const l = store.profile.language;
  let overallCLB: number | undefined;
  if (l.reading && l.writing && l.listening && l.speaking) {
    overallCLB = ieltsAllToCLB({
      reading: l.reading, writing: l.writing, listening: l.listening, speaking: l.speaking
    }).overall;
  }
  const sim: Simulation = {
    id: uuid(),
    name: nameB.value || '+1 an XP',
    params: { ...baseParams(), delta: { type: 'xp+1' } },
    result: { overallCLB, expressEntryScore: resultB.value }
  };
  if (auth.user) {
    await saveSimulation(auth.user.uid, sim);
  } else {
    scenarios.value = [sim, ...scenarios.value];
    saveLocal();
  }
  await refreshList();
}

async function removeScenario(s: Simulation) {
  if (auth.user) {
    await deleteSimulation(auth.user.uid, s.id);
  } else {
    scenarios.value = scenarios.value.filter(x => x.id !== s.id);
    saveLocal();
  }
  await refreshList();
}

function loadScenario(s: Simulation) {
  // Recharge les paramètres dans le store utilisateur (sans persister Firestore ici)
  if (s.params.age) store.set('age', s.params.age);
  if (s.params.education) store.set('education', s.params.education);
  if (s.params.yearsExperience !== undefined) store.set('yearsExperience', s.params.yearsExperience);
  if (s.params.canadaExperience !== undefined) store.set('canadaExperience', s.params.canadaExperience);
  if (s.params.language) store.setLanguage(s.params.language);
}

onMounted(refreshList);
</script>

<style scoped>
.page { padding: 26px 14px 100px; }
.wrap { max-width: 980px; margin: 0 auto; padding: 18px; }
.head { display:flex; align-items:center; justify-content:space-between; gap: 12px; margin-bottom: 10px; }
.grid { display:grid; gap:14px; grid-template-columns: repeat(2, minmax(0,1fr)); margin-top: 12px; }
.card { padding: 14px; border-radius: 14px; background: rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.12); }
.save { display:flex; gap: 8px; align-items:center; margin-top: 10px; }
.list { margin-top: 24px; }
.item {
  display:flex; align-items:center; justify-content:space-between;
  padding: 12px; border-radius: 12px; border:1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.04); margin-bottom: 10px;
}
.meta { display:flex; flex-direction:column; gap: 2px; }
.dim { opacity:.85; }
.muted { opacity:.8; }
.buttons { display:flex; gap: 8px; }
@media (max-width: 820px){ .grid{ grid-template-columns:1fr; } }
</style>

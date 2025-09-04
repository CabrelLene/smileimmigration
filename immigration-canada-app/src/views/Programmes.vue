<template>
  <ion-page>
    <ion-content class="page">
      <div class="wrap glass">
        <header class="head">
          <h2>Programmes d’immigration</h2>
          <p class="sub">Filtre par province, type et CLB minimal conseillé.</p>
        </header>

        <!-- Filtres -->
        <div class="filters">
          <ion-item class="it">
            <ion-label position="stacked">Province</ion-label>
            <ion-select v-model="province" interface="popover">
              <ion-select-option v-for="p in provinces" :key="p.code" :value="p.code">
                {{ p.name }}
              </ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item class="it">
            <ion-label position="stacked">Type</ion-label>
            <ion-select v-model="ptype" interface="popover">
              <ion-select-option v-for="t in types" :key="t.code" :value="t.code">
                {{ t.label }}
              </ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item class="it">
            <ion-label position="stacked">CLB minimal</ion-label>
            <ion-range min="0" max="10" step="1" snaps="true" ticks="true" v-model="minCLB">
              <ion-label slot="start">0</ion-label>
              <ion-label slot="end">10</ion-label>
            </ion-range>
          </ion-item>

          <ion-item class="it search">
            <ion-label position="stacked">Recherche</ion-label>
            <ion-input v-model="q" placeholder="ex : express, étude, nomination..."></ion-input>
          </ion-item>

          <div class="sort">
            <ion-segment v-model="sortBy" value="minCLB">
              <ion-segment-button value="minCLB"><ion-label>CLB</ion-label></ion-segment-button>
              <ion-segment-button value="title"><ion-label>Titre</ion-label></ion-segment-button>
            </ion-segment>
          </div>
        </div>

        <!-- Liste -->
        <div class="list">
          <div
            v-for="p in filtered"
            :key="p.key"
            class="card"
          >
            <div class="card-head">
              <h3>{{ p.title }}</h3>
              <ion-badge :color="p.type==='federal' ? 'primary' : (p.type==='provincial' ? 'tertiary' : 'success')">
                {{ labelType(p.type) }}
              </ion-badge>
            </div>
            <p class="desc">{{ p.description }}</p>
            <div class="meta">
              <span class="chip">CLB conseillé: <strong>{{ p.minCLB }}</strong></span>
              <span class="chip" v-if="p.provinces.length">Provinces: {{ p.provinces.join(', ') }}</span>
              <span class="chip" v-if="p.hasJobOfferBoost">Offre d’emploi: bonus</span>
            </div>
            <div class="actions">
              <ion-button size="small" @click="$router.push({ name:'programme-detail', params:{ slug: p.slug }})">
                Détails & coûts
              </ion-button>
            </div>
          </div>

          <div v-if="!filtered.length" class="empty">
            <p>Aucun programme ne correspond à ces filtres.</p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption,
  IonRange, IonInput, IonSegment, IonSegmentButton, IonButton, IonBadge
} from '@ionic/vue';
import { ref, computed } from 'vue';
import { PROGRAMS, PROVINCES, TYPES } from '@/data/programs';
import type { Program } from '@/data/programs';

const provinces = PROVINCES;
const types = TYPES;

const province = ref<string>('ALL');
const ptype = ref<'all'|'federal'|'provincial'|'etudes'>('all');
const minCLB = ref<number>(0);
const q = ref<string>('');
const sortBy = ref<'minCLB'|'title'>('minCLB');

const filtered = computed<Program[]>(() => {
  let rows = PROGRAMS.slice();

  if (ptype.value !== 'all') {
    rows = rows.filter(r => r.type === ptype.value);
  }
  if (province.value !== 'ALL') {
    rows = rows.filter(r => r.type === 'federal' || r.provinces.includes(province.value));
  }
  if (minCLB.value > 0) {
    rows = rows.filter(r => r.minCLB >= minCLB.value);
  }
  if (q.value.trim()) {
    const k = q.value.toLowerCase();
    rows = rows.filter(r =>
      r.title.toLowerCase().includes(k) ||
      r.description.toLowerCase().includes(k) ||
      r.slug.toLowerCase().includes(k)
    );
  }
  if (sortBy.value === 'minCLB') {
    rows.sort((a,b) => a.minCLB - b.minCLB || a.title.localeCompare(b.title));
  } else {
    rows.sort((a,b) => a.title.localeCompare(b.title));
  }
  return rows;
});

function labelType(t: Program['type']) {
  if (t === 'federal') return 'Fédéral';
  if (t === 'provincial') return 'Provincial';
  return 'Études';
}
</script>

<style scoped>
.page { padding: 26px 14px 80px; }
.wrap { max-width: 1100px; margin: 0 auto; padding: 18px; }
.head { margin-bottom: 10px; }
.sub { opacity: .9; margin-top: 4px; }

.filters {
  display: grid; gap: 12px;
  grid-template-columns: repeat(4, minmax(0,1fr));
  margin-top: 10px; margin-bottom: 12px;
}
.it { --background: transparent; border-radius: 14px; }
.it.search { grid-column: span 2; }
.sort { display:flex; align-items:center; justify-content:flex-end; }

.list { display:grid; gap: 12px; margin-top: 6px; }
.card {
  padding: 14px; border-radius: 16px;
  background: rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.12);
  box-shadow: 0 8px 24px rgba(0,0,0,.18);
  transition: transform .18s ease, box-shadow .18s ease;
}
.card:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,0,0,.24); }
.card-head { display:flex; align-items:center; justify-content:space-between; gap:10px; }
.desc { opacity:.95; margin: 6px 0 10px; }
.meta { display:flex; flex-wrap: wrap; gap: 8px; }
.chip {
  font-size: .85rem; padding: 6px 10px; border-radius: 999px;
  background: rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1);
}
.actions { display:flex; justify-content:flex-end; margin-top: 10px; }
.empty { padding: 20px; text-align:center; opacity:.9; }

@media (max-width: 980px) {
  .filters { grid-template-columns: 1fr 1fr; }
  .it.search { grid-column: span 1; }
}
</style>

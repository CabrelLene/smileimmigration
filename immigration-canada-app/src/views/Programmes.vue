<template>
  <ion-page>
    <ion-content class="page">
      <div class="wrap container">

        <!-- En-tête -->
        <header class="head">
          <div class="hero-head glass">
            <div class="text">
              <h2 class="title">Programmes d’immigration</h2>
              <p class="sub">Filtre par province, type et CLB minimal conseillé.</p>
            </div>
            <div class="picto">🧭</div>
          </div>
        </header>

        <!-- Barre de filtres -->
        <section class="filters glass">
          <div class="grid-filters">
            <ion-item class="it">
              <ion-label position="stacked">Province</ion-label>
              <ion-select v-model="province" interface="popover">
                <ion-select-option value="ALL">Toutes</ion-select-option>
                <ion-select-option v-for="p in provinces" :key="p.code" :value="p.code">
                  {{ p.name }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">Type</ion-label>
              <ion-select v-model="ptype" interface="popover">
                <ion-select-option value="all">Tous</ion-select-option>
                <ion-select-option v-for="t in types" :key="t.code" :value="t.code">
                  {{ t.label }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item class="it">
              <ion-label position="stacked">CLB minimal</ion-label>
              <ion-range min="0" max="10" step="1" snaps ticks v-model="minCLB">
                <ion-label slot="start">0</ion-label>
                <ion-label slot="end">10</ion-label>
              </ion-range>
            </ion-item>

            <ion-item class="it search">
              <ion-label position="stacked">Recherche</ion-label>
              <ion-input v-model="q" placeholder="ex : express, étude, nomination…"></ion-input>
            </ion-item>
          </div>

          <!-- Ligne d’actions secondaire -->
          <div class="filters-bottom">
            <div class="summary">
              <span class="chip">Résultats : <strong>{{ filtered.length }}</strong></span>
              <span class="chip" v-if="province!=='ALL'">Province : <strong>{{ provinceLabel }}</strong></span>
              <span class="chip" v-if="ptype!=='all'">Type : <strong>{{ typeLabel }}</strong></span>
              <span class="chip" v-if="minCLB>0">CLB ≥ <strong>{{ minCLB }}</strong></span>
            </div>

            <div class="sort">
              <ion-segment v-model="sortBy" value="minCLB">
                <ion-segment-button value="minCLB"><ion-label>CLB</ion-label></ion-segment-button>
                <ion-segment-button value="title"><ion-label>Titre</ion-label></ion-segment-button>
              </ion-segment>
              <ion-button class="ghost" size="small" fill="clear" @click="resetFilters">Réinitialiser</ion-button>
            </div>
          </div>
        </section>

        <!-- Liste des programmes -->
        <section class="list">
          <article
            v-for="p in filtered"
            :key="p.key"
            class="card program glass"
          >
            <!-- Accent à gauche -->
            <span class="accent" :class="accentClass(p.type)"></span>

            <div class="card-head">
              <div class="title-wrap">
                <div class="icon">{{ typeIcon(p.type) }}</div>
                <h3 class="card-title">{{ p.title }}</h3>
              </div>

              <div class="badges">
                <ion-badge :color="p.type==='federal' ? 'primary' : (p.type==='provincial' ? 'tertiary' : 'success')">
                  {{ labelType(p.type) }}
                </ion-badge>
                <span class="pill">CLB conseillé : <b>{{ p.minCLB }}</b></span>
              </div>
            </div>

            <p class="desc">{{ p.description }}</p>

            <div class="meta">
              <span class="chip" v-if="p.provinces.length">Provinces : {{ p.provinces.join(', ') }}</span>
              <span class="chip" v-if="p.hasJobOfferBoost">🎯 Offre d’emploi : bonus</span>
            </div>

            <!-- Barre CLB visuelle -->
            <div class="clbbar">
              <div class="bar">
                <div class="fill" :style="{ width: clbWidth(p.minCLB) }"></div>
              </div>
              <div class="ticks">
                <span v-for="n in 11" :key="n">{{ n-1 }}</span>
              </div>
            </div>

            <div class="actions">
              <ion-button size="small" @click="$router.push({ name:'programme-detail', params:{ slug: p.slug }})">
                Détails & coûts
              </ion-button>
            </div>
          </article>

          <!-- État vide -->
          <div v-if="!filtered.length" class="empty glass">
            <div class="emoji">🕵️‍♀️</div>
            <h4>Aucun résultat</h4>
            <p>Essaie d’élargir tes filtres ou de vider ta recherche.</p>
            <ion-button size="small" fill="outline" @click="resetFilters">Réinitialiser les filtres</ion-button>
          </div>
        </section>

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

const provinceLabel = computed(() => provinces.find(x => x.code === province.value)?.name || 'Toutes');
const typeLabel = computed(() => types.find(x => x.code === ptype.value)?.label || 'Tous');

function labelType(t: Program['type']) {
  if (t === 'federal') return 'Fédéral';
  if (t === 'provincial') return 'Provincial';
  return 'Études';
}

function typeIcon(t: Program['type']) {
  if (t === 'federal') return '🏛️';
  if (t === 'provincial') return '🏞️';
  return '🎓';
}

function accentClass(t: Program['type']) {
  return t === 'federal' ? 'a-federal' : t === 'provincial' ? 'a-provincial' : 'a-study';
}

function clbWidth(n: number) {
  const pct = Math.min(100, Math.max(0, (n/10)*100));
  return pct.toFixed(0) + '%';
}

function resetFilters() {
  province.value = 'ALL';
  ptype.value = 'all';
  minCLB.value = 0;
  q.value = '';
  sortBy.value = 'minCLB';
}
</script>

<style scoped>
.page { padding: 26px 14px 90px; }
.wrap { max-width: 1100px; margin: 0 auto; }

/* --- Header hero small --- */
.hero-head {
  display:flex; justify-content:space-between; align-items:center;
  padding: 16px 18px; border-radius: var(--r-lg);
}
.hero-head .title { display:flex; flex-direction:column; gap:4px; }
.hero-head .title h2 { margin:0; font-weight: 800; letter-spacing:-.02em; }
.hero-head .sub { opacity:.9; }
.hero-head .picto { font-size:26px; filter: drop-shadow(0 3px 10px rgba(125,211,252,.35)); }

/* --- Filters --- */
.filters { margin-top: 12px; padding: 12px; border-radius: var(--r-lg); }
.grid-filters {
  display:grid; gap: 12px; grid-template-columns: repeat(4, minmax(0,1fr));
}
.it { --background: transparent; border-radius: var(--r-lg); }
.it.search { grid-column: span 1; }
.filters-bottom {
  margin-top: 10px; display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap: wrap;
}
.summary { display:flex; gap: 8px; flex-wrap: wrap; }
.chip {
  font-size:.85rem; padding: 6px 10px; border-radius: 999px;
  background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12);
}

/* --- List / Cards --- */
.list { display:grid; gap: 14px; margin-top: 14px; }
.program {
  position: relative;
  padding: 16px 16px 14px 16px; border-radius: var(--r-lg);
  background: rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.12);
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
  overflow: hidden;
}
.program:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 40px rgba(0,0,0,.35);
  border-color: rgba(255,255,255,.18);
}
.accent {
  content: ""; position:absolute; left:0; top:0; bottom:0; width: 6px;
  background: linear-gradient(180deg, #7dd3fc, #60a5fa);
  opacity: .9;
}
.a-provincial { background: linear-gradient(180deg, #fbbf24, #f59e0b); }
.a-study { background: linear-gradient(180deg, #34d399, #10b981); }

.card-head { display:flex; align-items:center; justify-content:space-between; gap:10px; }
.title-wrap { display:flex; align-items:center; gap: 10px; }
.icon { width:34px; height:34px; display:flex; align-items:center; justify-content:center; font-size:20px;
  border-radius: 10px; background: rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12);
}
.card-title { margin:0; font-weight:800; letter-spacing:-.02em; }

.badges { display:flex; gap: 8px; align-items:center; flex-wrap: wrap; }
.pill {
  font-size:.85rem; padding: 6px 10px; border-radius: 999px;
  background: rgba(125,211,252,.15); border:1px solid rgba(125,211,252,.35);
}

.desc { opacity:.95; margin: 8px 0 10px; }
.meta { display:flex; flex-wrap: wrap; gap: 8px; }

.clbbar { margin-top: 8px; }
.bar {
  height: 10px; border-radius: 999px; overflow: hidden;
  background: rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12);
}
.fill {
  height: 100%;
  background: linear-gradient(90deg, #7dd3fc, #60a5fa);
  box-shadow: inset 0 0 12px rgba(96,165,250,.6);
  transition: width .25s ease;
}
.ticks {
  display:flex; justify-content:space-between; font-size:.75rem; opacity:.8; margin-top: 4px;
}

.actions { display:flex; justify-content:flex-end; margin-top: 12px; }

/* --- Empty state --- */
.empty {
  text-align:center; padding: 24px; border-radius: var(--r-lg);
  background: rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.12);
}
.empty .emoji { font-size: 30px; margin-bottom: 4px; }

@media (max-width: 980px) {
  .grid-filters { grid-template-columns: 1fr 1fr; }
}
</style>

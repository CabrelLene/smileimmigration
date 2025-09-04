<template>
  <ion-page>
    <ion-content class="page">
      <div class="wrap container">
        <header class="head">
          <h2>{{ title }}</h2>
          <ion-badge color="primary">{{ programKey }}</ion-badge>
        </header>

        <section class="costs glass card">
          <h3>Frais estimatifs (CAD)</h3>
          <ion-list lines="full">
            <ion-item v-for="it in cost.items" :key="it.label">
              <ion-label>{{ it.label }}</ion-label>
              <ion-note slot="end">{{ it.amountCAD.toLocaleString() }} $</ion-note>
            </ion-item>
            <ion-item class="total">
              <ion-label><strong>Total estimé</strong></ion-label>
              <ion-note slot="end"><strong>{{ total.toLocaleString() }} $</strong></ion-note>
            </ion-item>
          </ion-list>
        </section>

        <section class="timeline glass card">
          <h3>Timeline indicative</h3>
          <ol class="tl">
            <li><span class="dot"></span><div><strong>Préparation</strong><p>Tests de langue, EDE, documents.</p></div></li>
            <li><span class="dot"></span><div><strong>Dépôt</strong><p>Soumission du dossier (fédéral/provincial).</p></div></li>
            <li><span class="dot"></span><div><strong>Biométrie / Médical</strong><p>Sur convocation.</p></div></li>
            <li><span class="dot"></span><div><strong>Traitement</strong><p>Délais variables (voir IRCC).</p></div></li>
            <li><span class="dot"></span><div><strong>Décision</strong><p>Approbation & suite des instructions.</p></div></li>
          </ol>
        </section>

        <section class="checklist glass card">
          <h3>Checklist personnalisée</h3>
          <Checklist :slug="slug" :items="defaultChecklist" />
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonBadge, IonList, IonItem, IonLabel, IonNote } from '@ionic/vue';
import { useRoute } from 'vue-router';
import { estimateCosts, sumCosts } from '@/services/costs';
import Checklist from '@/components/Checklist.vue';
import { computed } from 'vue';

const route = useRoute();
const slug = route.params.slug as string;

const map: Record<string, { key:string; title:string }> = {
  'entree-express-travailleur-qualifie': { key: 'express-entry', title: 'Entrée Express — Travailleur qualifié' },
  'programme-candidats-provinces': { key: 'pnp', title: 'Programme des candidats des provinces (PNP)' },
  'etudes-vers-rp': { key: 'study', title: 'Études au Canada → Voies vers la RP' }
};

const programKey = map[slug]?.key ?? 'express-entry';
const title = map[slug]?.title ?? 'Programme';

const cost = estimateCosts(programKey);
const total = sumCosts(cost);

const defaultChecklist = computed(() => {
  if (programKey === 'express-entry') {
    return ['Passeport', 'EDE (WES, IQAS…)', 'Résultats de langue', 'Preuves d’expérience', 'Preuves de fonds', 'Certificats de police'];
  }
  if (programKey === 'pnp') {
    return ['Passeport', 'Lettre d’intérêt / Nomination', 'Résultats de langue', 'Contrat de travail (si applicable)', 'Preuves de fonds'];
  }
  return ['Lettre d’admission', 'Preuves financières', 'Assurance santé', 'Résultats de langue', 'CAQ (si Québec)'];
});
</script>

<style scoped>
.page { padding: 26px 14px 80px; }
.wrap { max-width: 980px; margin: 0 auto; }
.head { display:flex; align-items:center; justify-content:space-between; margin-bottom: 12px; }
.head h2 { font-family: "Plus Jakarta Sans", Inter, system-ui, sans-serif; font-weight: 800; letter-spacing: -.02em; }
.costs, .timeline, .checklist { margin-top: 18px; }
.total { --background: rgba(255,255,255,.04); }
ion-list { border-radius: var(--r-lg); overflow: hidden; }

.tl { list-style: none; margin: 0; padding: 0; border-left: 2px solid rgba(255,255,255,.25); }
.tl li { position: relative; margin-left: 14px; padding: 10px 10px 10px 12px; }
.tl li .dot { position:absolute; left:-10px; top: 16px; width:14px; height:14px; border-radius:50%; background:#5dd3ff; box-shadow:0 0 10px rgba(93,214,255,.6); }
</style>

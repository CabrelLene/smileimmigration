<template>
  <div class="card glass">
    <div class="head">
      <h3>{{ title }}</h3>
      <strong>{{ score }} / 100</strong>
    </div>
    <p class="reason">{{ reason }}</p>
    <div class="actions">
      <ion-button fill="solid" size="small" @click="$router.push({ name:'programme-detail', params: { slug }})">
        Détails & coûts
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonButton } from '@ionic/vue';
defineProps<{ title: string; score: number; reason: string; slug: string }>();
</script>

<style scoped>
.card { padding: 16px; }
.head { display:flex; align-items:center; justify-content:space-between; gap:12px; }
.reason { opacity:.9; margin:10px 0 14px; }
.actions { display:flex; justify-content:flex-end; }
</style>

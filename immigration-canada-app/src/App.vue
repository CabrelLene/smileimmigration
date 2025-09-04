<template>
  <ion-app>
    <NavBar />
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import NavBar from '@/components/NavBar.vue';
</script>

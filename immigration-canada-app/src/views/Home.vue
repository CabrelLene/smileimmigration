<template>
  <ion-page>
    <ion-content :fullscreen="true" class="home">
      <section class="hero">
        <div class="hero-inner glass">
          <div class="text">
            <h1 class="hero-title">Ton compagnon<br/> d’immigration 🇨🇦</h1>
            <p>
              Évalue ton admissibilité, simule les coûts & délais, suis ta progression.<br/>
              Design immersif, conseils clairs, résultats fiables.
            </p>
            <div class="cta-row">
              <button class="cta pulse" @click="$router.push({name:'evaluation'})">
                Commencer mon évaluation
              </button>
              <button class="cta" @click="$router.push({name:'programmes'})">Explorer les programmes</button>
            </div>
          </div>

          <div class="anim" ref="animHost" aria-hidden="true"></div>
        </div>
      </section>

      <section class="features">
        <div class="grid">
          <div class="f glass">
            <h3>Admissibilité</h3>
            <p>Questionnaire intelligent avec recommandations immédiates.</p>
          </div>
          <div class="f glass">
            <h3>Coûts & Délais</h3>
            <p>Estimation transparente des frais + timeline interactive.</p>
          </div>
          <div class="f glass">
            <h3>Langue</h3>
            <p>Entre tes scores (IELTS/TEF/TCF/CELPIP) — verdict instantané.</p>
          </div>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import lottie from 'lottie-web';
import { onMounted, ref } from 'vue';

// Petite animation Lottie inline (placeholder minimaliste)
// Tu pourras remplacer par un vrai JSON dans /assets/lottie/hero.json
const animHost = ref<HTMLDivElement|null>(null);

onMounted(() => {
  if (!animHost.value) return;
  const json = {
    v:"5.7.4", fr:30, ip:0, op:120, w:300, h:300, nm:"pulse",
    ddd:0, assets:[], layers:[
      {ty:4, ks:{o:{k:100}, r:{k:0}, p:{k:[150,150,0]}, a:{k:[0,0,0]}, s:{k:[0,0,100]}},
       shapes:[{ty:"el", p:{k:[0,0]}, s:{k:[220,220]}},{ty:"st", c:{k:[0.365,0.839,1,1]}, w:{k:4}},
               {ty:"tr"}],
       ef:[]
      }
    ]
  };
  const anim = lottie.loadAnimation({
    container: animHost.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: json as any
  });
});
</script>

<style scoped>
.home { padding: 28px 16px 80px; }
.hero { display:flex; justify-content:center; margin-top: 10vh; }
.hero-inner {
  display:grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 28px;
  padding: 24px;
  max-width: 1100px;
  width: 100%;
}
.text p { opacity:.9; margin-top: 10px; }
.cta-row { display:flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
.anim { min-height: 280px; display:flex; align-items:center; justify-content:center; }
.features { margin-top: 48px; display:flex; justify-content:center; }
.grid {
  width: 100%; max-width: 1100px;
  display: grid; gap: 16px;
  grid-template-columns: repeat(3, 1fr);
}
.f { padding: 16px; }
@media (max-width: 900px) {
  .hero-inner { grid-template-columns: 1fr; }
  .grid { grid-template-columns: 1fr; }
}
</style>

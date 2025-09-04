<template>
  <ion-page>
    <ion-content :fullscreen="true" class="page">
      <!-- Hero -->
      <section class="hero container">
        <div class="hero-bg">
          <div class="glow glow-a"></div>
          <div class="glow glow-b"></div>
          <div class="pattern"></div>
        </div>

        <div class="glass hero-inner">
          <div class="text">
            <div class="eyebrow">
              <span class="pill">Guidé • Fiable • Rapide</span>
            </div>
            <h1 class="hero-title">
              Immigration Canada, simplifiée <span class="flag">🇨🇦</span>
            </h1>
            <p class="lead">
              Évalue ton admissibilité, visualise les coûts & délais, et avance étape par étape
              avec une expérience pensée pour la clarté.
            </p>

            <div class="cta-row">
              <router-link class="btn-primary big" :to="{ name: 'evaluation' }">
                Commencer mon évaluation
                <span class="arrow">→</span>
              </router-link>
              <router-link class="btn-ghost big" :to="{ name: 'programmes' }">
                Explorer les programmes
              </router-link>
            </div>

            <div class="trust">
              <div class="trust-item">
                <span class="tick">✓</span> Données locales & sauvegarde cloud
              </div>
              <div class="trust-item">
                <span class="tick">✓</span> Tables CLB officielles (IELTS/TEF/TCF/CELPIP)
              </div>
              <div class="trust-item">
                <span class="tick">✓</span> Checklists interactives
              </div>
            </div>
          </div>

          <div class="visual">
            <!-- Carte flottante 1 -->
            <div class="float card-one">
              <div class="mini-title">CLB estimé</div>
              <div class="big-num">
                8
                <span class="unit">/10</span>
              </div>
              <div class="mini-desc">Sur la base de tes scores</div>
            </div>

            <!-- Carte flottante 2 -->
            <div class="float card-two">
              <div class="row">
                <div class="dot"></div>
                <div class="label">Entrée Express</div>
                <div class="val">Admissible</div>
              </div>
              <div class="row">
                <div class="dot alt"></div>
                <div class="label">PNP (ON)</div>
                <div class="val">À vérifier</div>
              </div>
              <div class="row">
                <div class="dot green"></div>
                <div class="label">Études → RP</div>
                <div class="val">Possible</div>
              </div>
            </div>

            <!-- Orbe décorative -->
            <div class="orb"></div>
            <div class="ring"></div>
          </div>
        </div>

        <!-- Compteurs -->
        <div class="stats">
          <div class="stat glass">
            <div class="num"><span class="count" :data-target="3">0</span> min</div>
            <div class="label">pour une première estimation</div>
          </div>
          <div class="stat glass">
            <div class="num"><span class="count" :data-target="100">0</span>%</div>
            <div class="label">tables CLB conformes</div>
          </div>
          <div class="stat glass">
            <div class="num"><span class="count" :data-target="5">0</span>+</div>
            <div class="label">voies explorées</div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="container features">
        <div class="grid-3">
          <div class="glass card feature">
            <div class="icon">🧭</div>
            <h3>Admissibilité guidée</h3>
            <p>Questionnaire intelligent, conseils contextuels et recommandations immédiates.</p>
            <router-link class="link" :to="{ name: 'evaluation' }">Lancer l’évaluation →</router-link>
          </div>

          <div class="glass card feature">
            <div class="icon">💳</div>
            <h3>Coûts & délais clairs</h3>
            <p>Estimation transparente par programme + timeline indicative des étapes.</p>
            <router-link class="link" :to="{ name: 'programmes' }">Voir les programmes →</router-link>
          </div>

          <div class="glass card feature">
            <div class="icon">🗣️</div>
            <h3>Langue & CLB</h3>
            <p>Entre tes scores (IELTS/TEF/TCF/CELPIP) — conversion CLB officielle instantanée.</p>
            <router-link class="link" :to="{ name: 'evaluation' }">Calculer mon CLB →</router-link>
          </div>
        </div>
      </section>

      <!-- Étapes -->
      <section class="container steps">
        <div class="glass steps-inner">
          <h3 class="steps-title">Ton parcours en 3 étapes</h3>
          <ol class="timeline">
            <li>
              <span class="badge">1</span>
              <div>
                <strong>Évalue</strong>
                <p>Profil, langues, expérience — on estime le CLB et la faisabilité.</p>
              </div>
            </li>
            <li>
              <span class="badge">2</span>
              <div>
                <strong>Explore</strong>
                <p>Compare les programmes (fédéral/provincial), coûts et délais.</p>
              </div>
            </li>
            <li>
              <span class="badge">3</span>
              <div>
                <strong>Agis</strong>
                <p>Checklist dynamique, scénarios de simulation, sauvegarde sécurisée.</p>
              </div>
            </li>
          </ol>
          <div class="steps-cta">
            <router-link class="btn-primary" :to="{ name: 'simulation' }">
              Essayer un scénario “Et si…”
              <span class="arrow">→</span>
            </router-link>
          </div>
        </div>
      </section>

      <!-- CTA finale -->
      <section class="container final-cta">
        <div class="glass final-card">
          <div class="col">
            <h3>Prêt à avancer ?</h3>
            <p>Commence par une évaluation rapide, tu gardes la main du début à la fin.</p>
          </div>
          <div class="col action">
            <router-link class="btn-primary big" :to="{ name: 'evaluation' }">Démarrer maintenant</router-link>
          </div>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { onMounted } from 'vue';

// Petits compteurs animés
onMounted(() => {
  const els = document.querySelectorAll<HTMLElement>('.count');
  els.forEach((el) => {
    const target = Number(el.dataset.target || '0');
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const tick = () => {
      current += step;
      if (current >= target) current = target;
      el.textContent = String(current);
      if (current < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
});
</script>

<style scoped>
.page { padding-bottom: 120px; }

/* ------------- HERO ------------- */
.hero { margin-top: 6vh; position: relative; }
.hero-bg { position: absolute; inset: 0; pointer-events: none; }
.glow { position:absolute; border-radius: 50%; filter: blur(40px); opacity: .35; }
.glow-a { width: 420px; height: 420px; top: -120px; left: -60px; background: radial-gradient(#7dd3fc, transparent 55%); }
.glow-b { width: 360px; height: 360px; bottom: -80px; right: -40px; background: radial-gradient(#34d399, transparent 55%); }
.pattern {
  position:absolute; inset:0;
  background: repeating-linear-gradient(135deg, rgba(255,255,255,.06), rgba(255,255,255,.06) 1px, transparent 1px, transparent 14px);
  mask-image: radial-gradient(70% 60% at 50% 0%, #000 50%, transparent 90%);
}

.hero-inner {
  position: relative;
  display:grid; grid-template-columns: 1.2fr 1fr; gap: 28px; padding: 28px;
  overflow: hidden;
}
.eyebrow { margin-bottom: 8px; }
.pill {
  font-size: .82rem; padding: 6px 10px; border-radius: 999px;
  background: rgba(125,211,252,.15); border: 1px solid rgba(125,211,252,.35);
}
.flag { filter: saturate(110%) drop-shadow(0 0 10px rgba(93,214,255,.35)); }
.lead { opacity:.95; margin-top: 10px; font-size: 1.06rem; }

.cta-row { display:flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
.btn-primary.big, .btn-ghost.big { padding: 1rem 1.2rem; font-size: 1.02rem; }
.arrow { display:inline-block; transform: translateX(0); transition: transform .18s ease; margin-left: 6px; }
.btn-primary:hover .arrow { transform: translateX(3px); }

.trust { display:flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
.trust-item { display:flex; gap:6px; align-items:center; font-size:.92rem; opacity:.95; }
.tick { width:18px; height:18px; display:inline-flex; align-items:center; justify-content:center; border-radius:999px; background: rgba(52,211,153,.25); border:1px solid rgba(52,211,153,.45); }

.visual { position: relative; min-height: 320px; }
.orb { position:absolute; right: 20px; top: 30px; width: 220px; height: 220px; border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #7dd3fc, #34d399 60%, rgba(255,255,255,.2) 70%);
  filter: blur(2px);
  box-shadow: 0 0 80px rgba(125,211,252,.45), inset 0 0 40px rgba(52,211,153,.28);
  animation: float 8s ease-in-out infinite;
}
.ring { position:absolute; right: -10px; top: -6px; width: 320px; height: 320px; border-radius: 50%; border: 2px dashed rgba(255,255,255,.25); animation: spin 18s linear infinite; }

.float {
  position:absolute; backdrop-filter: saturate(120%) blur(8px);
  -webkit-backdrop-filter: saturate(120%) blur(8px);
  background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.18);
  border-radius: 16px; padding: 12px 14px; box-shadow: 0 10px 30px rgba(0,0,0,.35);
}
.card-one { right: 14px; bottom: 16px; min-width: 160px; }
.card-one .mini-title { font-size:.84rem; opacity:.9; }
.card-one .big-num { font-weight: 800; font-size: 34px; line-height: 1; letter-spacing:-.02em; }
.card-one .unit { font-size:14px; opacity:.85; margin-left: 2px; }
.card-one .mini-desc { font-size:.82rem; opacity:.85; margin-top: 2px; }

.card-two { right: 180px; top: 10px; min-width: 220px; }
.card-two .row { display:flex; align-items:center; justify-content:space-between; gap:10px; padding: 6px 0; }
.card-two .dot { width:8px; height:8px; border-radius:999px; background:#60a5fa; box-shadow: 0 0 10px rgba(96,165,250,.6); }
.card-two .dot.alt { background:#fbbf24; box-shadow: 0 0 10px rgba(251,191,36,.5); }
.card-two .dot.green { background:#34d399; box-shadow: 0 0 10px rgba(52,211,153,.5); }
.card-two .label { font-size:.92rem; opacity:.95; }
.card-two .val { font-weight:700; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes float {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* ------------- STATS ------------- */
.stats {
  display:grid; gap: 12px; grid-template-columns: repeat(3, minmax(0,1fr));
  margin-top: 16px;
}
.stat { padding: 14px; border-radius: 14px; text-align:center; }
.stat .num { font-size: 28px; font-weight: 800; letter-spacing: -.02em; }
.stat .label { opacity:.9; }

/* ------------- FEATURES ------------- */
.features { margin-top: 28px; }
.feature .icon { font-size: 28px; line-height: 1; margin-bottom: 6px; }
.feature h3 { margin: 2px 0 6px; font-weight: 800; letter-spacing:-.02em; }
.feature p { opacity:.95; }
.feature .link { display:inline-block; margin-top: 10px; opacity:.95; border-bottom: 1px dashed rgba(255,255,255,.35); padding-bottom: 2px; }
:root[data-theme="light"] .feature .link { border-bottom-color: rgba(0,0,0,.35); }

/* ------------- STEPS ------------- */
.steps { margin-top: 26px; }
.steps-inner { padding: 16px; }
.steps-title { margin: 0 0 12px; font-weight: 800; letter-spacing: -.02em; }
.timeline { list-style:none; margin:0; padding:0; display:grid; gap: 10px; }
.timeline li { display:flex; gap: 10px; align-items:flex-start; }
.badge {
  display:inline-flex; align-items:center; justify-content:center;
  width: 28px; height:28px; border-radius: 999px; font-weight:800;
  color:#0b1220;
  background: linear-gradient(180deg, #7dd3fc, #34d399);
  border: 1px solid rgba(255,255,255,.24);
  box-shadow: 0 6px 16px rgba(125,211,252,.3);
}
.timeline strong { font-weight: 800; }
.timeline p { margin: 2px 0 0; opacity: .95; }

/* ------------- FINAL CTA ------------- */
.final-cta { margin-top: 26px; margin-bottom: 18px; }
.final-card { display:grid; grid-template-columns: 1fr auto; gap: 12px; align-items:center; padding: 16px; }
.final-card .col h3 { margin: 0 0 6px; font-weight: 800; letter-spacing:-.02em; }
.final-card .col p { margin: 0; opacity:.95; }

@media (max-width: 980px) {
  .hero-inner { grid-template-columns: 1fr; }
  .visual { order: -1; min-height: 240px; }
  .card-two { right: 16px; top: 8px; }
  .stats { grid-template-columns: 1fr; }
  .final-card { grid-template-columns: 1fr; text-align:center; }
  .final-card .action { display:flex; justify-content:center; }
}
</style>

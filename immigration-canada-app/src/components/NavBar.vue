<template>
  <header :class="['nav', 'glass', { shadow: scrolled }]">
    <div class="container row">

      <!-- Brand -->
      <div class="left" @click="$router.push('/')">
        <span class="logo">🇨🇦</span>
        <strong class="brand">Immigration Canada</strong>
      </div>

      <!-- Desktop nav -->
      <nav class="center">
        <RouterLink class="link" :class="{active:isActive('/evaluation')}" to="/evaluation">Évaluation</RouterLink>
        <RouterLink class="link" :class="{active:isActive('/programmes')}" to="/programmes">Programmes</RouterLink>
        <RouterLink class="link" :class="{active:isActive('/simulation')}" to="/simulation">Simulation</RouterLink>
        <span class="underline" :style="underlineStyle"></span>
      </nav>

      <!-- Right actions (desktop) -->
      <div class="right">
        <!-- Theme -->
        <button class="icon ghost" @click="toggleTheme" :title="themeTitle" aria-label="Changer le thème">
          <span v-if="isLight">🌙</span>
          <span v-else>☀️</span>
        </button>

        <!-- Not logged -->
        <template v-if="!auth.user">
          <RouterLink class="ghost btn" to="/login">Se connecter</RouterLink>
          <RouterLink class="primary btn" to="/signup">Créer un compte</RouterLink>
        </template>

        <!-- Logged -->
        <template v-else>
          <div class="user" ref="userWrap">
            <button class="avatar" @click="toggleUserMenu" :aria-expanded="userMenuOpen" aria-haspopup="menu">
              {{ initials }}
            </button>
            <transition name="fade">
              <div v-if="userMenuOpen" class="menu glass" role="menu">
                <button class="mi" @click="goProfil">Profil</button>
                <button class="mi danger" @click="logout">Se déconnecter</button>
              </div>
            </transition>
          </div>
        </template>

        <!-- Mobile hamburger -->
        <button class="hamburger ghost" @click="mobileOpen = !mobileOpen" aria-label="Ouvrir le menu">
          <span :class="{open: mobileOpen}"></span>
        </button>
      </div>
    </div>

    <!-- Mobile drawer -->
    <transition name="slide">
      <div v-if="mobileOpen" class="mobile glass" ref="mobileWrap">
        <RouterLink class="m-link" to="/evaluation" @click="closeMobile">Évaluation</RouterLink>
        <RouterLink class="m-link" to="/programmes" @click="closeMobile">Programmes</RouterLink>
        <RouterLink class="m-link" to="/simulation" @click="closeMobile">Simulation</RouterLink>
        <div class="m-sep"></div>
        <button class="m-item" @click="toggleTheme">
          Thème : <strong>{{ isLight ? 'Clair' : 'Sombre' }}</strong>
        </button>
        <template v-if="!auth.user">
          <RouterLink class="m-item" to="/login" @click="closeMobile">Se connecter</RouterLink>
          <RouterLink class="m-item primary" to="/signup" @click="closeMobile">Créer un compte</RouterLink>
        </template>
        <template v-else>
          <RouterLink class="m-item" to="/profil" @click="closeMobile">Profil</RouterLink>
          <button class="m-item danger" @click="logout">Se déconnecter</button>
        </template>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/theme';

const auth = useAuthStore();
const theme = useThemeStore();
const route = useRoute();
const router = useRouter();

const isLight = computed(() => document.documentElement.getAttribute('data-theme') === 'light');
const themeTitle = computed(() => isLight.value ? 'Passer en sombre' : 'Passer en clair');
function toggleTheme(){ theme.toggle(); }

function logout(){ auth.signOut(); router.push('/'); }
function goProfil(){ router.push('/profil'); userMenuOpen.value = false; }

const initials = computed(() => {
  const name = auth.user?.displayName || auth.user?.email || '';
  const base = name.includes('@') ? name.split('@')[0] : name;
  const parts = base.split(/[.\s_-]+/).filter(Boolean);
  const [a,b] = [parts[0]?.[0], parts[1]?.[0]];
  return ((a||'M') + (b||'E')).toUpperCase();
});

/* Active link underline (desktop) */
const centerRef = ref<HTMLElement|null>(null);
const activeIndex = computed(() => {
  const order = ['/evaluation','/programmes','/simulation'];
  const idx = order.findIndex(p => route.path.startsWith(p));
  return idx < 0 ? 0 : idx;
});
const underlineStyle = computed(() => {
  const width = 110; // px approximatif par lien
  const gap = 8;     // gap CSS
  const x = activeIndex.value * (width + gap);
  return `transform: translateX(${x}px); width:${width}px;`;
});
function isActive(path:string){ return route.path.startsWith(path); }

/* User menu + outside click */
const userMenuOpen = ref(false);
const userWrap = ref<HTMLElement|null>(null);
function toggleUserMenu(){ userMenuOpen.value = !userMenuOpen.value; }
function onDocClick(e:MouseEvent){
  const t = e.target as Node;
  if (userWrap.value && !userWrap.value.contains(t)) userMenuOpen.value = false;
  if (mobileWrap.value && !mobileWrap.value.contains(t)) mobileOpen.value = false;
}
onMounted(()=> document.addEventListener('click', onDocClick));
onBeforeUnmount(()=> document.removeEventListener('click', onDocClick));

/* Mobile drawer */
const mobileOpen = ref(false);
const mobileWrap = ref<HTMLElement|null>(null);
function closeMobile(){ mobileOpen.value = false; }
watch(route, () => { userMenuOpen.value = false; mobileOpen.value = false; });

/* Scroll shadow */
const scrolled = ref(false);
function onScroll(){ scrolled.value = window.scrollY > 8; }
onMounted(() => { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); });
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));
</script>

<style scoped>
.nav{
  position: sticky; top: 0; z-index: 100;
  backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
  border: var(--glass-border);
}
.nav.shadow{ box-shadow: 0 10px 24px rgba(0,0,0,.18); }

.row{ display:flex; align-items:center; justify-content:space-between; gap: 10px; padding: 8px 0; }
.left{ display:flex; align-items:center; gap: 10px; cursor:pointer; }
.logo{ font-size: 1.2rem; }
.brand{ font-weight: 800; letter-spacing: -.02em; }

/* Desktop nav */
.center{
  position: relative;
  display:flex; gap: 8px;
  padding: 6px; border-radius: 12px;
  border: 1px solid rgba(0,0,0,.12);
  background: rgba(0,0,0,.04);
}
:root[data-theme="dark"] .center{ border-color: rgba(255,255,255,.14); background: rgba(255,255,255,.04); }

.link{
  width:110px; text-align:center;
  padding: 8px 10px; border-radius: 10px; font-weight: 600;
  color: var(--ion-text-color); opacity:.92; position: relative;
}
.link:hover{ background: rgba(0,0,0,.06); }
:root[data-theme="dark"] .link:hover{ background: rgba(255,255,255,.08); }
.link.active{ opacity: 1; }

.underline{
  position:absolute; left:6px; bottom:4px; height: 2px;
  background: linear-gradient(90deg, #7dd3fc, #34d399);
  border-radius: 2px;
  transition: transform .25s ease, width .25s ease;
}

/* Right actions */
.right{ display:flex; align-items:center; gap: 8px; }
.btn{
  padding: 8px 12px; border-radius: 12px; font-weight: 700;
  display:inline-flex; align-items:center; justify-content:center;
}
.ghost{
  background: transparent; border:1px solid rgba(0,0,0,.2); color: var(--ion-text-color);
}
:root[data-theme="dark"] .ghost{ border-color: rgba(255,255,255,.2); }
.primary{
  background: linear-gradient(180deg, #7dd3fc, #60a5fa); border:1px solid rgba(255,255,255,.24);
  color:#0b1220; box-shadow: 0 8px 24px rgba(96,165,250,.35);
}
.icon{ width: 40px; height: 40px; display:flex; align-items:center; justify-content:center; border-radius: 12px; }

/* User avatar + menu */
.user{ position:relative; }
.avatar{
  width: 36px; height: 36px; border-radius: 999px;
  display:flex; align-items:center; justify-content:center;
  font-weight: 800; letter-spacing: .5px; cursor: pointer;
  color: #0b1220;
  background: linear-gradient(180deg, #7dd3fc, #34d399);
  border: 1px solid rgba(255,255,255,.24);
  box-shadow: 0 6px 20px rgba(52,211,153,.35);
}
.menu{
  position:absolute; right:0; top: 44px; min-width: 160px; padding: 6px;
  border-radius: 14px; overflow:hidden;
}
.mi{
  width: 100%; text-align:left;
  padding: 10px 12px; border-radius: 10px; font-weight:600;
  background: transparent; color: var(--ion-text-color);
}
.mi:hover{ background: rgba(0,0,0,.06); }
:root[data-theme="dark"] .mi:hover{ background: rgba(255,255,255,.08); }
.mi.danger{ color: #ff6b6b; }

/* Mobile */
.hamburger{
  display:none; width:40px; height:40px; border-radius:12px;
  align-items:center; justify-content:center; position:relative;
}
.hamburger span, .hamburger span::before, .hamburger span::after{
  content:''; display:block; width:18px; height:2px; background: currentColor; transition: transform .2s ease, opacity .2s ease;
}
.hamburger span::before{ transform: translateY(-6px); }
.hamburger span::after{ transform: translateY(6px); }
.hamburger span.open{ transform: rotate(45deg); }
.hamburger span.open::before{ transform: rotate(-90deg); }
.hamburger span.open::after{ opacity:0; }

.mobile{
  margin: 8px 10px 10px; border-radius: 14px; padding: 8px;
  border: var(--glass-border);
}
.m-link, .m-item{
  display:block; padding: 10px 12px; border-radius: 10px; font-weight: 600;
  color: var(--ion-text-color);
}
.m-link:hover, .m-item:hover{ background: rgba(0,0,0,.06); }
:root[data-theme="dark"] .m-link:hover, :root[data-theme="dark"] .m-item:hover{ background: rgba(255,255,255,.08); }
.m-item.primary{ background: linear-gradient(180deg, #7dd3fc, #60a5fa); color:#0b1220; }
.m-item.danger{ color:#ff6b6b; }
.m-sep{ height:1px; background: rgba(0,0,0,.12); margin: 6px 0; }
:root[data-theme="dark"] .m-sep{ background: rgba(255,255,255,.12); }

/* Animations */
.fade-enter-active, .fade-leave-active{ transition: opacity .12s ease; }
.fade-enter-from, .fade-leave-to{ opacity: 0; }
.slide-enter-active, .slide-leave-active{ transition: transform .18s ease, opacity .18s ease; }
.slide-enter-from, .slide-leave-to{ transform: translateY(-8px); opacity: 0; }

/* Layout breakpoints */
@media (max-width: 1024px){
  .center{ display:none; }
  .hamburger{ display:flex; }
}
</style>

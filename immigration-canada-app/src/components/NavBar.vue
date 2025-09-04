<template>
  <header class="nav glass">
    <div class="left" @click="$router.push('/')">
      <span class="logo">🇨🇦</span>
      <strong>Immigration Canada</strong>
    </div>

    <nav class="center">
      <button @click="$router.push('/evaluation')">Évaluation</button>
      <button @click="$router.push('/programmes')">Programmes</button>
      <button @click="$router.push('/simulation')">Simulation</button>
    </nav>

    <div class="right">
      <template v-if="auth.user">
        <span class="hi">Bonjour, {{ auth.user.displayName || auth.user.email }}</span>
        <button class="ghost" @click="$router.push('/profil')">Profil</button>
        <button class="primary" @click="logout">Se déconnecter</button>
      </template>
      <template v-else>
        <button class="ghost" @click="$router.push('/login')">Se connecter</button>
        <button class="primary" @click="$router.push('/signup')">Créer un compte</button>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
const auth = useAuthStore();
function logout() { auth.signOut(); }
</script>

<style scoped>
.nav {
  position: sticky; top: 0; z-index: 100;
  display:flex; align-items:center; justify-content:space-between;
  padding: 10px 14px; margin: 10px; border-radius: 14px;
}
.left { display:flex; align-items:center; gap: 8px; cursor:pointer; }
.logo { font-size: 1.2rem; }
.center { display:flex; gap: 8px; }
.center button { background: transparent; border:1px solid rgba(255,255,255,.14); color: #e6f1ff; padding: 6px 10px; border-radius: 10px; }
.right { display:flex; gap: 8px; align-items:center; }
.ghost { background: transparent; border:1px solid rgba(255,255,255,.2); color:#e6f1ff; padding: 6px 10px; border-radius: 10px; }
.primary { background: linear-gradient(180deg, rgba(93,214,255,.35), rgba(93,214,255,.18)); border:1px solid rgba(255,255,255,.24); color:#0b1220; padding: 6px 10px; border-radius: 10px; font-weight: 700; }
.hi { font-size:.9rem; opacity:.9; }
</style>

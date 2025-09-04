<template>
  <div class="list">
    <label v-for="(it, i) in state" :key="i" class="row">
      <input type="checkbox" v-model="state[i].done" @change="persist" />
      <span :class="{done: state[i].done}">{{ it.label }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useAuthStore } from '@/store/auth';
import { loadChecklist, saveChecklist, type ChecklistRow } from '@/services/checklists';

const props = defineProps<{ slug: string; items: string[] }>();
const auth = useAuthStore();

const state = ref<ChecklistRow[]>([]);
let saveTimer: any = null;

function lsKey() { return `checklist:${props.slug}`; }

function loadLocal() {
  const raw = localStorage.getItem(lsKey());
  if (raw) {
    try { state.value = JSON.parse(raw); return; } catch {}
  }
  state.value = props.items.map(l => ({ label: l, done: false }));
}

function persistLocal() {
  localStorage.setItem(lsKey(), JSON.stringify(state.value));
}

async function loadRemote() {
  if (!auth.user) return loadLocal();
  const remote = await loadChecklist(auth.user.uid, props.slug);
  if (remote && remote.length) state.value = remote;
  else loadLocal(); // si pas de doc, initialise depuis local par défaut
}

function persistRemote() {
  if (auth.user) saveChecklist(auth.user.uid, props.slug, state.value).catch(() => {});
}

function persist() {
  // debounce pour éviter trop d'écritures
  persistLocal();
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { persistRemote(); }, 500);
}

onMounted(async () => {
  await loadRemote();
});

watch(() => props.items, () => {
  if (!state.value.length) state.value = props.items.map(l => ({ label: l, done: false }));
});
</script>

<style scoped>
.list { display: grid; gap: 10px; }
.row { display:flex; align-items:center; gap:.6rem; padding:.6rem .7rem; border-radius:12px; background: rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.12); }
.done { text-decoration: line-through; opacity:.7; }
</style>

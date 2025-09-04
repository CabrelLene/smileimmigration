// src/store/theme.ts
import { defineStore } from 'pinia';

export type ThemeMode = 'dark' | 'light' | 'system';

const STORAGE_KEY = 'ui:theme';

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  let effective: 'dark' | 'light' = 'dark';

  if (mode === 'system') {
    const mq = window.matchMedia?.('(prefers-color-scheme: light)');
    effective = mq?.matches ? 'light' : 'dark';
  } else {
    effective = mode;
  }
  root.setAttribute('data-theme', effective);
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: 'system' as ThemeMode
  }),
  actions: {
    init() {
      const saved = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) || 'system';
      this.mode = saved;
      applyTheme(this.mode);

      // Suivre le système si "system"
      if (this.mode === 'system') {
        const mq = window.matchMedia('(prefers-color-scheme: light)');
        mq.addEventListener?.('change', () => applyTheme('system'));
      }
    },
    set(mode: ThemeMode) {
      this.mode = mode;
      localStorage.setItem(STORAGE_KEY, mode);
      applyTheme(mode);
    },
    toggle() {
      // alterne dark <-> light (en gardant "system" si choisi manuellement)
      const current = document.documentElement.getAttribute('data-theme') as 'dark'|'light'|null;
      const next = current === 'light' ? 'dark' : 'light';
      this.set(next);
    }
  }
});

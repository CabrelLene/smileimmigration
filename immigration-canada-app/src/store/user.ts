import { defineStore } from 'pinia';

export type LanguageScores = {
  test: 'IELTS' | 'TEF' | 'TCF' | 'CELPIP' | null;
  reading?: number;
  writing?: number;
  listening?: number;
  speaking?: number;
};

export type UserProfile = {
  firstName?: string;
  lastName?: string;
  age?: number;
  education?: 'secondaire' | 'college' | 'bachelor' | 'master' | 'phd' | null;
  yearsExperience?: number;
  canadaExperience?: number;
  provinceInterest?: string | null;
  language: LanguageScores;
  progress: number; // 0-100
};

export const useUserStore = defineStore('user', {
  state: (): { profile: UserProfile } => ({
    profile: { language: { test: null }, progress: 0 }
  }),
  actions: {
    set<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
      (this.profile as any)[key] = value;
      this.computeProgress();
    },
    setLanguage(lang: LanguageScores) {
      this.profile.language = { ...this.profile.language, ...lang };
      this.computeProgress();
    },
    computeProgress() {
      // simple indicateur (on affinera)
      const p = this.profile;
      let done = 0;
      if (p.age) done += 15;
      if (p.education) done += 20;
      if (p.yearsExperience !== undefined) done += 15;
      if (p.language.test) done += 10;
      if (p.language.reading && p.language.writing && p.language.listening && p.language.speaking) done += 25;
      if (p.provinceInterest) done += 15;
      this.profile.progress = Math.min(100, done);
    }
  }
});

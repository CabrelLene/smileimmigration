// src/store/auth.ts
import { defineStore } from 'pinia';
import { auth } from '@/services/firebase';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  User
} from 'firebase/auth';
import { ensureUserDoc, getUserProfile, saveUserProfile, type FireUserProfile } from '@/services/userProfile';
import { useUserStore } from './user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    profile: null as FireUserProfile | null,
    ready: false,
    loading: false,
    error: '' as string | ''
  }),
  actions: {
    init() {
      if (this.ready) return;
      onAuthStateChanged(auth, async (u) => {
        this.user = u;
        if (u) {
          // charge profil Firestore + hydrate le store "user" (profil d'évaluation)
          const p = await getUserProfile(u.uid);
          const userStore = useUserStore();
          if (p) {
            this.profile = p;
            // Merge minimal vers le store d'évaluation
            if (p.age) userStore.set('age', p.age);
            if (p.education) userStore.set('education', p.education);
            if (p.yearsExperience !== undefined) userStore.set('yearsExperience', p.yearsExperience);
            if (p.canadaExperience !== undefined) userStore.set('canadaExperience', p.canadaExperience);
            if (p.provinceInterest) userStore.set('provinceInterest', p.provinceInterest);
            if (p.language) userStore.setLanguage(p.language);
          } else {
            // crée doc vide par défaut
            await ensureUserDoc(u.uid, { uid: u.uid, email: u.email || undefined });
            this.profile = { uid: u.uid, email: u.email || undefined, language: { test: null }, progress: 0 };
          }
        } else {
          this.profile = null;
        }
        this.ready = true;
      });
    },

    async signUp(email: string, password: string, displayName?: string) {
      this.loading = true; this.error = '';
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(cred.user, { displayName });
        }
        await ensureUserDoc(cred.user.uid, {
          uid: cred.user.uid,
          email,
          firstName: displayName,
          language: { test: null },
          progress: 0
        });
        this.user = cred.user;
        this.profile = { uid: cred.user.uid, email, firstName: displayName, language: { test: null }, progress: 0 };
        return true;
      } catch (e: any) {
        this.error = mapAuthError(e?.code || e?.message);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async signIn(email: string, password: string) {
      this.loading = true; this.error = '';
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        this.user = cred.user;
        const p = await getUserProfile(cred.user.uid);
        this.profile = p ?? { uid: cred.user.uid, email: cred.user.email || undefined, language: { test: null }, progress: 0 };
        return true;
      } catch (e: any) {
        this.error = mapAuthError(e?.code || e?.message);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async signOut() {
      await signOut(auth);
      this.user = null;
      this.profile = null;
    },

    async saveProfile(partial: Partial<FireUserProfile>) {
      if (!this.user) return;
      await saveUserProfile(this.user.uid, partial);
      this.profile = { ...(this.profile || { uid: this.user.uid }), ...partial };
    }
  }
});

function mapAuthError(code: string): string {
  if (!code) return 'Erreur inconnue';
  if (code.includes('auth/invalid-credential') || code.includes('auth/invalid-email')) return 'Identifiants invalides';
  if (code.includes('auth/email-already-in-use')) return 'Email déjà utilisé';
  if (code.includes('auth/weak-password')) return 'Mot de passe trop faible';
  if (code.includes('auth/too-many-requests')) return 'Trop de tentatives, réessaie plus tard';
  return code;
}

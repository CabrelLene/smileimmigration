// src/services/userProfile.ts
import { db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { UserProfile } from '@/store/user';

export type FireUserProfile = UserProfile & {
  uid: string;
  email?: string;
  createdAt?: any;
  updatedAt?: any;
};

const usersCol = (uid: string) => doc(db, 'users', uid);

export async function getUserProfile(uid: string): Promise<FireUserProfile | null> {
  const snap = await getDoc(usersCol(uid));
  if (!snap.exists()) return null;
  return snap.data() as FireUserProfile;
}

export async function ensureUserDoc(uid: string, data: Partial<FireUserProfile>) {
  await setDoc(usersCol(uid), {
    uid,
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function saveUserProfile(uid: string, data: Partial<FireUserProfile>) {
  await updateDoc(usersCol(uid), { ...data, updatedAt: serverTimestamp() });
}

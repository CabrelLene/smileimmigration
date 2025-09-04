// src/services/simulations.ts
import { db } from './firebase';
import {
  collection, doc, getDocs, setDoc, deleteDoc, serverTimestamp, query, orderBy
} from 'firebase/firestore';

export type SimParams = {
  // paramètres “état de base”
  age?: number;
  education?: 'secondaire' | 'college' | 'bachelor' | 'master' | 'phd' | null;
  yearsExperience?: number;
  canadaExperience?: number;
  language?: {
    test: 'IELTS' | 'TEF' | 'TCF' | 'CELPIP' | null;
    reading?: number; writing?: number; listening?: number; speaking?: number;
  };
  // variation appliquée (ex: +0.5 IELTS, +1 an XP…)
  delta?: { type: 'ielts+0.5' | 'xp+1' | 'custom'; payload?: any };
};

export type SimResult = {
  overallCLB?: number;
  expressEntryScore?: number;
  note?: string;
};

export type Simulation = {
  id: string;       // doc id
  name: string;     // ex: "IELTS +0.5"
  params: SimParams;
  result: SimResult;
  createdAt?: any;
  updatedAt?: any;
};

const col = (uid: string) => collection(db, 'users', uid, 'simulations');

export async function listSimulations(uid: string): Promise<Simulation[]> {
  const q = query(col(uid), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Simulation[];
}

export async function saveSimulation(uid: string, sim: Simulation) {
  const ref = doc(col(uid), sim.id);
  await setDoc(ref, { ...sim, updatedAt: serverTimestamp(), createdAt: sim.createdAt ?? serverTimestamp() }, { merge: true });
}

export async function deleteSimulation(uid: string, id: string) {
  const ref = doc(col(uid), id);
  await deleteDoc(ref);
}

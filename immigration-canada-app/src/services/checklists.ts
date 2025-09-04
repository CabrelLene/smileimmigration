// src/services/checklists.ts
import { db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export type ChecklistRow = { label: string; done: boolean };

export async function loadChecklist(uid: string, slug: string): Promise<ChecklistRow[] | null> {
  const ref = doc(db, 'users', uid, 'checklists', slug);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return (data.items ?? []) as ChecklistRow[];
}

export async function saveChecklist(uid: string, slug: string, items: ChecklistRow[]) {
  const ref = doc(db, 'users', uid, 'checklists', slug);
  await setDoc(ref, { items, updatedAt: serverTimestamp() }, { merge: true });
}

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import { Ano } from './types';

const anosRef = collection(db, 'anos');

export async function getTodosAnos(): Promise<Ano[]> {
  const q = query(anosRef, orderBy('ano', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ ...d.data(), ano: parseInt(d.id, 10) } as Ano));
}

export async function getAno(ano: number): Promise<Ano | null> {
  const docRef = doc(db, 'anos', ano.toString());
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { ...snapshot.data(), ano } as Ano;
}

export function onTodosAnos(callback: (anos: Ano[]) => void): Unsubscribe {
  const q = query(anosRef, orderBy('ano', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const anosData = snapshot.docs.map((d) => ({ ...d.data(), ano: parseInt(d.id, 10) } as Ano));
    callback(anosData);
  });
}

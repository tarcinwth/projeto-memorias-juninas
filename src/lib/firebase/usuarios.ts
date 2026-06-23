import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import { Usuario, CriarUsuarioInput } from './types';

export async function criarPerfil(uid: string, dados: CriarUsuarioInput): Promise<void> {
  const docRef = doc(db, 'usuarios', uid);
  await setDoc(docRef, {
    uid,
    ...dados,
    bio: dados.bio || null,
    avatarUrl: dados.avatarUrl || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    totalMemorias: 0,
    totalLikesRecebidos: 0,
    emailNotificacoes: true,
    perfilPublico: true,
  });
}

export async function getPerfil(uid: string): Promise<Usuario | null> {
  const docRef = doc(db, 'usuarios', uid);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return snapshot.data() as Usuario;
}

export async function atualizarPerfil(uid: string, dados: Partial<Usuario>): Promise<void> {
  const docRef = doc(db, 'usuarios', uid);
  await updateDoc(docRef, {
    ...dados,
    updatedAt: serverTimestamp(),
  });
}

export function onPerfil(uid: string, callback: (usuario: Usuario | null) => void): Unsubscribe {
  const docRef = doc(db, 'usuarios', uid);
  return onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    callback(snapshot.data() as Usuario);
  });
}

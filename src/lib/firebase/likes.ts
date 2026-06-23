import {
  doc,
  getDoc,
  collection,
  serverTimestamp,
  increment,
  writeBatch,
  onSnapshot,
  Unsubscribe,
  query,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from './config';

export async function curtirMemoria(memoriaId: string, userId: string): Promise<void> {
  const memoriaRef = doc(db, 'memorias', memoriaId);
  const likeRef = doc(collection(memoriaRef, 'likes'), userId);
  const usuarioRef = doc(db, 'usuarios', userId);

  // Check if like already exists to prevent duplicate increments
  const likeSnap = await getDoc(likeRef);
  if (likeSnap.exists()) {
    return; // Already liked
  }

  const memoriaSnap = await getDoc(memoriaRef);
  if (!memoriaSnap.exists()) return;
  
  const autorId = memoriaSnap.data().autorId;

  const batch = writeBatch(db);

  // Add the like to the subcollection
  batch.set(likeRef, {
    userId,
    createdAt: serverTimestamp(),
  });

  // Increment the likeCount on the memoria document
  batch.update(memoriaRef, {
    likeCount: increment(1),
  });

  // Also increment totalLikesRecebidos on the author's profile
  if (autorId) {
    const autorRef = doc(db, 'usuarios', autorId);
    batch.update(autorRef, {
      totalLikesRecebidos: increment(1),
    });
  }

  await batch.commit();
}

export async function descurtirMemoria(memoriaId: string, userId: string): Promise<void> {
  const memoriaRef = doc(db, 'memorias', memoriaId);
  const likeRef = doc(collection(memoriaRef, 'likes'), userId);

  const likeSnap = await getDoc(likeRef);
  if (!likeSnap.exists()) {
    return; // Not liked yet
  }

  const memoriaSnap = await getDoc(memoriaRef);
  if (!memoriaSnap.exists()) return;

  const autorId = memoriaSnap.data().autorId;

  const batch = writeBatch(db);

  batch.delete(likeRef);

  batch.update(memoriaRef, {
    likeCount: increment(-1),
  });

  if (autorId) {
    const autorRef = doc(db, 'usuarios', autorId);
    batch.update(autorRef, {
      totalLikesRecebidos: increment(-1),
    });
  }

  await batch.commit();
}

export async function verificarCurtida(memoriaId: string, userId: string): Promise<boolean> {
  const likeRef = doc(db, 'memorias', memoriaId, 'likes', userId);
  const snapshot = await getDoc(likeRef);
  return snapshot.exists();
}

export function onCurtidasMemoria(
  memoriaId: string,
  callback: (total: number, curtidoPeloUsuario: boolean, userId: string | null) => void,
  userId: string | null = null
): Unsubscribe {
  const memoriaRef = doc(db, 'memorias', memoriaId);

  // Note: For real-time updates we listen to the parent document's `likeCount`.
  // The specific "curtidoPeloUsuario" can also be listened to via a separate snapshot
  // but it's simpler to listen to the like subcollection doc directly if a user is provided.

  let parentUnsubscribe: Unsubscribe;
  let userLikeUnsubscribe: Unsubscribe | undefined;

  let currentTotal = 0;
  let currentUserLiked = false;

  parentUnsubscribe = onSnapshot(memoriaRef, (snapshot) => {
    if (snapshot.exists()) {
      currentTotal = snapshot.data().likeCount || 0;
      callback(currentTotal, currentUserLiked, userId);
    }
  });

  if (userId) {
    const likeRef = doc(db, 'memorias', memoriaId, 'likes', userId);
    userLikeUnsubscribe = onSnapshot(likeRef, (snapshot) => {
      currentUserLiked = snapshot.exists();
      callback(currentTotal, currentUserLiked, userId);
    });
  }

  return () => {
    parentUnsubscribe();
    if (userLikeUnsubscribe) userLikeUnsubscribe();
  };
}

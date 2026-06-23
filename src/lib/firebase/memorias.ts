import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  increment,
  onSnapshot,
  QueryDocumentSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import { Memoria, FiltrosGaleria, CriarMemoriaInput } from './types';

const memoriasRef = collection(db, 'memorias');

export async function getAnosDisponiveis(): Promise<number[]> {
  const q = query(memoriasRef, where('status', '==', 'aprovado'));
  const snapshot = await getDocs(q);
  const anos = new Set<number>();
  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (data.anoDoSaoJoao) {
      anos.add(Number(data.anoDoSaoJoao));
    }
  });
  return Array.from(anos).sort((a, b) => b - a); // Descending order
}

export async function getMemoriasAprovadas(filtros: FiltrosGaleria): Promise<Memoria[]> {
  const constraints: any[] = [where('status', '==', 'aprovado')];

  if (filtros.categoria) {
    constraints.push(where('categoria', '==', filtros.categoria));
  }

  if (filtros.anoMin && filtros.anoMax) {
    constraints.push(where('anoDoSaoJoao', '>=', filtros.anoMin));
    constraints.push(where('anoDoSaoJoao', '<=', filtros.anoMax));
  } else if (filtros.anoMin) {
    constraints.push(where('anoDoSaoJoao', '==', filtros.anoMin));
  }

  if (filtros.busca) {
    const term = filtros.busca.toLowerCase();
    constraints.push(where('searchTokens', 'array-contains', term));
  }

  // Order based on the active filters to use the composed indexes properly
  if (filtros.categoria && !filtros.anoMin && !filtros.busca) {
    constraints.push(orderBy('categoria', 'asc'));
    constraints.push(orderBy('createdAt', 'desc'));
  } else if (filtros.anoMin || filtros.anoMax) {
    // Matches the existing index: status (ASCENDING), anoDoSaoJoao (DESCENDING)
    constraints.push(orderBy('anoDoSaoJoao', 'desc'));
  } else {
    // Basic fallback ordering
    constraints.push(orderBy('createdAt', 'desc'));
  }

  if (filtros.cursor) {
    constraints.push(startAfter(filtros.cursor));
  }

  if (filtros.limite) {
    constraints.push(limit(filtros.limite));
  }

  const q = query(memoriasRef, ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => {
    const data = d.data();
    return { ...data, id: d.id } as Memoria;
  });
}

export async function getMemoriaById(id: string): Promise<Memoria | null> {
  const docRef = doc(db, 'memorias', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { ...snapshot.data(), id: snapshot.id } as Memoria;
}

export async function getMemoriasByAno(ano: number): Promise<Memoria[]> {
  const q = query(
    memoriasRef,
    where('status', '==', 'aprovado'),
    where('anoDoSaoJoao', '==', ano),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Memoria));
}

export async function getMemoriasByCategoria(categoria: string): Promise<Memoria[]> {
  const q = query(
    memoriasRef,
    where('status', '==', 'aprovado'),
    where('categoria', '==', categoria),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Memoria));
}

export async function getMemoriasByAutor(autorId: string): Promise<Memoria[]> {
  const q = query(
    memoriasRef,
    where('autorId', '==', autorId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Memoria));
}

export async function criarMemoria(data: CriarMemoriaInput): Promise<string> {
  const searchTokens = [
    ...data.titulo.toLowerCase().split(' '),
    ...(data.tags ? data.tags.map((t) => t.toLowerCase()) : []),
    data.categoria.toLowerCase(),
    data.anoDoSaoJoao.toString(),
  ].filter((t) => t.length > 0);

  const docData = {
    ...data,
    status: 'pendente',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    likeCount: 0,
    comentarioCount: 0,
    viewCount: 0,
    searchTokens,
  };

  const docRef = await addDoc(memoriasRef, docData);
  
  // Create an entry in moderacao collection
  const filaRef = collection(db, 'moderacao');
  await addDoc(filaRef, {
    memoriaId: docRef.id,
    autorId: data.autorId,
    autorNome: data.autorNome,
    titulo: data.titulo,
    tipo: data.tipo,
    mediaUrl: data.mediaUrl,
    createdAt: serverTimestamp(),
    status: 'pendente'
  });

  return docRef.id;
}

export async function atualizarMemoria(id: string, data: Partial<Memoria>): Promise<void> {
  const docRef = doc(db, 'memorias', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deletarMemoria(id: string): Promise<void> {
  const docRef = doc(db, 'memorias', id);
  await deleteDoc(docRef);
}

export async function incrementarVisualizacao(id: string): Promise<void> {
  const docRef = doc(db, 'memorias', id);
  await updateDoc(docRef, {
    viewCount: increment(1),
  });
}

export function onMemoriasAprovadas(callback: (memorias: Memoria[]) => void): Unsubscribe {
  const q = query(
    memoriasRef,
    where('status', '==', 'aprovado'),
    orderBy('anoDoSaoJoao', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const mems = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Memoria));
    callback(mems);
  });
}

export function onMemoriaById(id: string, callback: (memoria: Memoria | null) => void): Unsubscribe {
  const docRef = doc(db, 'memorias', id);
  return onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    callback({ ...snapshot.data(), id: snapshot.id } as Memoria);
  });
}

export async function getFilaModeracao(): Promise<any[]> {
  const q = query(
    collection(db, 'moderacao'),
    where('status', '==', 'pendente'),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
}

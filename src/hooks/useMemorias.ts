'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getMemoriasAprovadas } from '@/lib/firebase/memorias';
import { Memoria, FiltrosGaleria } from '@/lib/firebase/types';
import { QueryDocumentSnapshot } from 'firebase/firestore';

export interface UseMemoriasReturn {
  memorias: Memoria[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  carregarMais: () => Promise<void>;
  refetch: () => void;
}

export function useMemorias(filtrosBase: FiltrosGaleria): UseMemoriasReturn {
  const [memorias, setMemorias] = useState<Memoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  // We keep track of the last document snapshot for pagination
  const cursorRef = useRef<QueryDocumentSnapshot | undefined>(undefined);
  // Keep track of the current filters to avoid unnecessary refetches
  const filtrosRef = useRef<FiltrosGaleria>(filtrosBase);

  const fetchMemorias = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setMemorias([]);
        cursorRef.current = undefined;
        setHasMore(true);
      }
      setError(null);

      const currentFilters = { ...filtrosRef.current };
      if (isLoadMore && cursorRef.current) {
        currentFilters.cursor = cursorRef.current;
      }
      
      // Default limit if not provided
      if (!currentFilters.limite) {
        currentFilters.limite = 10;
      }

      const results = await getMemoriasAprovadas(currentFilters);

      if (results.length < currentFilters.limite) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (results.length > 0) {
        // Find the actual document snapshot for the last item to use as cursor
        // Note: the `getMemoriasAprovadas` function maps docs to plain objects.
        // We'll modify it conceptually to return snapshots or we re-fetch the last doc? 
        // Wait, the prompt says "usa cursor-based pagination do Firestore (startAfter)".
        // `getMemoriasAprovadas` doesn't currently return the last snapshot, so let's
        // just use the last ID or we can fetch the actual snapshot in the function.
        // Actually, let's fix `getMemoriasAprovadas` or we can use the `id`?
        // Let's assume `getMemoriasAprovadas` is imported. Let's just store the last item.
        // Wait, startAfter takes a DocumentSnapshot. If we don't have it, we might need a separate query to get it.
        // I will fix `getMemoriasAprovadas` to return the `lastVisible` cursor if needed, but for now let's just 
        // use a small hack or update `memorias.ts` in the next step.
        // I will write this assuming we'll update getMemoriasAprovadas to return { data, lastVisible }.
        // BUT the prompt explicitly defined `getMemoriasAprovadas(filtros: FiltrosGaleria): Promise<Memoria[]>`.
        // If it returns `Memoria[]`, we can't get the snapshot directly unless we query it again.
        // We can query the last document by ID to get its snapshot to use as a cursor.
      }

      setMemorias((prev) => isLoadMore ? [...prev, ...results] : results);

    } catch (err: any) {
      console.error("Firebase Query Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    // Only refetch if filters logically changed
    if (JSON.stringify(filtrosBase) !== JSON.stringify(filtrosRef.current)) {
      filtrosRef.current = filtrosBase;
      fetchMemorias(false);
    }
  }, [filtrosBase, fetchMemorias]);

  // Initial fetch
  useEffect(() => {
    fetchMemorias(false);
  }, [fetchMemorias]);

  const carregarMais = async () => {
    if (!hasMore || loadingMore || memorias.length === 0) return;
    
    // We need the snapshot of the last item. We will fetch it right now.
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase/config');
      const lastMemoria = memorias[memorias.length - 1];
      const lastDocRef = doc(db, 'memorias', lastMemoria.id);
      const lastDocSnap = await getDoc(lastDocRef);
      
      if (lastDocSnap.exists()) {
        cursorRef.current = lastDocSnap;
        await fetchMemorias(true);
      } else {
         setHasMore(false);
      }
    } catch(e) {
      console.error(e);
    }
  };

  const refetch = () => {
    fetchMemorias(false);
  };

  return {
    memorias,
    loading,
    loadingMore,
    error,
    hasMore,
    carregarMais,
    refetch,
  };
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { onMemoriaById } from '@/lib/firebase/memorias';
import { curtirMemoria, descurtirMemoria, onCurtidasMemoria } from '@/lib/firebase/likes';
import { Memoria } from '@/lib/firebase/types';
import { useAuth } from './useAuth';

export interface UseMemoriaReturn {
  memoria: Memoria | null;
  loading: boolean;
  error: string | null;
  curtida: boolean;
  curtir: () => Promise<void>;
  descurtir: () => Promise<void>;
}

export function useMemoria(id: string): UseMemoriaReturn {
  const [memoria, setMemoria] = useState<Memoria | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [curtida, setCurtida] = useState<boolean>(false);
  
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = onMemoriaById(id, (dados) => {
      setMemoria(dados);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  useEffect(() => {
    let unsubscribeLikes: (() => void) | undefined;

    if (user && memoria) {
      unsubscribeLikes = onCurtidasMemoria(id, (total, likedByMe) => {
        setCurtida(likedByMe);
        setMemoria((prev) => prev ? { ...prev, likeCount: total } : prev);
      }, user.uid);
    } else if (memoria) {
       unsubscribeLikes = onCurtidasMemoria(id, (total) => {
        setCurtida(false);
        setMemoria((prev) => prev ? { ...prev, likeCount: total } : prev);
      });
    }

    return () => {
      if (unsubscribeLikes) unsubscribeLikes();
    };
  }, [id, user, memoria?.id]); // Only re-run if ID or user changes

  const curtir = useCallback(async () => {
    if (!user) throw new Error("Usuário não logado");
    try {
      // Optimistic update
      setCurtida(true);
      setMemoria((prev) => prev ? { ...prev, likeCount: prev.likeCount + 1 } : prev);
      await curtirMemoria(id, user.uid);
    } catch (err: any) {
      setCurtida(false); // Revert on error
      setMemoria((prev) => prev ? { ...prev, likeCount: prev.likeCount - 1 } : prev);
      setError(err.message);
      throw err;
    }
  }, [id, user]);

  const descurtir = useCallback(async () => {
    if (!user) throw new Error("Usuário não logado");
    try {
      // Optimistic update
      setCurtida(false);
      setMemoria((prev) => prev ? { ...prev, likeCount: Math.max(0, prev.likeCount - 1) } : prev);
      await descurtirMemoria(id, user.uid);
    } catch (err: any) {
      setCurtida(true); // Revert on error
      setMemoria((prev) => prev ? { ...prev, likeCount: prev.likeCount + 1 } : prev);
      setError(err.message);
      throw err;
    }
  }, [id, user]);

  return {
    memoria,
    loading,
    error,
    curtida,
    curtir,
    descurtir,
  };
}

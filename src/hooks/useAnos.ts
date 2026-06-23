'use client';

import { useState, useEffect } from 'react';
import { onTodosAnos } from '@/lib/firebase/anos';
import { Ano } from '@/lib/firebase/types';

export interface UseAnosReturn {
  anos: Ano[];
  loading: boolean;
  error: string | null;
}

export function useAnos(): UseAnosReturn {
  const [anos, setAnos] = useState<Ano[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = onTodosAnos((dados) => {
      setAnos(dados);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    anos,
    loading,
    error,
  };
}

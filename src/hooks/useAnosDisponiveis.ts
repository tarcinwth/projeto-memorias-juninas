'use client';

import { useState, useEffect } from 'react';
import { getAnosDisponiveis } from '@/lib/firebase/memorias';

export function useAnosDisponiveis() {
  const [anos, setAnos] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnos() {
      try {
        const anosData = await getAnosDisponiveis();
        setAnos(anosData);
      } catch (e) {
        console.error('Erro ao buscar anos disponiveis:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchAnos();
  }, []);

  return { anos, loading };
}

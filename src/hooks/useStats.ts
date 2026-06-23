'use client';

import { useState, useEffect } from 'react';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export function useStats() {
  const [stats, setStats] = useState({
    totalMemorias: 0,
    totalAnos: 0,
    totalContribuidores: 0,
    totalCidades: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const q = query(collection(db, 'memorias'), where('status', '==', 'aprovado'));
        const snapshot = await getCountFromServer(q);
        const count = snapshot.data().count;
        
        setStats({
          totalMemorias: count,
          totalAnos: count > 0 ? 1 : 0, 
          totalContribuidores: count,   
          totalCidades: 1               
        });
      } catch(e) {
        console.error('Erro ao carregar estatisticas:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return { stats, loading };
}

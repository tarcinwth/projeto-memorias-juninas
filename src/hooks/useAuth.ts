'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import { getPerfil, criarPerfil, onPerfil } from '@/lib/firebase/usuarios';
import { Usuario } from '@/lib/firebase/types';
import { User } from 'firebase/auth';

export interface UseAuthReturn {
  user: User | null;
  usuario: Usuario | null;
  loading: boolean;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [user, authLoading, authError] = useAuthState(auth);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Tenta processar o resultado do signInWithRedirect caso a página tenha recarregado
    import('firebase/auth').then(({ getRedirectResult }) => {
      getRedirectResult(auth).catch((err) => {
        console.error('Erro no redirecionamento do Firebase:', err);
      });
    });
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchOrCreateProfile = async () => {
      if (!user) {
        setUsuario(null);
        setLoadingProfile(false);
        return;
      }

      setLoadingProfile(true);
      setError(null);

      try {
        let perfil = await getPerfil(user.uid);
        
        if (!perfil) {
          // If no profile exists, create one with basic data from the provider
          await criarPerfil(user.uid, {
            nome: user.displayName || 'Usuário Sem Nome',
            cidade: 'Desconhecida',
            avatarUrl: user.photoURL,
          });
          perfil = await getPerfil(user.uid);
        }

        // Setup real-time listener for profile updates
        unsubscribe = onPerfil(user.uid, (data) => {
          setUsuario(data);
          setLoadingProfile(false);
        });

      } catch (err: any) {
        setError(err.message);
        setLoadingProfile(false);
      }
    };

    fetchOrCreateProfile();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  return {
    user: user || null,
    usuario,
    loading: authLoading || loadingProfile,
    error: authError?.message || error,
  };
}

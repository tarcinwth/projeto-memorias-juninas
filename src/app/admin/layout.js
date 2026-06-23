'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const ADMIN_EMAIL = 'tarciio.spotify@gmail.com';

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in -> go to home
        router.replace('/');
      } else if (user.email !== ADMIN_EMAIL) {
        // Logged in but not admin -> stay on page but show unauthorized state
        setIsAuthorized(false);
      } else {
        // Admin -> Authorized
        setIsAuthorized(true);
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>Verificando credenciais...</p>
      </div>
    );
  }

  if (user && user.email !== ADMIN_EMAIL) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-canvas)' }}>
        <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--color-surface)', borderRadius: '16px', border: '1px solid var(--color-border)', maxWidth: '400px' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔒</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Acesso Negado</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Esta área é restrita para moderação. Se você for administrador, faça login com a conta correta.
          </p>
          <button onClick={() => router.push('/')} className="btn-secondary">Voltar para Início</button>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Prevents flashing content before redirect
  }

  return (
    <div className="admin-wrapper" style={{ minHeight: '100vh', background: 'var(--color-surface-warm)' }}>
      {children}
    </div>
  );
}

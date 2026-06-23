'use client';

import { useState } from 'react';
import { entrarComGoogle } from '@/lib/firebase/auth';
import { X, GoogleLogo, Spinner } from '@phosphor-icons/react';

export default function AuthModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleGoogleLogin() {
    try {
      await entrarComGoogle();
      onClose(); // Close modal on success
    } catch (err) {
      console.error(err);
      setError('Erro ao fazer login com o Google. Tente novamente.');
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(42, 24, 16, 0.4)',
        backdropFilter: 'blur(4px)',
        padding: '1rem',
      }}
    >
      <div
        className="card-bezel"
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--color-surface)',
          animation: 'menu-open 300ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <div className="card-inner" style={{ padding: '2rem', position: 'relative' }}>
          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
            }}
          >
            <X size={24} />
          </button>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.5rem',
              textAlign: 'center',
            }}
          >
            Acesse sua conta
          </h2>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '0.9rem',
              textAlign: 'center',
              marginBottom: '2rem',
              lineHeight: 1.5,
            }}
          >
            Entre para enviar suas memórias, curtir fotos e fazer parte do arquivo do São João.
          </p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '0.875rem',
              fontSize: '1rem',
              background: '#FFFFFF',
              color: '#333333',
              border: '1px solid #DDDDDD',
            }}
          >
            {loading ? (
              <Spinner size={20} className="spin" />
            ) : (
              <>
                <GoogleLogo size={20} weight="bold" color="#DB4437" />
                Continuar com Google
              </>
            )}
          </button>

          {error && (
            <p style={{ color: 'var(--color-fire)', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { X, GoogleLogo } from '@phosphor-icons/react';
import { entrarComGoogle } from '@/lib/firebase/auth';

export default function AuthModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  async function handleLogin() {
    try {
      await entrarComGoogle();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(42,24,16,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: '1.5rem',
          padding: '2.5rem 2rem',
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
          boxShadow: '0 24px 48px rgba(42,24,16,0.2)',
        }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        <h2
          id="auth-modal-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            color: 'var(--color-text-primary)',
            textAlign: 'center',
            marginBottom: '0.5rem',
          }}
        >
          Entre para participar
        </h2>
        <p
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: '0.9375rem',
            textAlign: 'center',
            marginBottom: '2rem',
            lineHeight: 1.5,
          }}
        >
          Faça login para enviar memórias, curtir fotos e fazer parte do acervo.
        </p>

        {error && (
          <div style={{ color: 'var(--color-fire)', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="btn-primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            background: 'var(--color-text-primary)',
            color: 'var(--color-canvas)',
            border: 'none',
            opacity: loading ? 0.7 : 1,
          }}
        >
          <GoogleLogo size={20} weight="bold" />
          {loading ? 'Entrando...' : 'Entrar com Google'}
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getFilaModeracao } from '@/lib/firebase/memorias';
import { CheckCircle, XCircle, Spinner, Image as ImageIcon } from '@phosphor-icons/react';
import Image from 'next/image';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [memorias, setMemorias] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (user && user.email === adminEmail) {
      fetchFila();
    } else if (!loading) {
      setFetching(false);
    }
  }, [user, loading, adminEmail]);

  async function fetchFila() {
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/moderacao', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const text = await res.text();
        let errorMsg = 'Falha ao carregar fila';
        try {
          const errData = JSON.parse(text);
          errorMsg = errData.error || errorMsg;
        } catch(e) {}
        throw new Error(errorMsg);
      }
      const data = await res.json();
      setMemorias(data);
    } catch (err) {
      console.error('Erro ao buscar fila:', err);
    } finally {
      setFetching(false);
    }
  }

  async function handleAction(memoriaId, action) {
    if (!user) return;
    setProcessingId(memoriaId);

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/moderacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ memoriaId, action })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro na operação');
      }

      // Remove from list
      setMemorias(prev => prev.filter(m => m.memoriaId !== memoriaId));
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  }

  if (loading || fetching) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <Spinner size={32} className="spin" style={{ color: 'var(--color-accent)' }} />
      </div>
    );
  }

  if (!user || user.email !== adminEmail) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <h2>Acesso Negado</h2>
        <p>Apenas administradores podem acessar esta página.</p>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '8rem', paddingBottom: '5rem', minHeight: '100vh', background: 'var(--color-surface-warm)' }}>
      <div className="container-main" style={{ maxWidth: '900px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
          Painel de Moderação
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
          Revise as memórias enviadas pelo público antes que elas apareçam no acervo.
        </p>

        {memorias.length === 0 ? (
          <div className="card-bezel" style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-surface)' }}>
            <CheckCircle size={48} color="var(--color-verde)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Tudo limpo por aqui!
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Não há memórias pendentes de moderação no momento.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {memorias.map(memoria => (
              <div
                key={memoria.id}
                className="card-bezel"
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'var(--color-surface)',
                  alignItems: 'center',
                  opacity: processingId === memoria.memoriaId ? 0.5 : 1,
                  pointerEvents: processingId === memoria.memoriaId ? 'none' : 'auto',
                }}
              >
                {/* Thumbnail */}
                <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: '#eee', flexShrink: 0, position: 'relative' }}>
                  {memoria.mediaUrl ? (
                    (memoria.tipo === 'video' || memoria.tipoMidia === 'video') ? (
                      <video src={memoria.mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop autoPlay playsInline />
                    ) : (
                      <Image src={memoria.mediaUrl} alt="Thumbnail" fill style={{ objectFit: 'cover' }} />
                    )
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <ImageIcon size={24} color="#ccc" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', margin: '0 0 0.25rem 0' }}>
                    {memoria.titulo}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                    Por: <strong>{memoria.autorNome}</strong>
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, textTransform: 'uppercase', marginTop: '0.25rem' }}>
                    Tipo: {memoria.tipoMidia}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleAction(memoria.memoriaId, 'aprovar')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: 'var(--color-verde-light)',
                      color: 'var(--color-verde)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }}
                  >
                    <CheckCircle size={18} weight="bold" />
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleAction(memoria.memoriaId, 'rejeitar')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: 'var(--color-fire-light)',
                      color: 'var(--color-fire)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }}
                  >
                    <XCircle size={18} weight="bold" />
                    Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

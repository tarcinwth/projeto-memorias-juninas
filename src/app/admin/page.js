'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, XCircle, Spinner, Image as ImageIcon, VideoCamera, EyeSlash, Eye } from '@phosphor-icons/react';
import Image from 'next/image';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('fila'); // 'fila' ou 'acervo'
  const [memorias, setMemorias] = useState([]);
  const [acervo, setAcervo] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (user && user.email === adminEmail) {
      if (activeTab === 'fila') {
        fetchFila();
      } else {
        fetchAcervo();
      }
    } else if (!loading) {
      setFetching(false);
    }
  }, [user, loading, adminEmail, activeTab]);

  async function fetchFila() {
    setFetching(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/moderacao', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Falha ao carregar fila');
      const data = await res.json();
      setMemorias(data);
    } catch (err) {
      console.error('Erro ao buscar fila:', err);
    } finally {
      setFetching(false);
    }
  }

  async function fetchAcervo() {
    setFetching(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/acervo', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Falha ao carregar acervo');
      const data = await res.json();
      setAcervo(data);
    } catch (err) {
      console.error('Erro ao buscar acervo:', err);
    } finally {
      setFetching(false);
    }
  }

  async function handleModeracao(memoriaId, action) {
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

      if (!res.ok) throw new Error('Erro na operação');
      setMemorias(prev => prev.filter(m => m.memoriaId !== memoriaId));
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  }

  async function handleAcervoAction(memoriaId, action, newType = null) {
    if (!user) return;
    
    if (action === 'ocultar' && !confirm('Tem certeza que deseja ocultar esta memória do site?')) {
      return;
    }

    setProcessingId(memoriaId);

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/acervo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ memoriaId, action, newType })
      });

      if (!res.ok) throw new Error('Erro na operação');
      
      // Atualizar a lista localmente para refletir a mudança
      setAcervo(prev => prev.map(m => {
        if (m.id === memoriaId || m.memoriaId === memoriaId) {
          if (action === 'ocultar') return { ...m, status: 'oculto' };
          if (action === 'republicar') return { ...m, status: 'aprovado' };
          if (action === 'alterar_tipo') return { ...m, tipoMidia: newType };
        }
        return m;
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
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
          Painel de Administração
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
          Gerencie as submissões e o acervo público.
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
          <button
            onClick={() => setActiveTab('fila')}
            style={{
              padding: '1rem 2rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'fila' ? '3px solid var(--color-accent)' : '3px solid transparent',
              color: activeTab === 'fila' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Fila de Moderação {activeTab === 'fila' && !fetching && `(${memorias.length})`}
          </button>
          <button
            onClick={() => setActiveTab('acervo')}
            style={{
              padding: '1rem 2rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'acervo' ? '3px solid var(--color-accent)' : '3px solid transparent',
              color: activeTab === 'acervo' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Gerenciar Acervo {activeTab === 'acervo' && !fetching && `(${acervo.length})`}
          </button>
        </div>

        {fetching ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <Spinner size={32} className="spin" style={{ color: 'var(--color-accent)' }} />
          </div>
        ) : activeTab === 'fila' ? (
          /* FILA DE MODERAÇÃO */
          memorias.length === 0 ? (
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
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', margin: '0 0 0.25rem 0' }}>{memoria.titulo}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>Por: <strong>{memoria.autorNome}</strong></p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, textTransform: 'uppercase', marginTop: '0.25rem' }}>Tipo: {memoria.tipoMidia}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleModeracao(memoria.memoriaId, 'aprovar')}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: 'var(--color-verde-light)', color: 'var(--color-verde)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
                    >
                      <CheckCircle size={18} weight="bold" />
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleModeracao(memoria.memoriaId, 'rejeitar')}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: 'var(--color-fire-light)', color: 'var(--color-fire)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
                    >
                      <XCircle size={18} weight="bold" />
                      Rejeitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* GERENCIAR ACERVO */
          acervo.length === 0 ? (
            <div className="card-bezel" style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-surface)' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>O acervo está vazio.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {acervo.map(memoria => (
                <div
                  key={memoria.id}
                  className="card-bezel"
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    background: memoria.status === 'oculto' ? 'var(--color-surface-warm)' : 'var(--color-surface)',
                    alignItems: 'center',
                    opacity: processingId === (memoria.id || memoria.memoriaId) ? 0.5 : 1,
                    pointerEvents: processingId === (memoria.id || memoria.memoriaId) ? 'none' : 'auto',
                    border: memoria.status === 'oculto' ? '1px dashed var(--color-fire)' : '1px solid transparent'
                  }}
                >
                  <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: '#eee', flexShrink: 0, position: 'relative', opacity: memoria.status === 'oculto' ? 0.5 : 1 }}>
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
                  
                  <div style={{ flex: 1, opacity: memoria.status === 'oculto' ? 0.5 : 1 }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', margin: '0 0 0.25rem 0' }}>{memoria.titulo}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>Por: <strong>{memoria.autorNome}</strong></p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, textTransform: 'uppercase', marginTop: '0.25rem' }}>
                      Status: <span style={{ color: memoria.status === 'oculto' ? 'var(--color-fire)' : 'var(--color-verde)', fontWeight: 'bold' }}>{memoria.status}</span>
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '300px' }}>
                    {/* Botão de Alternar Tipo */}
                    {memoria.tipoMidia === 'imagem' ? (
                      <button
                        onClick={() => handleAcervoAction(memoria.id || memoria.memoriaId, 'alterar_tipo', 'video')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-primary)', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        <VideoCamera size={16} /> Mudar p/ Vídeo
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAcervoAction(memoria.id || memoria.memoriaId, 'alterar_tipo', 'imagem')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-primary)', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        <ImageIcon size={16} /> Mudar p/ Foto
                      </button>
                    )}

                    {/* Botão de Ocultar/Republicar */}
                    {memoria.status === 'aprovado' ? (
                      <button
                        onClick={() => handleAcervoAction(memoria.id || memoria.memoriaId, 'ocultar')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', borderRadius: '4px', border: 'none', background: 'var(--color-fire-light)', color: 'var(--color-fire)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        <EyeSlash size={16} weight="bold" /> Ocultar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAcervoAction(memoria.id || memoria.memoriaId, 'republicar')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', borderRadius: '4px', border: 'none', background: 'var(--color-verde-light)', color: 'var(--color-verde)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        <Eye size={16} weight="bold" /> Republicar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, MapPin, Calendar, Tag, ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import MemoryCard, { MemoryCardSkeleton } from '@/components/ui/MemoryCard';
import { useMemoria } from '@/hooks/useMemoria';
import { useMemorias } from '@/hooks/useMemorias';

const CATEGORIAS_ESTATICAS = {
  'quadrilha': { label: 'Quadrilhas Juninas', badgeClass: 'badge-quadrilha' },
  'shows': { label: 'Shows & Palcos', badgeClass: 'badge-shows' },
  'vila-junina': { label: 'Vila Junina', badgeClass: 'badge-vila' },
  'vila': { label: 'Vila Junina', badgeClass: 'badge-vila' },
  'familia': { label: 'Família & Amigos', badgeClass: 'badge-familia' },
  'comida': { label: 'Comidas & Bebidas', badgeClass: 'badge-comida' },
  'comidas': { label: 'Comidas & Bebidas', badgeClass: 'badge-comida' },
  'fogueira': { label: 'Ao Redor da Fogueira', badgeClass: 'badge-fogueira' },
  'outros': { label: 'Memórias Diversas', badgeClass: 'badge-outros' }
};

function getCategoryBadgeClass(catId) {
  return CATEGORIAS_ESTATICAS[catId]?.badgeClass || 'badge-outros';
}

function getCategoryLabel(catId) {
  return CATEGORIAS_ESTATICAS[catId]?.label || 'Memória';
}


export default function MemoryDetailPage({ params }) {
  const unwrappedParams = use(params);
  const { memoria: memory, loading, error, curtida, curtir, descurtir } = useMemoria(unwrappedParams.id);
  const router = useRouter();
  const [heartAnimating, setHeartAnimating] = useState(false);

  // Fetch related memories
  const { memorias: todasMemorias } = useMemorias({ limite: 20 });
  
  useEffect(() => {
    if (!loading && !memory) router.replace('/acervo');
  }, [memory, loading, router]);

  if (loading) {
    return (
      <div style={{ paddingTop: '10rem', display: 'flex', justifyContent: 'center' }}>
        <p>Carregando memória...</p>
      </div>
    );
  }

  if (!memory) return null;

  async function handleLike() {
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 400);
    if (curtida) {
      await descurtir();
    } else {
      await curtir();
    }
  }

  // Related memories: same year or same category
  const related = todasMemorias
    .filter(m => m.id !== memory.id && (m.anoDoSaoJoao === memory.anoDoSaoJoao || m.categoria === memory.categoria))
    .slice(0, 4);

  const badgeClass = getCategoryBadgeClass(memory.categoria);
  const categoryLabel = getCategoryLabel(memory.categoria);
  const isVideo = memory.tipo === 'video' || memory.tipoMidia === 'video';

  return (
    <>
      {/* Breadcrumb */}
      <div
        style={{
          paddingTop: 'clamp(5.5rem, 10vw, 8rem)',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-canvas)',
        }}
      >
        <div className="container-main">
          <nav aria-label="Navegação estrutural" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            <Link href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 150ms' }}>Início</Link>
            <span>/</span>
            <Link href="/acervo" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 150ms' }}>Acervo</Link>
            <span>/</span>
            <Link href={`/acervo?anoMin=${memory.anoDoSaoJoao}&anoMax=${memory.anoDoSaoJoao}`} style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>{memory.anoDoSaoJoao}</Link>
            <span>/</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>{memory.titulo}</span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <article style={{ background: 'var(--color-canvas)', paddingBlock: 'clamp(2.5rem, 5vw, 5rem)' }}>
        <div className="container-main">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '3fr 2fr',
              gap: 'clamp(2rem, 4vw, 4rem)',
              alignItems: 'start',
            }}
            className="detail-grid"
          >
            {/* Left: Image/Video */}
            <div>
              {/* Double-Bezel media */}
              <div
                style={{
                  padding: '8px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '1.5rem',
                  boxShadow: '0 8px 40px rgba(42,24,16,0.1)',
                }}
              >
                <div
                  style={{
                    borderRadius: 'calc(1.5rem - 8px)',
                    overflow: 'hidden',
                    position: 'relative',
                    aspectRatio: '4/3',
                    background: 'var(--color-surface-warm)',
                  }}
                >
                  {memory.mediaUrl ? (
                    isVideo ? (
                      <video
                        src={memory.mediaUrl}
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Image
                        src={memory.mediaUrl}
                        alt={memory.titulo}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 60vw"
                        style={{ objectFit: 'cover' }}
                      />
                    )
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       Sem mídia
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {memory.tags && (
                <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {memory.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/acervo?busca=${encodeURIComponent(tag)}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        background: 'var(--color-surface-warm)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-body)',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '999px',
                        textDecoration: 'none',
                        transition: 'border-color 200ms, background 200ms',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-fire)'; e.currentTarget.style.background = 'var(--color-fire-light)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'var(--color-surface-warm)'; }}
                    >
                      <Tag size={10} aria-hidden="true" />
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Metadata + story */}
            <div style={{ position: 'sticky', top: 'calc(5rem + 1.5rem)' }}>
              {/* Category + year */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span
                  className={`tag-label ${badgeClass}`}
                  style={{ padding: '0.2rem 0.625rem', borderRadius: '999px', display: 'inline-block' }}
                >
                  {categoryLabel}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-muted)',
                    fontWeight: 500,
                  }}
                >
                  {memory.anoDoSaoJoao}
                </span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  marginBottom: '1.75rem',
                }}
              >
                {memory.titulo}
              </h1>

              {/* Meta block */}
              <div
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: 'var(--color-surface-warm)',
                      border: '1px solid var(--color-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9375rem', color: 'var(--color-accent)',
                      fontFamily: 'var(--font-display)', fontWeight: 700,
                    }}
                  >
                    {memory.autorNome ? memory.autorNome.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {memory.autorNome}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                      Contribuidor
                    </div>
                  </div>
                </div>

                <div style={{ height: '1px', background: 'var(--color-divider)' }} />

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-text-muted)', fontSize: '0.8125rem', fontFamily: 'var(--font-body)' }}>
                    <MapPin size={14} aria-hidden="true" />
                    <span>{memory.autorCidade}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-text-muted)', fontSize: '0.8125rem', fontFamily: 'var(--font-body)' }}>
                    <Calendar size={14} aria-hidden="true" />
                    <span>
                      {memory.createdAt?.toDate 
                        ? memory.createdAt.toDate().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })
                        : new Date(memory.createdAt).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Story */}
              <div style={{ marginBottom: '2rem' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-0.01em',
                    marginBottom: '0.875rem',
                  }}
                >
                  História
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.8,
                  }}
                >
                  {memory.descricao}
                </p>
              </div>

              {/* Like button */}
              <button
                id="like-memory-btn"
                onClick={handleLike}
                aria-label={curtida ? 'Descurtir esta memória' : 'Curtir esta memória'}
                aria-pressed={curtida}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  background: curtida ? 'var(--color-accent-light)' : 'var(--color-surface)',
                  border: `1px solid ${curtida ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  borderRadius: '8px',
                  padding: '0.75rem 1.25rem',
                  cursor: 'pointer',
                  transition: 'all 250ms cubic-bezier(0.32, 0.72, 0, 1)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: curtida ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <Heart
                  size={20}
                  weight={curtida ? 'fill' : 'regular'}
                  className={heartAnimating ? 'heart-pop' : ''}
                  style={{ color: curtida ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                  aria-hidden="true"
                />
                <span>{memory.likeCount} {memory.likeCount === 1 ? 'pessoa curtiu' : 'pessoas curtiram'}</span>
              </button>

              {/* Back link */}
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <Link
                  href="/acervo"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-body)',
                    textDecoration: 'none',
                    transition: 'color 200ms',
                  }}
                >
                  <ArrowLeft size={14} aria-hidden="true" />
                  Voltar ao acervo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related memories */}
      {related.length > 0 && (
        <section
          style={{
            background: 'var(--color-surface-warm)',
            borderTop: '1px solid var(--color-border)',
            paddingBlock: 'clamp(3rem, 6vw, 5rem)',
          }}
        >
          <div className="container-main">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.375rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                Mais memórias de {memory.anoDoSaoJoao}
              </h2>
              <Link href={`/acervo?anoMin=${memory.anoDoSaoJoao}&anoMax=${memory.anoDoSaoJoao}`} className="btn-secondary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
                Ver todas
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>

            <div
              className="scroll-x"
              style={{ paddingBottom: '1rem' }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  minWidth: 'max-content',
                }}
              >
                {related.map((mem, i) => (
                  <div key={mem.id} style={{ width: 'clamp(240px, 28vw, 300px)', flexShrink: 0 }}>
                    <MemoryCard memory={mem} index={i} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}


    </>
  );
}

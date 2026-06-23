'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  MusicNote,
  House, 
  Users, 
  Heart, 
  Storefront, 
  Upload 
} from '@phosphor-icons/react';
import Bandeirolas from '@/components/ui/Bandeirolas';
import MemoryCard from '@/components/ui/MemoryCard';
import { useMemorias } from '@/hooks/useMemorias';
import { useStats } from '@/hooks/useStats';
import { useAnos } from '@/hooks/useAnos';

const CATEGORIAS_ESTATICAS = [
  { id: 'quadrilha', label: 'Quadrilhas Juninas' },
  { id: 'shows', label: 'Shows & Palcos' },
  { id: 'vila', label: 'Vila Junina' },
  { id: 'familia', label: 'Família & Amigos' },
  { id: 'comida', label: 'Comidas & Bebidas' },
];

/* ============================================================
   INTERSECTION OBSERVER HOOK
   ============================================================ */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, revealed];
}

/* ============================================================
   HERO SECTION
   ============================================================ */
function HeroSection() {
  return (
    <section
      style={{
        minHeight: '100dvh',
        background: 'var(--color-canvas)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Bandeirolas at very top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
        <Bandeirolas />
      </div>

      {/* Spark particles */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
        <div className="spark spark-1" />
        <div className="spark spark-2" />
        <div className="spark spark-3" />
        <div className="spark spark-4" />
        <div className="spark spark-5" />
      </div>

      <div
        className="container-main"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          paddingTop: 'clamp(7rem, 14vw, 10rem)',
          paddingBottom: '4rem',
          position: 'relative',
          zIndex: 3,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '7fr 5fr',
            gap: 'clamp(2rem, 5vw, 4rem)',
            alignItems: 'center',
            width: '100%',
          }}
          className="hero-grid"
        >
          {/* Left: text */}
          <div>
            <span className="eyebrow">Arquivo Cultural — Amargosa</span>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-display)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                marginBottom: '1.5rem',
              }}
            >
              <em style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>
                A Memória
              </em>
              <br />
              de Amargosa,
              <br />
              preservada.
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.5vw, 1.1875rem)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.7,
                maxWidth: '42ch',
                marginBottom: '2.5rem',
              }}
            >
              Um arquivo vivo de quem viveu o São João de Amargosa.
              De 1980 até hoje — fotos, vídeos, histórias escritas
              e depoimentos de todas as edições da maior festa
              junina de Amargosa.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/acervo" className="btn-primary">
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
                Explorar o acervo
              </Link>
              <Link href="/enviar" className="btn-secondary">
                <Upload size={16} aria-hidden="true" />
                Enviar sua memória
              </Link>
            </div>
          </div>

          {/* Right: image with double bezel */}
          <div
            style={{
              position: 'relative',
            }}
          >
            <div
              style={{
                padding: '8px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '2rem',
                boxShadow: '0 8px 40px rgba(42,24,16,0.12)',
              }}
            >
              <div
                style={{
                  borderRadius: 'calc(2rem - 8px)',
                  overflow: 'hidden',
                  background: 'var(--color-surface-warm)',
                  position: 'relative',
                  aspectRatio: '4/5',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <video
                    src="/Video Project 4.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'scale(1.35)',
                    }}
                  />
                </div>
                {/* Year overlay badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1.25rem',
                    left: '1.25rem',
                    background: 'rgba(253,250,244,0.92)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '8px',
                    padding: '0.625rem 1rem',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Desde 1963
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 500,
                    }}
                  >
                    São João de Amargosa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: '2rem',
          position: 'relative',
          zIndex: 3,
        }}
      >
        <div
          className="scroll-indicator"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.375rem',
            color: 'var(--color-text-muted)',
          }}
          aria-hidden="true"
        >
          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-body)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            explorar
          </span>
          <ArrowDown size={18} />
        </div>
      </div>


    </section>
  );
}

/* ============================================================
   STATS BAR
   ============================================================ */
function StatsBar() {
  const [ref, revealed] = useScrollReveal(0.2);
  const { stats: { totalMemorias, totalAnos, totalContribuidores, totalCidades }, loading } = useStats();

  const stats = [
    { value: loading ? '...' : totalMemorias.toLocaleString('pt-BR'), label: 'memórias no acervo' },
    { value: loading ? '...' : totalAnos.toString(),    label: 'anos de festa documentados' },
    { value: loading ? '...' : totalContribuidores.toLocaleString('pt-BR'), label: 'contribuidores (estimado)' },
    { value: loading ? '...' : totalCidades.toString(),    label: 'cidades representadas' },
  ];

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${revealed ? 'revealed' : ''}`}
      style={{
        background: 'var(--color-surface-warm)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="container-main">
        <div
          className="stats-bar-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                padding: 'clamp(1.5rem, 4vw, 2.5rem) 1.5rem',
                borderRight: i < 3 ? '1px solid var(--color-border)' : 'none',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: '0.375rem',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ============================================================
   FEATURED GALLERY (Bento Grid)
   ============================================================ */
function FeaturedGallery() {
  const [ref, revealed] = useScrollReveal(0.1);
  const { memorias, loading } = useMemorias({ limite: 5 });
  const featured = memorias.slice(0, 5);

  return (
    <section className="section-padding" style={{ background: 'var(--color-canvas)' }}>
      <div className="container-main">
        {/* Header */}
        <div
          ref={ref}
          className={`scroll-reveal ${revealed ? 'revealed' : ''}`}
          style={{ marginBottom: '3rem' }}
        >
          <span className="eyebrow">Destaques recentes</span>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <h2 style={{ maxWidth: '18ch' }}>
              Memórias que ficaram
              <em style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}> vivas</em>
            </h2>
            <Link
              href="/acervo"
              className="btn-secondary"
              style={{ whiteSpace: 'nowrap' }}
            >
              Ver todo o acervo
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Bento Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gridTemplateRows: 'auto auto',
            gap: '1.25rem',
          }}
          className="bento-grid"
        >
          {/* Large card — top left */}
          {featured[0] && (
            <div
              style={{ gridColumn: '1', gridRow: '1 / 3' }}
              className={`scroll-reveal stagger-1 ${revealed ? 'revealed' : ''}`}
            >
              <MemoryCard memory={featured[0]} index={0} isLarge />
            </div>
          )}
          {/* Top middle */}
          {featured[1] && (
            <div
              style={{ gridColumn: '2', gridRow: '1' }}
              className={`scroll-reveal stagger-2 ${revealed ? 'revealed' : ''}`}
            >
              <MemoryCard memory={featured[1]} index={1} />
            </div>
          )}
          {/* Top right */}
          {featured[2] && (
            <div
              style={{ gridColumn: '3', gridRow: '1' }}
              className={`scroll-reveal stagger-3 ${revealed ? 'revealed' : ''}`}
            >
              <MemoryCard memory={featured[2]} index={2} />
            </div>
          )}
          {/* Bottom middle */}
          {featured[3] && (
            <div
              style={{ gridColumn: '2', gridRow: '2' }}
              className={`scroll-reveal stagger-4 ${revealed ? 'revealed' : ''}`}
            >
              <MemoryCard memory={featured[3]} index={3} />
            </div>
          )}
          {/* Bottom right */}
          {featured[4] && (
            <div
              style={{ gridColumn: '3', gridRow: '2' }}
              className={`scroll-reveal stagger-5 ${revealed ? 'revealed' : ''}`}
            >
              <MemoryCard memory={featured[4]} index={4} />
            </div>
          )}
        </div>


      </div>
    </section>
  );
}

/* ============================================================
   TIMELINE TEASER
   ============================================================ */
function TimelineTeaser() {
  const [ref, revealed] = useScrollReveal(0.15);
  const [hoveredYear, setHoveredYear] = useState(null);
  const { anos, loading } = useAnos();

  // If we have actual years from DB, pick up to 10 spaced out years or all if few.
  // We'll use a dynamic array based on real data or fallback if empty
  const availableYears = anos.map(a => a.ano).sort((a,b) => a - b);
  const highlightYears = availableYears.length > 0 
    ? availableYears.filter((_, i) => i % Math.max(1, Math.floor(availableYears.length / 10)) === 0) 
    : [1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2019, 2024, 2026];

  return (
    <section
      className="section-padding"
      style={{
        background: 'var(--color-surface-warm)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="container-main">
        <div
          ref={ref}
          className={`scroll-reveal ${revealed ? 'revealed' : ''}`}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <span className="eyebrow">Linha do Tempo</span>
          <h2>Mais de quatro décadas<br /><em style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>de forró e memória</em></h2>
        </div>

        {/* Year track */}
        <div
          className="scroll-x"
          style={{ paddingBottom: '1rem' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0',
              minWidth: 'max-content',
              padding: '1.5rem 0',
              position: 'relative',
            }}
          >
            {/* Horizontal line */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '1px',
                background: 'var(--color-border-strong)',
                transform: 'translateY(-50%)',
              }}
            />

            {highlightYears.map((year, i) => (
              <div
                key={year}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0 2rem',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredYear(year)}
                onMouseLeave={() => setHoveredYear(null)}
              >
                {/* Year label (top) */}
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.9rem',
                    fontWeight: hoveredYear === year ? 700 : 400,
                    color: hoveredYear === year ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    transition: 'color 200ms, font-weight 200ms',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {year}
                </span>

                {/* Dot */}
                <div
                  style={{
                    width: hoveredYear === year ? '14px' : '8px',
                    height: hoveredYear === year ? '14px' : '8px',
                    borderRadius: '50%',
                    background: hoveredYear === year ? 'var(--color-accent)' : 'var(--color-border-strong)',
                    transition: 'width 200ms cubic-bezier(0.32, 0.72, 0, 1), height 200ms cubic-bezier(0.32, 0.72, 0, 1), background 200ms',
                    position: 'relative',
                    zIndex: 1,
                    ...(hoveredYear === year && { boxShadow: '0 0 0 4px rgba(192,57,43,0.2)' }),
                  }}
                  className={hoveredYear === year ? 'timeline-dot-active' : ''}
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{ textAlign: 'center', marginTop: '2rem' }}
          className={`scroll-reveal stagger-3 ${revealed ? 'revealed' : ''}`}
        >
          <Link href="/linha-do-tempo" className="btn-secondary">
            Explorar linha do tempo completa
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CATEGORY SECTION
   ============================================================ */
function CategorySection() {
  const [ref, revealed] = useScrollReveal(0.1);

  const icons = {
    quadrilha: <Users size={28} aria-hidden="true" />,
    shows:     <MusicNote size={28} aria-hidden="true" />,
    vila:      <House size={28} aria-hidden="true" />,
    familia:   <Heart size={28} aria-hidden="true" />,
    comida:    <Storefront size={28} aria-hidden="true" />,
  };

  return (
    <section className="section-padding" style={{ background: 'var(--color-canvas)' }}>
      <div className="container-main">
        <div
          ref={ref}
          className={`scroll-reveal ${revealed ? 'revealed' : ''}`}
          style={{ marginBottom: '3rem' }}
        >
          <span className="eyebrow">Categorias</span>
          <h2>Cada canto da festa<br /><em style={{ fontStyle: 'italic', color: 'var(--color-fire-dark)' }}>tem sua memória</em></h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '1.25rem',
          }}
          className="category-grid"
        >
          {CATEGORIAS_ESTATICAS.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/acervo?categoria=${cat.id}`}
              className={`scroll-reveal stagger-${i + 1} ${revealed ? 'revealed' : ''}`}
              style={{
                display: 'block',
                textDecoration: 'none',
              }}
            >
              <div
                className="card-bezel"
                style={{
                  height: i === 0 ? 'auto' : '100%',
                  transition: 'border-color 300ms cubic-bezier(0.32, 0.72, 0, 1), transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div
                  className="card-inner"
                  style={{
                    padding: i === 0 ? '2.5rem 2rem' : '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'var(--color-surface-warm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-accent)',
                    }}
                  >
                    {icons[cat.id]}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: i === 0 ? '1.375rem' : '1.05rem',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        letterSpacing: '-0.01em',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {cat.label}
                    </h3>
                  </div>
                  {i === 0 && (
                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.65,
                        marginTop: '0.25rem',
                      }}
                    >
                      A alma da festa. Quadrilhas de toda a região
                      trazendo cores, passos marcados e histórias de devoção aos santos juninos.
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>


      </div>
    </section>
  );
}

/* ============================================================
   CONTRIBUTE TEASER
   ============================================================ */
function ContributeTeaser() {
  const [ref, revealed] = useScrollReveal(0.2);

  return (
    <section
      ref={ref}
      className={`scroll-reveal ${revealed ? 'revealed' : ''}`}
      style={{
        background: 'var(--color-text-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Bandeirolas background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          opacity: 0.08,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <Bandeirolas />
      </div>

      {/* Background triangle decorations */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: `${5 + i * 11}%`,
              right: `${-2 + i * 13}%`,
              width: 0,
              height: 0,
              borderLeft: `${24 + i * 4}px solid transparent`,
              borderRight: `${24 + i * 4}px solid transparent`,
              borderTop: `${44 + i * 6}px solid rgba(253,250,244,0.06)`,
              transform: `rotate(${i * 22}deg)`,
            }}
          />
        ))}
      </div>

      <div
        className="container-main"
        style={{
          paddingBlock: 'clamp(5rem, 10vw, 9rem)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '2rem',
        }}
      >
        <span
          className="tag-label"
          style={{
            color: 'var(--color-fire)',
            background: 'rgba(232,160,32,0.15)',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            letterSpacing: '0.08em',
          }}
        >
          Contribua com o arquivo
        </span>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-hero)',
            fontWeight: 700,
            color: 'var(--color-canvas)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            maxWidth: '26ch',
          }}
        >
          <em style={{ fontStyle: 'italic', color: 'var(--color-fire)' }}>Sua foto de 1994</em> pode ser
          a única memória daquele São João que ainda existe.
        </h2>

        <p
          style={{
            fontSize: '1.0625rem',
            color: 'rgba(253,250,244,0.65)',
            lineHeight: 1.7,
            maxWidth: '48ch',
          }}
        >
          Cada foto guardada numa gaveta, cada história que só você conhece — 
          elas pertencem a este arquivo. Envie agora, leva menos de dois minutos.
        </p>

        <Link href="/enviar" className="btn-pill" style={{ fontSize: '1rem', padding: '0.875rem 2.25rem' }}>
          <Upload size={18} weight="bold" aria-hidden="true" />
          Enviar uma memória
        </Link>
      </div>
    </section>
  );
}

/* ============================================================
   HOME PAGE EXPORT
   ============================================================ */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <FeaturedGallery />
      <TimelineTeaser />
      <CategorySection />
      <ContributeTeaser />
    </>
  );
}

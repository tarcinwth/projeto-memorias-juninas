'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ArrowRight } from '@phosphor-icons/react';
import { useMemorias } from '@/hooks/useMemorias';

/* ============================================================
   INTERSECTION OBSERVER HOOK
   ============================================================ */
function useScrollRevealLeft(threshold = 0.2) {
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
   YEAR DRAWER
   ============================================================ */
function YearDrawer({ year, memories, onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(480px, 95vw)',
        background: 'var(--color-canvas)',
        borderLeft: '1px solid var(--color-border)',
        zIndex: 2000,
        overflowY: 'auto',
        boxShadow: '-4px 0 40px rgba(42,24,16,0.15)',
        animation: 'menu-open 300ms cubic-bezier(0.32, 0.72, 0, 1) forwards',
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Memórias de ${year}`}
    >
      <div style={{ padding: '1.5rem' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
          }}
        >
          <div>
            <div className="tag-label" style={{ color: 'var(--color-accent)', marginBottom: '0.25rem' }}>
              São João
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.03em',
              }}
            >
              {year}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label={`Fechar painel de ${year}`}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              transition: 'background 200ms',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Memories */}
        {memories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
            <p style={{ fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
              Nenhuma memória registrada para este ano ainda.
              <br />
              <Link href="/enviar" style={{ color: 'var(--color-accent)', fontWeight: 500 }}>
                Envie a primeira!
              </Link>
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {memories.map(mem => (
              <Link
                key={mem.id}
                href={`/acervo/${mem.id}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div
                  className="card-bezel"
                  style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}
                >
                  <div className="card-inner" style={{ display: 'flex', gap: '0.875rem', width: '100%', padding: '0.75rem' }}>
                    <div
                      style={{
                        position: 'relative',
                        width: '80px',
                        height: '80px',
                        flexShrink: 0,
                        borderRadius: '6px',
                        overflow: 'hidden',
                        background: 'var(--color-surface-warm)',
                      }}
                    >
                      <Image
                        src={mem.mediaUrl || 'https://via.placeholder.com/80'}
                        alt={mem.titulo || 'Memória'}
                        fill
                        sizes="80px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                          letterSpacing: '-0.01em',
                          marginBottom: '0.25rem',
                          lineHeight: 1.3,
                        }}
                      >
                        {mem.titulo}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--color-text-muted)',
                          fontFamily: 'var(--font-body)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.5,
                        }}
                      >
                        {mem.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* See all for this year */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link
            href={`/acervo?ano=${year}`}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Ver todas as memórias de {year}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   YEAR ROW (one entry in the vertical timeline)
   ============================================================ */
function YearRow({ year, memories, onSelect, isFirst, isLast }) {
  const [ref, revealed] = useScrollRevealLeft(0.15);
  const isHighlight = isFirst || isLast || memories.length >= 3;

  return (
    <div
      ref={ref}
      className={`scroll-reveal-left ${revealed ? 'revealed' : ''}`}
      style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', position: 'relative' }}
    >
      {/* Timeline left axis */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
          width: '56px',
        }}
      >
        {/* Year label */}
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: isHighlight ? 'var(--color-accent)' : 'var(--color-text-muted)',
            letterSpacing: '-0.01em',
            textAlign: 'right',
            width: '100%',
            paddingTop: '0.125rem',
          }}
        >
          {year}
        </span>
      </div>

      {/* Dot + line column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <button
          id={`timeline-year-${year}`}
          onClick={() => onSelect(year)}
          aria-label={`Ver memórias de ${year}`}
          style={{
            width: isHighlight ? '16px' : '10px',
            height: isHighlight ? '16px' : '10px',
            borderRadius: '50%',
            background: isHighlight ? 'var(--color-accent)' : 'var(--color-border-strong)',
            border: `2px solid ${isHighlight ? 'var(--color-accent)' : 'var(--color-border-strong)'}`,
            cursor: memories.length > 0 ? 'pointer' : 'default',
            transition: 'width 200ms, height 200ms, background 200ms, box-shadow 200ms',
            flexShrink: 0,
            padding: 0,
          }}
          onMouseEnter={e => {
            if (memories.length > 0) {
              e.currentTarget.style.background = 'var(--color-accent)';
              e.currentTarget.style.boxShadow = '0 0 0 5px rgba(192,57,43,0.2)';
            }
          }}
          onMouseLeave={e => {
            if (!isHighlight) {
              e.currentTarget.style.background = 'var(--color-border-strong)';
            }
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        {/* Vertical connecting line */}
        {!isLast && (
          <div
            aria-hidden="true"
            style={{
              width: '1px',
              height: '48px',
              background: 'var(--color-border)',
              marginTop: '4px',
            }}
          />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingTop: 0, paddingBottom: '1rem', minWidth: 0 }}>
        {memories.length > 0 ? (
          <div>
            {/* Thumbnail strip */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {memories.slice(0, 3).map(mem => (
                <div
                  key={mem.id}
                  style={{
                    position: 'relative',
                    width: '56px',
                    height: '56px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    flexShrink: 0,
                    background: 'var(--color-surface-warm)',
                  }}
                >
                  <Image
                    src={mem.mediaUrl || 'https://via.placeholder.com/56'}
                    alt={mem.titulo || 'Memória'}
                    fill
                    sizes="56px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
              {memories.length > 3 && (
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '6px',
                    background: 'var(--color-surface-warm)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  +{memories.length - 3}
                </div>
              )}
            </div>
            <button
              onClick={() => onSelect(year)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                padding: 0,
                transition: 'color 200ms',
                textAlign: 'left',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              {memories.length} {memories.length === 1 ? 'memória' : 'memórias'}
            </button>
          </div>
        ) : (
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-body)',
              opacity: 0.6,
              paddingTop: '0.125rem',
              display: 'block',
            }}
          >
            Aguardando memórias
          </span>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   TIMELINE PAGE
   ============================================================ */
export default function LinhaDoTempoPage() {
  const [activeYear, setActiveYear] = useState(null);
  const { memorias, loading } = useMemorias({ limite: 1000 }); // Fetch all for timeline grouping

  const years = Array.from({ length: 47 }, (_, i) => 1980 + i);

  function getMemoriesForYear(year) {
    return memorias.filter(m => m.anoDoSaoJoao === year);
  }

  const drawerMemories = activeYear ? getMemoriesForYear(activeYear) : [];

  return (
    <>
      {/* Page header */}
      <div
        style={{
          background: 'var(--color-text-primary)',
          paddingTop: 'clamp(6rem, 12vw, 9rem)',
          paddingBottom: '4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background triangles */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${10 + i * 15}%`,
                right: `${i * 15}%`,
                width: 0, height: 0,
                borderLeft: '30px solid transparent',
                borderRight: '30px solid transparent',
                borderBottom: `52px solid rgba(232,160,32,0.07)`,
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}
        </div>
        <div className="container-main" style={{ position: 'relative', zIndex: 1 }}>
          <span
            className="tag-label"
            style={{
              color: 'var(--color-fire)',
              background: 'rgba(232,160,32,0.15)',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              display: 'inline-block',
              marginBottom: '1.25rem',
              letterSpacing: '0.08em',
            }}
          >
            1980 — 2026
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-hero)',
              fontWeight: 700,
              color: 'var(--color-canvas)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: '1rem',
            }}
          >
            Linha do Tempo
          </h1>
          <p
            style={{
              color: 'rgba(253,250,244,0.65)',
              fontSize: '1.0625rem',
              maxWidth: '48ch',
              lineHeight: 1.7,
            }}
          >
            Cada ano do São João de Amargosa, do primeiro arquivo ao mais recente.
            Clique em qualquer ano para explorar as memórias daquela edição.
          </p>
        </div>
      </div>

      {/* Timeline body */}
      <div style={{ background: 'var(--color-canvas)', paddingBlock: 'clamp(3rem, 6vw, 5rem)' }}>
        <div className="container-main" style={{ maxWidth: '48rem' }}>
          <div style={{ position: 'relative' }}>
            {years.map((year, i) => (
              <YearRow
                key={year}
                year={year}
                memories={getMemoriesForYear(year)}
                onSelect={setActiveYear}
                isFirst={i === 0}
                isLast={i === years.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Year drawer overlay */}
      {activeYear && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setActiveYear(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(42,24,16,0.35)',
              zIndex: 1999,
              backdropFilter: 'blur(2px)',
            }}
            aria-hidden="true"
          />
          <YearDrawer
            year={activeYear}
            memories={drawerMemories}
            onClose={() => setActiveYear(null)}
          />
        </>
      )}
    </>
  );
}

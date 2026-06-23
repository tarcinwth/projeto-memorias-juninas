'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlass, X, Funnel, ArrowClockwise } from '@phosphor-icons/react';
import MemoryCard, { MemoryCardSkeleton } from '@/components/ui/MemoryCard';
import { useMemorias } from '@/hooks/useMemorias';
import { useStats } from '@/hooks/useStats';
import { useAnosDisponiveis } from '@/hooks/useAnosDisponiveis';

const CATEGORIAS_ESTATICAS = [
  { id: 'quadrilha', label: 'Quadrilhas Juninas' },
  { id: 'shows', label: 'Shows & Palcos' },
  { id: 'vila', label: 'Vila Junina' },
  { id: 'familia', label: 'Família & Amigos' },
  { id: 'comida', label: 'Comidas & Bebidas' },
];


/* ============================================================
   GALLERY FILTERS
   ============================================================ */
function GalleryFilters({ filters, onFilterChange, onReset, resultCount }) {
  const { anos } = useAnosDisponiveis();
  const minYear = anos.length > 0 ? Math.min(...anos) : 1980;
  const maxYear = anos.length > 0 ? Math.max(...anos) : new Date().getFullYear();

  return (
    <div
      style={{
        position: 'sticky',
        top: 'calc(1.5rem + 56px)',
        zIndex: 100,
        background: 'rgba(253,250,244,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        paddingBlock: '1rem',
      }}
    >
      <div className="container-main">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <MagnifyingGlass
              size={16}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            />
            <input
              type="text"
              id="search-memorias"
              placeholder="Buscar por título, contribuidor, cidade..."
              value={filters.busca || ''}
              onChange={e => onFilterChange({ busca: e.target.value })}
              className="form-input"
              style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
              aria-label="Buscar memórias"
            />
            {filters.busca && (
              <button
                onClick={() => onFilterChange({ busca: '' })}
                aria-label="Limpar busca"
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  padding: '0.125rem',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Year range */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
              Ano:
            </span>
            <select
              id="year-from"
              value={filters.anoMin || minYear}
              onChange={e => onFilterChange({ anoMin: Number(e.target.value) })}
              className="form-input"
              style={{ width: 'auto', fontSize: '0.8125rem', padding: '0.5rem 0.75rem' }}
              aria-label="Ano inicial"
            >
              <option value="">Selecione...</option>
              {anos.map((ano) => (
                <option key={`min-${ano}`} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>—</span>
            <select
              id="year-to"
              value={filters.anoMax || maxYear}
              onChange={e => onFilterChange({ anoMax: Number(e.target.value) })}
              className="form-input"
              style={{ width: 'auto', fontSize: '0.8125rem', padding: '0.5rem 0.75rem' }}
              aria-label="Ano final"
            >
              <option value="">Selecione...</option>
              {anos.map((ano) => (
                <option key={`max-${ano}`} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {CATEGORIAS_ESTATICAS.map(cat => {
              const active = filters.categoria === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`filter-cat-${cat.id}`}
                  onClick={() => {
                    const newCat = active ? undefined : cat.id;
                    onFilterChange({ categoria: newCat });
                  }}
                  style={{
                    background: active ? 'var(--color-fire-light)' : 'var(--color-surface)',
                    border: `1px solid ${active ? 'var(--color-fire)' : 'var(--color-border)'}`,
                    color: active ? 'var(--color-fire-dark)' : 'var(--color-text-secondary)',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: active ? 600 : 400,
                    padding: '0.3rem 0.75rem',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    transition: 'all 200ms cubic-bezier(0.32, 0.72, 0, 1)',
                    whiteSpace: 'nowrap',
                  }}
                  aria-pressed={active}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Reset */}
          <button
            id="reset-filters"
            onClick={onReset}
            aria-label="Limpar todos os filtros"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-body)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.5rem',
              borderRadius: '6px',
              transition: 'color 200ms, background 200ms',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.background = 'var(--color-surface-warm)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'none'; }}
          >
            <ArrowClockwise size={14} aria-hidden="true" />
            Limpar
          </button>
        </div>

        {/* Result count */}
        <p
          style={{
            marginTop: '0.625rem',
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {resultCount} {resultCount === 1 ? 'memória carregada' : 'memórias carregadas'}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   EMPTY STATE
   ============================================================ */
function EmptyState({ onReset }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        textAlign: 'center',
        gap: '1.25rem',
      }}
    >
      {/* Sanfona icon */}
      <svg width="64" height="64" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="4" y="10" width="6" height="20" rx="2" fill="var(--color-border-strong)" />
        <rect x="30" y="10" width="6" height="20" rx="2" fill="var(--color-border-strong)" />
        <path d="M10 14 L16 10 L16 30 L10 26 Z" fill="var(--color-surface-warm)" stroke="var(--color-border-strong)" strokeWidth="0.5" />
        <path d="M30 14 L24 10 L24 30 L30 26 Z" fill="var(--color-surface-warm)" stroke="var(--color-border-strong)" strokeWidth="0.5" />
        <rect x="16" y="12" width="8" height="16" rx="1" fill="var(--color-surface-warm)" stroke="var(--color-border-strong)" strokeWidth="0.5" />
      </svg>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.01em',
        }}
      >
        Nenhuma memória encontrada
      </h3>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '36ch', lineHeight: 1.6 }}>
        Tente ajustar os filtros ou limpar a busca para ver mais memórias do acervo.
      </p>
      <button
        onClick={onReset}
        className="btn-secondary"
        id="empty-state-reset"
        style={{ marginTop: '0.5rem' }}
      >
        <ArrowClockwise size={14} aria-hidden="true" />
        Limpar filtros
      </button>
    </div>
  );
}

/* ============================================================
   GALLERY GRID (Masonry)
   ============================================================ */
function GalleryGrid({ items, loading, onReset }) {
  if (loading) {
    return (
      <div className="masonry-grid">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="masonry-item">
            <MemoryCardSkeleton isLarge={i % 3 === 0} />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyState onReset={onReset} />;
  }

  return (
    <div className="masonry-grid">
      {items.map((mem, i) => (
        <div key={mem.id} className="masonry-item">
          <MemoryCard memory={mem} index={i} isLarge={i % 5 === 0} />
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   ACERVO PAGE
   ============================================================ */
const DEFAULT_FILTERS = {
  busca: '',
  anoMin: 1980,
  anoMax: 2026,
  categoria: undefined,
  limite: 8,
};

export default function AcervoPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { memorias, loading, hasMore, carregarMais, loadingMore } = useMemorias(filters);
  const { stats, loading: statsLoading } = useStats();

  function handleFilterChange(update) {
    setFilters(prev => ({ ...prev, ...update }));
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
  }

  function loadMore() {
    carregarMais();
  }

  return (
    <>
      {/* Page header */}
      <div
        style={{
          background: 'var(--color-surface-warm)',
          paddingTop: 'clamp(6rem, 12vw, 9rem)',
          paddingBottom: '3rem',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container-main">
          <span className="eyebrow">Arquivo completo</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-hero)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: '0.75rem',
            }}
          >
            O Acervo
          </h1>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '1.0625rem',
              maxWidth: '48ch',
              lineHeight: 1.7,
            }}
          >
            {statsLoading ? 'Carregando memórias...' : `Mais de ${stats.totalMemorias.toLocaleString('pt-BR')} memórias de Amargosa — fotos, vídeos curtos, histórias escritas e depoimentos de quem viveu o São João.`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <GalleryFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        resultCount={memorias.length}
      />

      {/* Grid */}
      <div className="container-main" style={{ paddingBlock: '3rem' }}>
        <GalleryGrid items={memorias} loading={loading && !loadingMore} onReset={handleReset} />

        {/* Load more */}
        {hasMore && !loading && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              id="load-more-memorias"
              onClick={loadMore}
              disabled={loadingMore}
              className="btn-secondary"
              style={{ padding: '0.875rem 2rem' }}
            >
              {loadingMore ? 'Carregando...' : 'Carregar mais memórias'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

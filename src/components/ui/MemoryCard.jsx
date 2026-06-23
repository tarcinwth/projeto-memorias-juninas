'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Calendar, ShareNetwork } from '@phosphor-icons/react';
const CATEGORY_LABELS = {
  quadrilha: 'Quadrilhas Juninas',
  shows: 'Shows & Palcos',
  vila: 'Vila Junina',
  familia: 'Família & Amigos',
  comida: 'Comidas & Bebidas',
  historia: 'Histórias',
  forro: 'Forró e Música'
};

const CATEGORY_BADGES = {
  quadrilha: 'badge-quadrilha',
  shows: 'badge-shows',
  vila: 'badge-vila',
  familia: 'badge-familia',
  comida: 'badge-comida',
  forro: 'badge-shows'
};

function getCategoryLabel(id) { return CATEGORY_LABELS[id] || 'Memória'; }
function getCategoryBadgeClass(id) { return CATEGORY_BADGES[id] || 'badge-default'; }

import { curtirMemoria, descurtirMemoria } from '@/lib/firebase/likes';
import { useAuth } from '@/hooks/useAuth';

export default function MemoryCard({ memory, index = 0, isLarge = false }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(memory.likeCount || 0);
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [imgSrc, setImgSrc] = useState(memory.mediaUrl || '/placeholder.jpg');

  async function handleLike(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Você precisa estar logado para curtir uma memória.');
      return;
    }

    if (liked) {
      setLiked(false);
      setLikeCount(c => Math.max(0, c - 1));
      try {
        await descurtirMemoria(memory.id, user.uid);
      } catch (err) {
        setLiked(true);
        setLikeCount(c => c + 1);
        console.error('Erro ao descurtir:', err);
      }
    } else {
      setLiked(true);
      setLikeCount(c => c + 1);
      setHeartAnimating(true);
      setTimeout(() => setHeartAnimating(false), 400);
      try {
        await curtirMemoria(memory.id, user.uid);
      } catch (err) {
        setLiked(false);
        setLikeCount(c => Math.max(0, c - 1));
        console.error('Erro ao curtir:', err);
      }
    }
  }

  async function handleShare(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/acervo/${memory.id}`;
    const shareData = {
      title: memory.titulo || 'Memória do São João',
      text: `Confira essa memória do São João de Amargosa: ${memory.titulo}`,
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copiado para a área de transferência!');
      } catch (err) {
        console.error('Erro ao copiar link:', err);
      }
    }
  }

  const badgeClass = getCategoryBadgeClass(memory.categoria);
  const categoryLabel = getCategoryLabel(memory.categoria);
  const isVideo = memory.tipo === 'video' || memory.tipoMidia === 'video';

  return (
    <Link
      href={`/acervo/${memory.id}`}
      className="block group"
      style={{ animationDelay: `calc(${index} * 100ms)` }}
    >
      <article
        className="card-bezel"
        style={{
          transition: 'border-color 400ms cubic-bezier(0.32, 0.72, 0, 1), box-shadow 400ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <div className="card-inner">
          {/* Image/Video area */}
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: isLarge ? '4/3' : '3/4', background: 'var(--color-surface-warm)' }}
          >
            {isVideo ? (
              <video
                src={memory.mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 600ms cubic-bezier(0.32, 0.72, 0, 1)',
                }}
              />
            ) : (
              <Image
                src={imgSrc}
                alt={memory.titulo || 'Memória'}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                style={{
                  transition: 'transform 600ms cubic-bezier(0.32, 0.72, 0, 1)',
                }}
                onError={() => setImgSrc('/placeholder.jpg')}
              />
            )}
            
            {/* Overlay on hover */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, transparent 40%, rgba(42,24,16,0.55) 100%)',
                transition: 'opacity 400ms cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            />
            {/* Year badge */}
            <div
              className="absolute top-3 left-3 tag-label"
              style={{
                background: 'var(--color-accent)',
                color: '#FDFAF4',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.7rem',
              }}
            >
              {memory.anoDoSaoJoao}
            </div>
            
            <div className="absolute top-3 right-3 flex items-center gap-2">
              {/* Share button */}
              <button
                onClick={handleShare}
                aria-label="Compartilhar memória"
                className="flex items-center justify-center"
                style={{
                  background: 'rgba(253,250,244,0.9)',
                  border: 'none',
                  borderRadius: '999px',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  color: 'var(--color-text-primary)',
                  transition: 'transform 200ms',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <ShareNetwork size={14} weight="bold" />
              </button>

              {/* Like button */}
              <button
                onClick={handleLike}
                aria-label={liked ? 'Descurtir memória' : 'Curtir memória'}
                className="flex items-center gap-1"
                style={{
                  background: 'rgba(253,250,244,0.9)',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '0.3rem 0.6rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-body)',
                  color: liked ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  fontWeight: 500,
                  transition: 'color 200ms',
                }}
              >
              <Heart
                size={14}
                weight={liked ? 'fill' : 'regular'}
                className={heartAnimating ? 'heart-pop' : ''}
                style={{ color: liked ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
              />
              <span>{likeCount}</span>
            </button>
            </div>
          </div>

          {/* Content area */}
          <div style={{ padding: '1rem' }}>
            {/* Category badge */}
            <span
              className={`tag-label ${badgeClass}`}
              style={{
                display: 'inline-block',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                marginBottom: '0.5rem',
              }}
            >
              {categoryLabel}
            </span>

            {/* Title */}
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.0625rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                lineHeight: 1.3,
                letterSpacing: '-0.01em',
                marginBottom: '0.5rem',
              }}
            >
              {memory.titulo}
            </h3>

            {/* Description preview */}
            {isLarge && memory.descricao && (
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '0.75rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {memory.descricao}
              </p>
            )}

            {/* Footer: contributor + city */}
            <div
              className="flex items-center gap-3"
              style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
            >
              <span
                className="flex items-center gap-1"
                style={{ fontWeight: 500 }}
              >
                {memory.autorNome}
              </span>
              <span
                className="flex items-center gap-1"
              >
                <MapPin size={12} />
                {memory.autorCidade}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* Skeleton version of MemoryCard for loading states */
export function MemoryCardSkeleton({ isLarge = false }) {
  return (
    <div className="card-bezel" style={{ pointerEvents: 'none' }}>
      <div className="card-inner">
        <div
          className="skeleton"
          style={{ aspectRatio: isLarge ? '4/3' : '3/4', borderRadius: 0 }}
        />
        <div style={{ padding: '1rem' }}>
          <div className="skeleton" style={{ width: '40%', height: '1.25rem', marginBottom: '0.5rem' }} />
          <div className="skeleton" style={{ width: '85%', height: '1rem', marginBottom: '0.375rem' }} />
          <div className="skeleton" style={{ width: '60%', height: '1rem', marginBottom: '0.75rem' }} />
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="skeleton" style={{ width: '30%', height: '0.875rem' }} />
            <div className="skeleton" style={{ width: '25%', height: '0.875rem' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Camera, Upload as UploadIcon, CheckCircle } from '@phosphor-icons/react';
import Bandeirolas from '@/components/ui/Bandeirolas';
import { useStats } from '@/hooks/useStats';

function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, revealed];
}

/* ============================================================
   ABOUT PAGE SECTIONS
   ============================================================ */
function HeroAbout() {
  return (
    <section
      style={{
        background: 'var(--color-text-primary)',
        paddingTop: 'clamp(6rem, 12vw, 9rem)',
        paddingBottom: '5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, opacity: 0.1, pointerEvents: 'none' }}>
        <Bandeirolas />
      </div>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(232,160,32,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      <div className="container-main" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '3fr 2fr',
            gap: 'clamp(2rem, 5vw, 5rem)',
            alignItems: 'center',
          }}
          className="about-hero-grid"
        >
          <div>
            <span
              className="tag-label"
              style={{
                color: 'var(--color-fire)',
                background: 'rgba(232,160,32,0.15)',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                display: 'inline-block',
                marginBottom: '1.5rem',
                letterSpacing: '0.08em',
              }}
            >
              Sobre o Projeto
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-hero)',
                fontWeight: 700,
                color: 'var(--color-canvas)',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                marginBottom: '1.5rem',
              }}
            >
              Um arquivo para não
              <em style={{ fontStyle: 'italic', color: 'var(--color-fire)' }}> esquecer</em>
            </h1>
            <p
              style={{
                color: 'rgba(253,250,244,0.7)',
                fontSize: '1.0625rem',
                lineHeight: 1.8,
                maxWidth: '52ch',
              }}
            >
              O São João de Amargosa não é apenas uma festa. É identidade, é território, é memória
              coletiva de uma cidade de 35 mil pessoas que recebe 90 mil visitantes por dia na
              Praça do Bosque. Cada edição tem histórias que merecem ser contadas e preservadas
              para as próximas gerações.
            </p>
          </div>
          <div>
            <div
              style={{
                padding: '6px',
                background: 'rgba(253,250,244,0.08)',
                border: '1px solid rgba(253,250,244,0.15)',
                borderRadius: '1.25rem',
              }}
            >
              <div
                style={{
                  borderRadius: 'calc(1.25rem - 6px)',
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '4/5',
                  background: 'rgba(253,250,244,0.05)',
                }}
              >
                <Image
                  src="https://live.staticflickr.com/65535/55349702685_d7c888a45b_b.jpg"
                  alt="Vista aérea da Praça do Bosque durante o São João de Amargosa"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  style={{ objectFit: 'cover', opacity: 0.85 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .about-hero-grid { grid-template-columns: 1fr !important; }
          .about-hero-grid > div:last-child { display: none; }
        }
      `}</style>
    </section>
  );
}

function StatsSection() {
  const [ref, revealed] = useScrollReveal(0.2);
  const { stats, loading } = useStats();

  const metrics = [
    { value: loading ? '...' : stats.totalMemorias.toLocaleString('pt-BR'), label: 'Memórias no acervo', note: 'e crescendo a cada semana' },
    { value: loading ? '...' : stats.totalAnos.toString(),    label: 'Anos de São João',   note: 'de memórias preservadas' },
    { value: loading ? '...' : stats.totalContribuidores.toLocaleString('pt-BR'), label: 'Contribuidores',     note: 'compartilhando histórias' },
    { value: '90mil', label: 'Pessoas por dia',    note: 'na Praça do Bosque' },
  ];

  return (
    <section
      ref={ref}
      className={`scroll-reveal ${revealed ? 'revealed' : ''}`}
      style={{
        paddingBlock: 'clamp(4rem, 8vw, 6rem)',
        background: 'var(--color-surface-warm)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="container-main">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          {metrics.map((stat, i) => (
            <div
              key={i}
              className={`scroll-reveal stagger-${i + 1} ${revealed ? 'revealed' : ''}`}
              style={{
                padding: '2rem 1.5rem',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
              }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 700, color: 'var(--color-accent)', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '0.5rem' }}>
                {stat.value}
              </div>
              <div style={{ fontWeight: 500, color: 'var(--color-text-primary)', fontSize: '0.9375rem', fontFamily: 'var(--font-body)', marginBottom: '0.25rem' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                {stat.note}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 380px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function HowToContribute() {
  const [ref, revealed] = useScrollReveal(0.1);

  const steps = [
    {
      num: '01',
      icon: <Camera size={28} aria-hidden="true" />,
      title: 'Encontre sua memória',
      description:
        'Procure em álbuns de foto, gavetas, celulares antigos. Uma foto de 1987 guardada num envelope pode ser a única imagem que existe daquela quadrilha.',
      image: 'https://live.staticflickr.com/65535/55350415903_07cb4f3e8b_b.jpg',
    },
    {
      num: '02',
      icon: <UploadIcon size={28} aria-hidden="true" />,
      title: 'Envie com sua história',
      description:
        'Use o formulário de envio. Além da foto ou vídeo, escreva o contexto — quem estava lá, o que sentiu, por que aquele momento importa.',
      image: 'https://live.staticflickr.com/65535/55350416083_7debcf8763_b.jpg',
    },
    {
      num: '03',
      icon: <CheckCircle size={28} aria-hidden="true" />,
      title: 'Ela entra para a história',
      description:
        'Após revisão da nossa equipe, sua memória aparece no acervo público — disponível para qualquer amargosense e para as gerações que ainda vão nascer.',
      image: 'https://live.staticflickr.com/65535/55350258096_b959602f56_b.jpg',
    },
  ];

  return (
    <section className="section-padding" style={{ background: 'var(--color-canvas)' }}>
      <div className="container-main">
        <div ref={ref} className={`scroll-reveal ${revealed ? 'revealed' : ''}`} style={{ marginBottom: '4rem' }}>
          <span className="eyebrow">Como contribuir</span>
          <h2>
            Três passos para
            <em style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}> preservar</em>
          </h2>
        </div>

        {/* Zig-zag layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          {steps.map((step, i) => (
            <div
              key={i}
              ref={ref}
              className={`zigzag-row scroll-reveal stagger-${i + 1} ${revealed ? 'revealed' : ''}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '5fr 4fr',
                gap: 'clamp(2rem, 4vw, 4rem)',
                alignItems: 'center',
                direction: i % 2 === 1 ? 'rtl' : 'ltr',
              }}
            >
              {/* Text */}
              <div style={{ direction: 'ltr' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '3.5rem',
                      fontWeight: 700,
                      color: 'var(--color-surface-warm)',
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                      userSelect: 'none',
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    {step.num}
                  </div>
                  <div>
                    <div
                      style={{
                        width: '44px', height: '44px',
                        borderRadius: '10px',
                        background: 'var(--color-accent-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--color-accent)',
                        marginBottom: '0.875rem',
                      }}
                    >
                      {step.icon}
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        letterSpacing: '-0.02em',
                        marginBottom: '0.875rem',
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '1rem',
                        lineHeight: 1.75,
                        maxWidth: '44ch',
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div style={{ direction: 'ltr' }}>
                <div
                  style={{
                    padding: '6px',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '1rem',
                  }}
                >
                  <div
                    style={{
                      borderRadius: 'calc(1rem - 6px)',
                      overflow: 'hidden',
                      position: 'relative',
                      aspectRatio: '5/4',
                      background: 'var(--color-surface-warm)',
                    }}
                  >
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .zigzag-row { grid-template-columns: 1fr !important; direction: ltr !important; }
        }
      `}</style>
    </section>
  );
}

function PartnersSection() {
  const [ref, revealed] = useScrollReveal(0.2);
  const partners = [
    { name: 'Prefeitura Municipal de Amargosa', initials: 'PMA' },
    { name: 'UFRB — Universidade Federal do Recôncavo Baiano', initials: 'UFRB' },
    { name: 'Instituto de Memória da Bahia', initials: 'IMB' },
    { name: 'Liga das Quadrilhas de Amargosa', initials: 'LQA' },
    { name: 'Rádio Amargosa FM', initials: 'RAF' },
  ];

  return (
    <section
      ref={ref}
      className={`scroll-reveal ${revealed ? 'revealed' : ''}`}
      style={{ background: 'var(--color-surface-warm)', borderTop: '1px solid var(--color-border)', paddingBlock: 'clamp(4rem, 8vw, 6rem)' }}
    >
      <div className="container-main">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="eyebrow">Apoio Institucional</span>
          <h2>Parceiros do arquivo</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '1rem', maxWidth: '60ch', marginInline: 'auto' }}>
            Ainda não temos parceiros institucionais. Se você representa uma organização e deseja apoiar a preservação da memória junina de Amargosa, entre em contato conosco!
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link href="/contato" className="btn-secondary">
            Seja um parceiro
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CTAFinal() {
  const [ref, revealed] = useScrollReveal(0.2);
  return (
    <section
      ref={ref}
      className={`scroll-reveal ${revealed ? 'revealed' : ''}`}
      style={{
        background: 'var(--color-accent)',
        paddingBlock: 'clamp(4rem, 8vw, 7rem)',
        textAlign: 'center',
      }}
    >
      <div className="container-main">
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-hero)',
            fontWeight: 700,
            color: '#FDFAF4',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
          }}
        >
          Sua memória também
          <br />
          <em style={{ fontStyle: 'italic' }}>pertence aqui.</em>
        </h2>
        <p
          style={{
            color: 'rgba(253,250,244,0.8)',
            fontSize: '1.0625rem',
            maxWidth: '44ch',
            lineHeight: 1.7,
            margin: '0 auto 2.5rem',
          }}
        >
          Cada contribuição fortalece o arquivo e garante que a história do São João
          de Amargosa seja contada com as vozes de quem a viveu.
        </p>
        <Link
          href="/enviar"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.625rem',
            background: '#FDFAF4',
            color: 'var(--color-accent)',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            fontWeight: 600,
            padding: '0.875rem 2.25rem',
            borderRadius: '999px',
            textDecoration: 'none',
            transition: 'transform 150ms cubic-bezier(0.32, 0.72, 0, 1), box-shadow 300ms',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(42,24,16,0.2)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
          Enviar minha memória
          <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export default function SobrePage() {
  return (
    <>
      <HeroAbout />
      <StatsSection />
      <HowToContribute />
      <PartnersSection />
      <CTAFinal />
    </>
  );
}

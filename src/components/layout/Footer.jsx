'use client';

import Link from 'next/link';
import Bandeirolas from '@/components/ui/Bandeirolas';


const footerLinks = [
  { label: 'Acervo',          href: '/acervo'         },
  { label: 'Linha do Tempo',  href: '/linha-do-tempo' },
  { label: 'Enviar Memória',  href: '/enviar'         },
  { label: 'Sobre o Projeto', href: '/sobre'          },
  { label: 'Contato e Parcerias', href: '/contato'    },
];

export default function Footer() {
  return (
    <footer className="footer-dark" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Bandeirolas decorativas no topo em negativo */}
      <div style={{ opacity: 0.12 }}>
        <Bandeirolas />
      </div>

      {/* Decorative background bandeirolas */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: `${10 + i * 12}%`,
              left: `${-5 + i * 18}%`,
              width: 0,
              height: 0,
              borderLeft: '20px solid transparent',
              borderRight: '20px solid transparent',
              borderTop: `36px solid ${['#C0392B','#E8A020','#2D7A3A','#1A6B8A','#C0392B','#E8A020'][i]}`,
              opacity: 0.07,
              transform: `rotate(${i * 15}deg)`,
            }}
          />
        ))}
      </div>

      <div className="container-main" style={{ paddingBlock: '4rem', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-canvas)',
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
              }}
            >
              Memória do São João de Amargosa
            </div>
            <p
              style={{
                color: 'rgba(253,250,244,0.6)',
                fontSize: '0.875rem',
                lineHeight: 1.7,
                maxWidth: '24ch',
              }}
            >
              Um arquivo colaborativo que preserva histórias, fotos e depoimentos
              de todas as edições do São João de Amargosa.
            </p>
          </div>

          {/* Links */}
          <div>
            <div
              className="tag-label"
              style={{
                color: 'var(--color-fire)',
                marginBottom: '1rem',
                letterSpacing: '0.08em',
              }}
            >
              Navegar
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {footerLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      color: 'rgba(253,250,244,0.7)',
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-body)',
                      transition: 'color 200ms',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => e.target.style.color = 'var(--color-canvas)'}
                    onMouseLeave={e => e.target.style.color = 'rgba(253,250,244,0.7)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <div
              className="tag-label"
              style={{
                color: 'var(--color-fire)',
                marginBottom: '1rem',
                letterSpacing: '0.08em',
              }}
            >
              O Arquivo
            </div>
            <p style={{ color: 'rgba(253,250,244,0.6)', fontSize: '0.875rem', lineHeight: 1.7 }}>
              Amargosa — BA<br />
              63 anos de São João<br />
              +90 mil pessoas por dia na Praça do Bosque
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'rgba(253,250,244,0.1)',
            marginBottom: '2rem',
          }}
        />

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Tagline */}
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '1rem',
              color: 'rgba(253,250,244,0.5)',
              letterSpacing: '-0.01em',
            }}
          >
            &ldquo;Guardando o forró que a chuva não apagou.&rdquo;
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'rgba(253,250,244,0.35)',
                fontFamily: 'var(--font-body)',
                margin: 0,
              }}
            >
              &copy; {new Date().getFullYear()} Memória do São João de Amargosa
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'rgba(253,250,244,0.35)',
                fontFamily: 'var(--font-body)',
                margin: 0,
              }}
            >
              Projeto criado por{' '}
              <a 
                href="https://studiowoota.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'var(--color-fire)', textDecoration: 'none' }}
              >
                Woota Studio
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

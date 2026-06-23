'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { List, X, Upload, User as UserIcon, SignOut, ShieldCheck } from '@phosphor-icons/react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import AuthModal from '@/components/auth/AuthModal';
import Image from 'next/image';

const navLinks = [
  { href: '/acervo',          label: 'Acervo'        },
  { href: '/linha-do-tempo',  label: 'Explorar'      },
  { href: '/enviar',          label: 'Enviar Memória' },
  { href: '/sobre',           label: 'Sobre'         },
];

function AccordionIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {/* Sanfona SVG mark */}
      <rect x="4" y="10" width="6" height="20" rx="2" fill="var(--color-accent)" />
      <rect x="34" y="10" width="6" height="20" rx="2" fill="var(--color-accent)" />
      <path
        d="M10 14 L16 10 L16 30 L10 26 Z"
        fill="var(--color-fire)"
      />
      <path
        d="M30 14 L24 10 L24 30 L30 26 Z"
        fill="var(--color-fire)"
      />
      <rect x="16" y="12" width="8" height="16" rx="1" fill="var(--color-accent-dark)" />
      <line x1="20" y1="12" x2="20" y2="28" stroke="var(--color-fire)" strokeWidth="1" />
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, usuario } = useAuth();
  
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isAdmin = user && user.email === adminEmail;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    const sentinel = document.getElementById('nav-sentinel');
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when menu is open and handle window resize
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleResize = () => {
      if (window.innerWidth >= 768 && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => { 
      document.body.style.overflow = ''; 
      window.removeEventListener('resize', handleResize);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Sentinel element so we can detect scroll-past-top */}
      <div id="nav-sentinel" style={{ position: 'absolute', top: 0, height: '1px', width: '100%' }} />

      <header
        role="navigation"
        aria-label="Navegação principal"
        style={{
          position: 'fixed',
          top: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width: 'calc(100% - 2rem)',
          maxWidth: '56rem',
        }}
      >
        <nav
          className="nav-pill"
          style={{
            position: 'relative',
            left: 'auto',
            transform: 'none',
            width: '100%',
            maxWidth: '100%',
            boxShadow: scrolled
              ? '0 4px 30px rgba(42, 24, 16, 0.15)'
              : '0 2px 20px rgba(42, 24, 16, 0.08)',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
            style={{ marginRight: '0.5rem', textDecoration: 'none' }}
            aria-label="Memória do São João — Página inicial"
          >
            <AccordionIcon />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              Memória do São João
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hide-mobile flex items-center gap-1 ml-2">
            {navLinks.slice(0, 3).map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* About link (desktop) */}
          <Link
            href="/sobre"
            className={`hide-mobile nav-link ${pathname === '/sobre' ? 'active' : ''}`}
            style={{ marginRight: '0.5rem' }}
          >
            Sobre
          </Link>

          {/* CTA */}
          {/* CTA */}
          <Link href="/enviar" className="hide-mobile btn-pill" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem', marginRight: '1rem' }}>
            <Upload size={14} weight="bold" aria-hidden="true" />
            Enviar Memória
          </Link>

          {/* User Profile / Login (Desktop) */}
          <div className="hide-mobile relative" style={{ position: 'relative' }}>
            {!user ? (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="btn-secondary"
                style={{ fontSize: '0.8125rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <UserIcon size={16} />
                Entrar
              </button>
            ) : (
              <div>
                <button
                  onClick={() => setProfileMenuOpen(o => !o)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {usuario?.avatarUrl ? (
                    <Image
                      src={usuario.avatarUrl}
                      alt="Avatar"
                      width={32}
                      height={32}
                      style={{ borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                    />
                  ) : (
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-fire-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-fire-dark)' }}>
                      <UserIcon size={16} />
                    </div>
                  )}
                </button>
                
                {profileMenuOpen && (
                  <div
                    className="card-bezel"
                    style={{
                      position: 'absolute',
                      top: '120%',
                      right: 0,
                      background: 'var(--color-surface)',
                      minWidth: '200px',
                      padding: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      animation: 'menu-open 200ms cubic-bezier(0.32, 0.72, 0, 1)',
                    }}
                  >
                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.25rem' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{usuario?.nome || user.displayName}</p>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                          textDecoration: 'none',
                          borderRadius: '4px',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-warm)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <ShieldCheck size={16} />
                        Painel de Moderação
                      </Link>
                    )}
                    <button
                      onClick={() => { signOut(auth); setProfileMenuOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.875rem',
                        color: 'var(--color-fire)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: '4px',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-fire-light)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <SignOut size={16} />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger (mobile) */}
          <button
            className="show-mobile"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              padding: '0.375rem',
              borderRadius: '8px',
              transition: 'background 200ms',
              marginLeft: 'auto',
            }}
          >
            <span
              style={{
                display: 'block',
                transition: 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1), opacity 300ms',
                position: 'absolute',
                opacity: menuOpen ? 0 : 1,
                transform: menuOpen ? 'rotate(90deg)' : 'rotate(0)',
              }}
            >
              <List size={22} weight="regular" />
            </span>
            <span
              style={{
                display: 'block',
                transition: 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1), opacity 300ms',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'rotate(0)' : 'rotate(-90deg)',
              }}
            >
              <X size={22} weight="regular" />
            </span>
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="mobile-menu show-mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          {/* Close button */}
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
            style={{
              position: 'absolute',
              top: '2rem',
              right: '1.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-primary)',
              padding: '0.5rem',
            }}
          >
            <X size={28} />
          </button>

          {/* Logo in overlay */}
          <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AccordionIcon />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Memória do São João
            </span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                  fontWeight: 600,
                  color: pathname === link.href ? 'var(--color-accent)' : 'var(--color-text-primary)',
                  letterSpacing: '-0.02em',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '8px',
                  transition: 'color 200ms, background 200ms',
                  animationDelay: `${i * 80}ms`,
                  animation: 'menu-open 300ms cubic-bezier(0.32, 0.72, 0, 1) forwards',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div style={{ marginTop: '2.5rem' }}>
            <Link
              href="/enviar"
              onClick={() => setMenuOpen(false)}
              className="btn-pill"
              style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}
            >
              <Upload size={18} weight="bold" aria-hidden="true" />
              Enviar Memória
            </Link>
          </div>
        </div>
      )}
      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}

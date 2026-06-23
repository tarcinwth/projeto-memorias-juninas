'use client';

import { EnvelopeSimple, WhatsappLogo } from '@phosphor-icons/react';

export default function ContatoPage() {
  return (
    <div style={{ paddingTop: 'clamp(6rem, 12vw, 9rem)', paddingBottom: '6rem', minHeight: '100vh', background: 'var(--color-canvas)' }}>
      <div className="container-main" style={{ maxWidth: '800px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="eyebrow">Fale Conosco</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
            Contato & Parcerias
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', lineHeight: 1.6, maxWidth: '60ch', marginInline: 'auto' }}>
            Tem interesse em apoiar o projeto, reportar um problema ou conversar sobre parcerias institucionais? Estamos à disposição.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* Email */}
          <div style={{ background: 'var(--color-surface)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-surface-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--color-accent)' }}>
              <EnvelopeSimple size={32} weight="duotone" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>E-mail</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Para assuntos oficiais, propostas de parceria ou dúvidas detalhadas.
            </p>
            <a href="mailto:tarciio.spotify@gmail.com" className="btn-secondary" style={{ width: '100%' }}>
              tarciio.spotify@gmail.com
            </a>
          </div>

          {/* WhatsApp */}
          <div style={{ background: 'var(--color-surface)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-surface-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#25D366' }}>
              <WhatsappLogo size={32} weight="duotone" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>WhatsApp</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Para conversas rápidas, dúvidas urgentes ou suporte direto.
            </p>
            <a href="https://wa.me/5575992867272" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', background: '#25D366', color: 'white', borderColor: '#25D366' }}>
              (75) 99286-7272
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}

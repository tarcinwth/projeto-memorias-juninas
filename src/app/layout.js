import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

import { Playfair_Display, Outfit } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'Memória do São João de Amargosa — Arquivo Vivo da Festa',
  description:
    'Um arquivo colaborativo que preserva fotos, vídeos, histórias e depoimentos de todas as edições do São João de Amargosa, uma das festas juninas mais tradicionais do Brasil.',
  keywords: ['São João', 'Amargosa', 'Bahia', 'festa junina', 'forró', 'quadrilha', 'arquivo cultural', 'Praça do Bosque'],
  openGraph: {
    title: 'Memória do São João de Amargosa',
    description: 'Arquivo vivo do São João mais charmoso e tradicional do interior baiano.',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${playfair.variable} ${outfit.variable}`} suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

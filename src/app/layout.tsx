import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

// ─── Font ───────────────────────────────────────────────────────────────────

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

// ─── PWA Metadata ───────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: 'Mi Colombia Digital',
    template: '%s | Mi Colombia Digital',
  },
  description:
    'Billetera digital de documentos ciudadanos para Colombia. Lleva tu cedula, pasaporte, licencia y mas en tu celular.',
  keywords: [
    'colombia',
    'digital',
    'billetera',
    'documentos',
    'cedula',
    'pasaporte',
    'gobierno',
    'identidad',
    'wallet',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mi Colombia Digital',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: 'Mi Colombia Digital',
    title: 'Mi Colombia Digital',
    description:
      'Tu billetera digital de documentos ciudadanos. Segura, verificable y siempre disponible.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#003893' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

// ─── Root Layout ────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* PWA icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:shadow-lg focus:text-blue-800"
        >
          Saltar al contenido principal
        </a>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

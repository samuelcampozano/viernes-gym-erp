import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://viernes-gym-erp.vercel.app'),
  title: 'Viernes AI — Autonomous Gym ERP & Visual Floor Commander',
  description:
    'An agent-native operations system and 2D visual floor commander powered by WebMCP for modern athletic facilities. Built for the OpenAI WebMCP Challenge.',
  keywords: [
    'WebMCP',
    'OpenAI',
    'Gym ERP',
    'AI Agent',
    'Autonomous Operations',
    'Floor Commander',
    'Fitness Technology',
    'Next.js 15',
  ],
  authors: [{ name: 'Samuel Campozano & Marcos' }],
  creator: 'Viernes Team',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://viernes-gym-erp.vercel.app',
    title: 'Viernes AI — Autonomous Gym ERP & Visual Floor Commander',
    description:
      'Autonomous gym operations, interactive 2D floor blueprint, predictive churn radar, and native WebMCP browser agent tools.',
    siteName: 'Viernes AI',
    images: [
      {
        url: '/og-image.png',
        width: 1024,
        height: 1024,
        alt: 'Viernes AI — Autonomous Gym ERP Logo Emblem',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Viernes AI — Autonomous Gym ERP & Visual Floor Commander',
    description:
      'An agent-native operations system and 2D visual floor commander powered by WebMCP for modern athletic facilities.',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0F17',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icon.png" />
      </head>
      <body className="bg-background text-foreground antialiased selection:bg-stark-orange selection:text-black">
        {children}
      </body>
    </html>
  );
}

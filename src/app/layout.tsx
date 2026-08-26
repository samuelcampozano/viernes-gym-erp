import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Viernes — The Autonomous Gym ERP & Visual Floor Commander',
  description: 'An agent-native operations system and 2D visual floor commander powered by WebMCP for modern athletic facilities.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased selection:bg-stark-orange selection:text-black">
        {children}
      </body>
    </html>
  );
}

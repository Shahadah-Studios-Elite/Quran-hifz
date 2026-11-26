import type { Metadata, Viewport } from 'next';
import { Inter, Amiri } from 'next/font/google';
import './globals.css';
import LandingOverlay from '@/components/LandingOverlay';
import BismillahCleaner from '@/components/BismillahCleaner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'QuranHifz | Read and listen to the holy quran',
  description: 'Read, listen, and memorize the Holy Quran - SahihFinder',
  icons: {
    icon: '/favicon1.png',
    shortcut: '/favicon1.png',
    apple: '/favicon1.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${amiri.variable}`}>
      <body>
        <LandingOverlay />
        <BismillahCleaner />
        {children}
      </body>
    </html>
  );
}

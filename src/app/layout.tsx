import type { Metadata, Viewport } from 'next';
import {
  Inter,
  Amiri,
  Scheherazade_New,
  Noto_Naskh_Arabic,
  Lateef,
} from 'next/font/google';
import './globals.css';
import LandingOverlay from '@/components/LandingOverlay';
import BismillahCleaner from '@/components/BismillahCleaner';
import SettingsModal from '@/components/SettingsModal';
import VoiceCommands from '@/components/VoiceCommands';
import PageTouch from '@/components/PageTouch';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
});
const scheherazade = Scheherazade_New({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-scheherazade',
});
const notoNaskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-noto-naskh',
});
const lateef = Lateef({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-lateef',
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
    icon: '/favicon2.png',
    shortcut: '/favicon2.png',
    apple: '/favicon2.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${amiri.variable} ${scheherazade.variable} ${notoNaskh.variable} ${lateef.variable}`}
    >
      <body>
        <LandingOverlay />
        <BismillahCleaner />
        <SettingsModal />
        <VoiceCommands />
        <PageTouch />
        
        {children}
      </body>
    </html>
  );
}

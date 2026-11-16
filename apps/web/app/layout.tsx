import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';

// Импортируем выбранные шрифты с поддержкой кириллицы
import { 
  Montserrat, 
  Playfair_Display, 
  Great_Vibes, 
  Caveat, 
  Oswald, 
  Literata, 
  Poiret_One 
} from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin', 'cyrillic'], variable: '--font-montserrat' });
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], variable: '--font-playfair' });
const greatVibes = Great_Vibes({ subsets: ['latin', 'cyrillic'], weight: '400', variable: '--font-great-vibes' });
const caveat = Caveat({ subsets: ['latin', 'cyrillic'], variable: '--font-caveat' });
const oswald = Oswald({ subsets: ['latin', 'cyrillic'], variable: '--font-oswald' });
const literata = Literata({ subsets: ['latin', 'cyrillic'], variable: '--font-literata' });
const poiret = Poiret_One({ subsets: ['latin', 'cyrillic'], weight: '400', variable: '--font-poiret' });

export const metadata: Metadata = {
  title: 'Зови | Приглашения на мероприятия',
  description: 'Создавай события и собирай друзей. Без сбора персональных данных.',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Зови' },
  icons: { icon: '/icon-192x192.png', shortcut: '/icon-192x192.png', apple: '/icon-192x192.png' },
};

export const viewport: Viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="ru" 
      suppressHydrationWarning 
      className={`
        ${montserrat.variable} 
        ${playfair.variable} 
        ${greatVibes.variable} 
        ${caveat.variable} 
        ${oswald.variable} 
        ${literata.variable} 
        ${poiret.variable}
      `}
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          <ThemeSwitcher />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
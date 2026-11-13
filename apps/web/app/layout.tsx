import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';

export const metadata: Metadata = {
  title: 'Зови | Приглашения',
  description: 'Создавай события и собирай друзей.',
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
    <html lang="ru" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <ThemeSwitcher />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
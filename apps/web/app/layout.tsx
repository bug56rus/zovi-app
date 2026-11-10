import type { Metadata, Viewport } from 'next';
import './globals.css'; // Если у вас есть этот файл

export const metadata: Metadata = {
  title: 'Зови | Приглашения на мероприятия',
  description: 'Создавай события и собирай друзей. Без сбора персональных данных.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Зови',
  },
};

export const viewport: Viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Зови',
    short_name: 'Зови',
    description: 'Анонимные приглашения на мероприятия. Создавай события и собирай друзей.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fef08a', // Нежно-желтый (как в детской теме)
    theme_color: '#6366f1',      // Индиго (для верхней панели iPhone)
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

import RsvpButtons from './RsvpButtons';
import type { Metadata, ResolvingMetadata } from 'next';

// Функция для получения данных события с бэкенда
async function getEventData(inviteToken: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/i/${inviteToken}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

type Props = {
  params: Promise<{ inviteToken: string }>
};

// Генерация мета-тегов для красивого превью в MAX/Telegram/WhatsApp
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { inviteToken } = await params;
  const cleanToken = inviteToken.split(/[^a-zA-Z0-9]/)[0];
  const data = await getEventData(cleanToken);

  if (!data) {
    return { title: 'Приглашение не найдено | Зови' };
  }

  const { event } = data;
  const formattedDate = new Date(event.dateTime).toLocaleString('ru-RU');
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bsbt-d92r-y79f.gw-1a.dockhost.net';
  const ogImageUrl = event.coverImage 
    ? `${baseUrl}${event.coverImage}` 
    : `${baseUrl}/og-image.png`;

  return {
    title: `${event.title} — Приглашение | Зови`,
    description: `📅 ${formattedDate}${event.location ? ` · 📍 ${event.location}` : ''}. Подтвердите участие!`,
    openGraph: {
      title: event.title,
      description: `Приглашение на мероприятие. Ждем вас!`,
      type: 'website',
      siteName: 'Зови',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: event.title }],
    },
  };
}

export default async function InvitePage({ params }: Props) {
  const { inviteToken } = await params;
  const cleanToken = inviteToken.split(/[^a-zA-Z0-9]/)[0]; 
  const data = await getEventData(cleanToken);

  if (!data) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center font-sans p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-center shadow-2xl">
          <h1 className="text-3xl font-bold mb-2">Приглашение не найдено 😢</h1>
          <p className="text-gray-400">Возможно, ссылка устарела или была удалена.</p>
        </div>
      </main>
    );
  }

  const { event, guests } = data;

  // Маппинг шрифтов
  const fontMap: Record<string, string> = {
    'Montserrat': 'var(--font-montserrat)',
    'Playfair Display': 'var(--font-playfair)',
    'Great Vibes': 'var(--font-great-vibes)',
    'Caveat': 'var(--font-caveat)',
    'Oswald': 'var(--font-oswald)',
    'Literata': 'var(--font-literata)',
    'Poiret One': 'var(--font-poiret)',
  };

  const currentFont = fontMap[event.fontFamily] || fontMap['Great Vibes'];

  // Темы оформления
  const themes: Record<string, any> = {
    classic: { bg: "bg-[#0a0a0a] text-white", card: "bg-white/5 border-white/10", textMuted: "text-gray-400" },
    light: { bg: "bg-gray-100 text-gray-900", card: "bg-white/80 border-white shadow-xl", textMuted: "text-gray-600" },
    kids: { bg: "bg-[#fef08a] text-indigo-900", card: "bg-white/60 border-4 border-white shadow-xl", textMuted: "text-indigo-700 font-medium" }
  };
  const theme = themes[event.templateId] || themes.kids;

  // Умный градиент для читаемости (зависит от цвета текста)
  const isDarkText = ['#000000', '#111827', '#312e81', '#3730a3'].includes(event.textColor?.toLowerCase());
  const overlayGradient = isDarkText 
    ? 'from-white/90 via-white/50 to-transparent' 
    : 'from-black/90 via-black/50 to-transparent';

  return (
    <main className={`min-h-screen p-6 font-sans flex flex-col items-center ${theme.bg}`}>
      <div className="w-full max-w-md mt-6">
        
        {/* Карточка с картинкой и текстом поверх */}
        <div className={`mb-6 relative overflow-hidden h-[450px] rounded-3xl shadow-2xl border border-white/20`}>
          
          {event.coverImage && (
            <img src={event.coverImage} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
          )}

          <div className={`absolute inset-0 bg-gradient-to-t ${overlayGradient} opacity-80 pointer-events-none`}></div>

          {/* 👇 ТЕКСТ ПОЗИЦИОНИРУЕТСЯ ПО КООРДИНАТАМ X И Y (КАК ПРИ ПЕРЕТАСКИВАНИИ) */}
          <div 
            className="absolute flex flex-col w-[85%]"
            style={{ 
              left: `${event.textX !== null && event.textX !== undefined ? event.textX : 50}%`, 
              top: `${event.textY !== null && event.textY !== undefined ? event.textY : 50}%`, 
              transform: 'translate(-50%, -50%)',
              fontFamily: currentFont 
            }}
          >
            <h1 
              className="text-4xl font-bold mb-2 tracking-tight drop-shadow-md text-center leading-tight"
              style={{ color: event.textColor || '#ffffff' }}
            >
              {event.title}
            </h1>
            
            <div 
              className={`space-y-1 text-sm font-medium drop-shadow-sm text-center ${theme.textMuted}`}
              style={{ color: event.textColor || '#ffffff', opacity: 0.9 }}
            >
              <p>📅 {new Date(event.dateTime).toLocaleString('ru-RU')}</p>
              {event.location && <p>📍 {event.location}</p>}
              {event.description && <p className="mt-2 text-xs">{event.description}</p>}
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4 ml-2">Ваш ответ:</h3>
        <RsvpButtons inviteToken={cleanToken} currentStatus={data.currentGuestStatus} templateId={event.templateId} />

        {event.showGuests && (
          <div className={`mt-6 p-6 rounded-3xl ${theme.card}`}>
            <h3 className="text-lg font-semibold mb-3">Уже ответили ({guests.length}):</h3>
            <ul className="space-y-2">
              {guests.map((g: any, i: number) => (
                <li key={i} className={`text-sm ${theme.textMuted}`}>
                  Гость {i + 1} — {g.status === 'going' ? '✅ Идет' : g.status === 'maybe' ? '🤔 Думает' : '❌ Не идет'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
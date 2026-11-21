import RsvpButtons from './RsvpButtons';
import type { Metadata, ResolvingMetadata } from 'next';

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

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { inviteToken } = await params;
  const cleanToken = inviteToken.split(/[^a-zA-Z0-9]/)[0];
  const data = await getEventData(cleanToken);

  if (!data) return { title: 'Приглашение не найдено | Зови' };

  const { event } = data;
  const formattedDate = new Date(event.dateTime).toLocaleString('ru-RU');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bsbt-d92r-y79f.gw-1a.dockhost.net';
  const ogImageUrl = event.coverImage ? `${baseUrl}${event.coverImage}` : `${baseUrl}/og-image.png`;

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
      <main className="min-h-[100dvh] bg-gray-900 text-white flex items-center justify-center font-sans p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-center shadow-2xl">
          <h1 className="text-3xl font-bold mb-2">Приглашение не найдено 😢</h1>
        </div>
      </main>
    );
  }

  const { event, guests } = data;

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

  // Темы для нижней панели (кнопок)
  const themes: Record<string, any> = {
    classic: { bg: "bg-[#0a0a0a] text-white", sheet: "bg-[#1a1a1a]/95 border-t border-white/10", textMuted: "text-gray-400" },
    light: { bg: "bg-gray-100 text-gray-900", sheet: "bg-white/95 border-t border-gray-200", textMuted: "text-gray-600" },
    kids: { bg: "bg-[#fef08a] text-indigo-900", sheet: "bg-white/95 border-t border-white/50", textMuted: "text-indigo-700" }
  };
  const theme = themes[event.templateId] || themes.kids;

  const isDarkText = ['#000000', '#111827', '#312e81', '#3730a3'].includes(event.textColor?.toLowerCase());
  const overlayGradient = isDarkText 
    ? 'from-white/90 via-white/40 to-transparent' 
    : 'from-black/90 via-black/40 to-transparent';

  return (
    // Используем 100dvh для правильной высоты на iOS
    <main className={`min-h-[100dvh] flex flex-col font-sans ${theme.bg}`}>
      
      {/* ВЕРХНЯЯ ЧАСТЬ: ОТКРЫТКА (ВИЗИТКА) НА ВЕСЬ ЭКРАН */}
      <div className="relative w-full flex-1 min-h-[65vh] sm:min-h-[75vh] overflow-hidden">
        
        {event.coverImage && (
          <img src={event.coverImage} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
        )}

        {/* Градиент для читаемости */}
        <div className={`absolute inset-0 bg-gradient-to-t ${overlayGradient} opacity-90 pointer-events-none`}></div>

        {/* Текст на открытке (позиционируется по X и Y) */}
        <div 
          className="absolute flex flex-col w-[85%]"
          style={{ 
            left: `${event.textX ?? 50}%`, 
            top: `${event.textY ?? 50}%`, 
            transform: 'translate(-50%, -50%)',
            fontFamily: currentFont 
          }}
        >
          <h1 
            className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight drop-shadow-lg text-center leading-tight"
            style={{ color: event.textColor || '#ffffff' }}
          >
            {event.title}
          </h1>
          
          <div 
            className="space-y-1 text-sm sm:text-base font-medium drop-shadow-md text-center"
            style={{ color: event.textColor || '#ffffff', opacity: 0.95 }}
          >
            <p>📅 {new Date(event.dateTime).toLocaleString('ru-RU')}</p>
            {event.location && <p>📍 {event.location}</p>}
            {event.description && <p className="mt-2 text-xs opacity-90">{event.description}</p>}
          </div>
        </div>
      </div>

      {/* НИЖНЯЯ ЧАСТЬ: КНОПКИ И СПИСОК ГОСТЕЙ (БОТТОМ-ШИТ) */}
      <div className={`relative z-10 w-full -mt-6 rounded-t-3xl backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pb-10 flex flex-col gap-6 ${theme.sheet}`}>
        
        <div className="w-12 h-1.5 bg-gray-300/50 rounded-full mx-auto mb-2"></div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-center">Подтвердите участие</h3>
          <RsvpButtons inviteToken={cleanToken} currentStatus={data.currentGuestStatus} templateId={event.templateId} />
        </div>

        {event.showGuests && (
          <div className="mt-2">
            <h3 className={`text-sm font-semibold mb-3 uppercase tracking-wider ${theme.textMuted}`}>
              Уже ответили ({guests.length}):
            </h3>
            <div className="flex flex-wrap gap-2">
              {guests.map((g: any, i: number) => (
                <div key={i} className={`px-3 py-1.5 rounded-full text-xs font-medium border border-black/5 bg-black/5 flex items-center gap-1`}>
                  <span>{g.status === 'going' ? '✅' : g.status === 'maybe' ? '🤔' : '❌'}</span>
                  <span>Гость {i + 1}</span>
                </div>
              ))}
              {guests.length === 0 && (
                <p className={`text-sm ${theme.textMuted}`}>Пока никто не ответил. Будьте первым!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
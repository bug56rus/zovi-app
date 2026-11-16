import RsvpButtons from './RsvpButtons';
import type { Metadata, ResolvingMetadata } from 'next';

async function getEventData(inviteToken: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/i/${inviteToken}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

type Props = { params: Promise<{ inviteToken: string }> };

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { inviteToken } = await params;
  const cleanToken = inviteToken.split(/[^a-zA-Z0-9]/)[0];
  const data = await getEventData(cleanToken);

  if (!data) return { title: 'Приглашение не найдено | Зови' };
  const { event } = data;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bsbt-d92r-y79f.gw-1a.dockhost.net';
  
  return {
    title: `${event.title} — Приглашение | Зови`,
    openGraph: {
      title: event.title,
      images: [{ url: event.coverImage ? `${baseUrl}${event.coverImage}` : `${baseUrl}/og-image.png` }],
    },
  };
}

export default async function InvitePage({ params }: Props) {
  const { inviteToken } = await params;
  const cleanToken = inviteToken.split(/[^a-zA-Z0-9]/)[0]; 
  const data = await getEventData(cleanToken);

  if (!data) return <div className="p-10 text-center text-white bg-black min-h-screen">Приглашение не найдено</div>;
  const { event, guests } = data;

  // Цветовые темы
  const themes: Record<string, any> = {
    classic: { bg: "bg-[#0a0a0a] text-white", card: "bg-white/5 border-white/10", textMuted: "text-gray-400", overlay: "from-black/90 via-black/50 to-transparent" },
    light: { bg: "bg-gray-100 text-gray-900", card: "bg-white/80 border-white shadow-xl", textMuted: "text-gray-600", overlay: "from-white/90 via-white/50 to-transparent" },
    kids: { bg: "bg-[#fef08a] text-indigo-900", card: "bg-white/60 border-4 border-white shadow-xl", textMuted: "text-indigo-700 font-medium", overlay: "from-white/90 via-white/60 to-transparent" }
  };
  const theme = themes[event.templateId] || themes.kids;

  // Выравнивание текста на основе выбранной позиции
  const flexPositions: Record<string, string> = {
    'top-left': 'items-start justify-start text-left',
    'top-center': 'items-start justify-center text-center',
    'top-right': 'items-start justify-end text-right',
    'center-left': 'items-center justify-start text-left',
    'center': 'items-center justify-center text-center',
    'center-right': 'items-center justify-end text-right',
    'bottom-left': 'items-end justify-start text-left',
    'bottom-center': 'items-end justify-center text-center',
    'bottom-right': 'items-end justify-end text-right',
  };
  const currentPos = flexPositions[event.coverPosition] || flexPositions['center'];

  return (
    <main className={`min-h-screen p-6 font-sans flex flex-col items-center ${theme.bg}`}>
      <div className="w-full max-w-md mt-6">
        
        {/* Карточка с картинкой и текстом поверх */}
        <div className={`mb-6 relative overflow-hidden h-[450px] rounded-3xl shadow-2xl border border-white/20`}>
          
          {event.coverImage && (
            <img src={event.coverImage} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
          )}

          {/* Градиентная подложка для читаемости текста */}
          <div className={`absolute inset-0 bg-gradient-to-t ${theme.overlay} opacity-80 pointer-events-none`}></div>

          {/* Текст позиционируется в зависимости от event.coverPosition */}
          <div className={`absolute inset-0 p-8 flex flex-col ${currentPos}`}>
            <h1 className={`text-4xl font-bold mb-3 tracking-tight drop-shadow-md ${event.coverPosition?.includes('center') ? 'mx-auto' : ''}`}>
              {event.title}
            </h1>
            
            <div className={`space-y-1 ${theme.textMuted} text-sm font-medium drop-shadow-sm`}>
              <p>📅 {new Date(event.dateTime).toLocaleString('ru-RU')}</p>
              {event.location && <p>📍 {event.location}</p>}
              {event.description && <p className="mt-2 text-xs opacity-90">{event.description}</p>}
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
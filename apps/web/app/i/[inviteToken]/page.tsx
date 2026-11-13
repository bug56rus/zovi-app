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

  return {
    title: `${event.title} — Приглашение | Зови`,
    description: `📅 ${formattedDate}${event.location ? ` · 📍 ${event.location}` : ''}. Подтвердите участие!`,
    openGraph: {
      title: event.title,
      description: `Приглашение на мероприятие. Ждем вас!`,
      type: 'website',
      siteName: 'Зови',
      images: ['/og-image.png'],
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

  // ВЫБОР СТИЛЕЙ В ЗАВИСИМОСТИ ОТ ТЕМЫ
  const themes: Record<string, any> = {
    classic: {
      bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white",
      card: "bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl",
      textMuted: "text-gray-300",
      btn: "bg-white/5 hover:bg-white/10 border-white/10",
      avatar: "bg-white/10"
    },
    light: {
      bg: "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-900",
      card: "bg-white/70 backdrop-blur-xl border border-white shadow-xl rounded-3xl",
      textMuted: "text-gray-600",
      btn: "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-900",
      avatar: "bg-gray-200"
    },
    kids: {
      bg: "bg-gradient-to-br from-yellow-200 via-pink-200 to-indigo-200 text-indigo-900",
      card: "bg-white/60 backdrop-blur-xl border-4 border-white shadow-xl rounded-[2.5rem]",
      textMuted: "text-indigo-700 font-medium",
      btn: "bg-white/50 hover:bg-white/80 border-white shadow-sm",
      avatar: "bg-indigo-200 text-indigo-800 font-bold"
    }
  };

  const theme = themes[event.templateId] || themes.classic;

  return (
    <main className={`min-h-screen p-6 font-sans flex flex-col items-center transition-colors duration-500 ${theme.bg}`}>
      <div className="w-full max-w-md mt-10">
        
        <div className={`p-8 mb-8 relative overflow-hidden ${theme.card}`}>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">{event.title}</h1>
          <div className={`space-y-2 ${theme.textMuted}`}>
            <p className="flex items-center gap-2"><span>📅</span> {new Date(event.dateTime).toLocaleString('ru-RU')}</p>
            {event.location && <p className="flex items-center gap-2"><span>📍</span> {event.location}</p>}
            {event.description && (
              <p className={`mt-4 text-sm border-t pt-4 ${event.templateId === 'kids' ? 'border-indigo-200' : 'border-white/10'}`}>
                {event.description}
              </p>
            )}
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4 ml-2">Ваш ответ:</h3>
        <RsvpButtons inviteToken={cleanToken} currentStatus={data.currentGuestStatus} templateId={event.templateId} />

        {event.showGuests && (
          <div className={`mt-8 p-6 ${theme.card}`}>
            <h3 className="text-lg font-semibold mb-4">Уже ответили ({guests.length}):</h3>
            <ul className="space-y-3">
              {guests.map((g: any, i: number) => (
                <li key={i} className={`flex items-center gap-3 ${theme.textMuted}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${theme.avatar}`}>
                    {i + 1}
                  </div>
                  {g.status === 'going' ? '✅ Идет' : g.status === 'maybe' ? '🤔 Думает' : '❌ Не идет'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
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

// Генерация мета-тегов для красивого превью в MAX/Telegram
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

// Основной компонент страницы
export default async function InvitePage({ params }: Props) {
  const { inviteToken } = await params;
  
  // Защита от мусора в ссылке (если скопировали вместе с текстом)
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 font-sans flex flex-col items-center">
      <div className="w-full max-w-md mt-10">
        
        {/* Карточка события (Жидкое стекло) */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl mb-8 shadow-2xl relative overflow-hidden">
          {/* Легкое свечение на фоне карточки */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
          
          <h1 className="text-4xl font-bold mb-4 tracking-tight relative z-10">{event.title}</h1>
          <div className="space-y-2 text-gray-300 relative z-10">
            <p className="flex items-center gap-2">
              <span>📅</span> {new Date(event.dateTime).toLocaleString('ru-RU')}
            </p>
            {event.location && (
              <p className="flex items-center gap-2">
                <span>📍</span> {event.location}
              </p>
            )}
            {event.description && (
              <p className="mt-4 text-sm text-gray-400 border-t border-white/10 pt-4">
                {event.description}
              </p>
            )}
          </div>
        </div>

        {/* Блок с кнопками */}
        <h3 className="text-xl font-semibold mb-4 ml-2">Ваш ответ:</h3>
        <RsvpButtons inviteToken={cleanToken} currentStatus={data.currentGuestStatus} />

        {/* Список гостей (если разрешено организатором) */}
        {event.showGuests && (
          <div className="mt-8 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Уже ответили ({guests.length}):</h3>
            <ul className="space-y-3">
              {guests.map((g: any, i: number) => (
                <li key={i} className="text-gray-300 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
                    {i + 1}
                  </div>
                  {g.status === 'going' ? '✅ Идет' : g.status === 'maybe' ? '🤔 Думает' : '❌ Не идет'}
                </li>
              ))}
              {guests.length === 0 && (
                <p className="text-gray-500 text-sm">Пока никто не ответил. Будьте первым!</p>
              )}
            </ul>
          </div>
        )}
        
        {/* Футер */}
        <div className="text-center mt-12 mb-6 opacity-50">
          <p className="text-xs">Создано в приложении Зови</p>
        </div>
        
      </div>
    </main>
  );
}
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

export default async function InvitePage({ params }: Props) {
  const { inviteToken } = await params;
  
  const cleanToken = inviteToken.split(/[^a-zA-Z0-9]/)[0]; 
  
  const data = await getEventData(cleanToken);

  if (!data) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>Приглашение не найдено 😢</h1>
      </div>
    );
  }

  const { event, guests } = data;

  return (
    <main style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 500, margin: '0 auto' }}>
      
      {/* Карточка события */}
      <div style={{ background: '#f4f4f5', padding: 20, borderRadius: 16, marginBottom: 20 }}>
        <h1 style={{ marginTop: 0 }}>{event.title}</h1>
        <p><strong>📅 Дата:</strong> {new Date(event.dateTime).toLocaleString('ru-RU')}</p>
        {event.location && <p><strong>📍 Место:</strong> {event.location}</p>}
        {event.description && <p><strong>📝 Описание:</strong> {event.description}</p>}
      </div>

      {/* Блок с кнопками RSVP */}
      <h3>Ваш ответ:</h3>
      <RsvpButtons inviteToken={cleanToken} currentStatus={data.currentGuestStatus} />

      {/* Список гостей (если разрешено организатором) */}
      {event.showGuests && (
        <div style={{ marginTop: 40 }}>
          <h3>Уже ответили ({guests.length}):</h3>
          <ul style={{ paddingLeft: 20 }}>
            {guests.map((g: any, i: number) => (
              <li key={i} style={{ marginBottom: 5 }}>
                Гость {i + 1} — {g.status === 'going' ? '✅ Идет' : g.status === 'maybe' ? '🤔 Думает' : '❌ Не идет'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
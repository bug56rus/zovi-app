import RsvpButtons from './RsvpButtons';

async function getEventData(inviteToken: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/i/${inviteToken}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function InvitePage({ params }: { params: Promise<{ inviteToken: string }> }) {
  const { inviteToken } = await params;
  
  // МАГИЯ: берем только первую часть токена (до пробела или спецсимвола), 
  // чтобы страница не ломалась, если скопировать текст вместе со ссылкой.
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
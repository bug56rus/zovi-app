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
  const formattedDate = new Date(event.dateTime).toLocaleString('ru-RU');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bsbt-d92r-y79f.gw-1a.dockhost.net';
  const ogImageUrl = event.coverImage ? `${baseUrl}${event.coverImage}` : `${baseUrl}/og-image.png`;
  return {
    title: `${event.title} — Приглашение | Зови`,
    description: `${formattedDate}${event.location ? ` · ${event.location}` : ''}. Подтвердите участие!`,
    openGraph: { title: event.title, description: `Приглашение на мероприятие. Ждем вас!`, type: 'website', siteName: 'Зови', images: [{ url: ogImageUrl, width: 1200, height: 630, alt: event.title }] },
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
    'Montserrat': 'var(--font-montserrat)', 'Playfair Display': 'var(--font-playfair)',
    'Great Vibes': 'var(--font-great-vibes)', 'Caveat': 'var(--font-caveat)',
    'Oswald': 'var(--font-oswald)', 'Literata': 'var(--font-literata)', 'Poiret One': 'var(--font-poiret)',
  };
  const currentFont = fontMap[event.fontFamily] || fontMap['Great Vibes'];

  const themes: Record<string, any> = {
    classic: { bg: "bg-[#0a0a0a] text-white", sheet: "bg-[#1a1a1a]/95 border-t border-white/10", textMuted: "text-gray-400" },
    light: { bg: "bg-gray-100 text-gray-900", sheet: "bg-white/95 border-t border-gray-200", textMuted: "text-gray-600" },
    kids: { bg: "bg-[#fef08a] text-indigo-900", sheet: "bg-white/95 border-t border-white/50", textMuted: "text-indigo-700" }
  };
  const theme = themes[event.templateId] || themes.kids;

  return (
    <main className={`min-h-[100dvh] flex flex-col items-center justify-center p-4 font-sans ${theme.bg}`}>
      <div style={{ containerType: 'inline-size' }} className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-black/10">
        {event.coverImage && <img src={event.coverImage} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />}
        
        {/* УБРАН ГРАДИЕНТ (ЗАТЕМНЕНИЕ) */}

        <div className="absolute flex flex-col w-[85%]" style={{ left: `${event.textX ?? 50}%`, top: `${event.textY ?? 50}%`, transform: 'translate(-50%, -50%)', fontFamily: currentFont }}>
          <h1 className="text-[8cqw] font-bold mb-[1.5cqw] tracking-tight drop-shadow-lg text-center leading-tight" style={{ color: event.textColor || '#ffffff' }}>
            {event.title}
          </h1>
          
          <div className="space-y-[1.5cqw] text-[7cqw] font-medium drop-shadow-md text-center" style={{ color: event.textColor || '#ffffff', opacity: 0.95 }}>
            <p>{new Date(event.dateTime).toLocaleString('ru-RU')}</p>
            {event.location && <p>📍 {event.location}</p>}
            {event.description && <p className="mt-[1.5cqw] text-[6cqw] opacity-90 leading-tight">{event.description}</p>}
          </div>
        </div>
      </div>

      <div className={`w-full max-w-md mt-6 rounded-3xl backdrop-blur-xl shadow-xl p-6 flex flex-col gap-5 ${theme.sheet}`}>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-center">Подтвердите участие</h3>
          <RsvpButtons inviteToken={cleanToken} currentStatus={data.currentGuestStatus} templateId={event.templateId} />
        </div>
        {event.showGuests && (
          <div className="mt-1">
            <h3 className={`text-sm font-semibold mb-3 uppercase tracking-wider text-center ${theme.textMuted}`}>Уже ответили ({guests.length}):</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {guests.map((g: any, i: number) => (
                <div key={i} className="px-3 py-1.5 rounded-full text-xs font-medium border border-black/5 bg-black/5 flex items-center gap-1">
                  <span>{g.status === 'going' ? '✅' : g.status === 'maybe' ? '🤔' : '❌'}</span>
                  <span>Гость {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 mb-4 text-center">
        <a href="/admin" className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all hover:scale-105 active:scale-95 ${theme.sheet}`}>
          <span className="text-base">✨</span>
          <span className={`text-xs font-medium ${theme.textMuted}`}>Создать своё приглашение в Зови</span>
        </a>
      </div>
    </main>
  );
}
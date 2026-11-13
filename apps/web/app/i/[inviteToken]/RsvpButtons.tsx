'use client';
import { useState } from 'react';
import { playClick } from '../../utils/sound'; // Проверьте правильность пути (из i/[token] до app/utils)

export default function RsvpButtons({ inviteToken, currentStatus }: { inviteToken: string, currentStatus?: string }) {
  const [loading, setLoading] = useState(false);

  const handleRsvp = async (newStatus: 'going' | 'maybe' | 'not_going') => {
    playClick(); // Звук!
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/i/${inviteToken}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      });
      if (res.ok) window.location.reload();
      else alert('Ошибка при отправке ответа');
    } catch (e) { alert('Ошибка сети'); }
    setLoading(false);
  };

  return (
    <div className="flex gap-3 mb-8">
      <button onClick={() => handleRsvp('going')} disabled={loading}
        className="flex-1 py-4 bg-green-500/20 backdrop-blur-md border border-green-500/40 text-green-400 rounded-2xl font-semibold hover:bg-green-500/30 active:scale-95 transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)] disabled:opacity-50">
        ✅ Приду
      </button>
      <button onClick={() => handleRsvp('maybe')} disabled={loading}
        className="flex-1 py-4 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/40 text-yellow-400 rounded-2xl font-semibold hover:bg-yellow-500/30 active:scale-95 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] disabled:opacity-50">
        🤔 Может
      </button>
      <button onClick={() => handleRsvp('not_going')} disabled={loading}
        className="flex-1 py-4 bg-red-500/20 backdrop-blur-md border border-red-500/40 text-red-400 rounded-2xl font-semibold hover:bg-red-500/30 active:scale-95 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] disabled:opacity-50">
        ❌ Нет
      </button>
    </div>
  );
}
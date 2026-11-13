'use client';
import { useState } from 'react';
import { playClick } from '../../utils/sound';

export default function RsvpButtons({ inviteToken, currentStatus, templateId }: { inviteToken: string, currentStatus?: string, templateId?: string }) {
  const [loading, setLoading] = useState(false);

  const handleRsvp = async (newStatus: 'going' | 'maybe' | 'not_going') => {
    playClick();
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

  // Стили кнопок в зависимости от темы
  const btnBase = "flex-1 py-4 rounded-2xl font-semibold active:scale-95 transition-all disabled:opacity-50";
  
  const getBtnStyle = (status: string) => {
    if (templateId === 'light') {
      if (status === 'going') return "bg-green-500 text-white shadow-lg shadow-green-500/30";
      if (status === 'maybe') return "bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/30";
      return "bg-red-500 text-white shadow-lg shadow-red-500/30";
    }
    if (templateId === 'kids') {
      if (status === 'going') return "bg-green-400 text-green-950 border-b-4 border-green-600 hover:bg-green-300";
      if (status === 'maybe') return "bg-yellow-400 text-yellow-950 border-b-4 border-yellow-600 hover:bg-yellow-300";
      return "bg-red-400 text-red-950 border-b-4 border-red-600 hover:bg-red-300";
    }
    // Classic (Темная)
    if (status === 'going') return "bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]";
    if (status === 'maybe') return "bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]";
    return "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
  };

  return (
    <div className="flex gap-3 mb-8">
      <button onClick={() => handleRsvp('going')} disabled={loading} className={`${btnBase} ${getBtnStyle('going')}`}>✅ Приду</button>
      <button onClick={() => handleRsvp('maybe')} disabled={loading} className={`${btnBase} ${getBtnStyle('maybe')}`}>🤔 Может</button>
      <button onClick={() => handleRsvp('not_going')} disabled={loading} className={`${btnBase} ${getBtnStyle('not_going')}`}>❌ Нет</button>
    </div>
  );
}
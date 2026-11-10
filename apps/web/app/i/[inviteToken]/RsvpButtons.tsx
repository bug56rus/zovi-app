'use client';

import { useState } from 'react';

export default function RsvpButtons({ inviteToken, currentStatus }: { inviteToken: string, currentStatus?: string }) {
  const [loading, setLoading] = useState(false);

  const handleRsvp = async (newStatus: 'going' | 'maybe' | 'not_going') => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/i/${inviteToken}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include', // Важно для сохранения cookie (magic_token)
      });
      if (res.ok) {
        // Перезагружаем страницу, чтобы сервер отрисовал обновленный список гостей
        window.location.reload();
      } else {
        alert('Ошибка при отправке ответа');
      }
    } catch (e) {
      alert('Ошибка сети');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
      <button 
        onClick={() => handleRsvp('going')} disabled={loading}
        style={{ flex: 1, padding: 15, background: '#22c55e', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>
        ✅ Приду
      </button>
      <button 
        onClick={() => handleRsvp('maybe')} disabled={loading}
        style={{ flex: 1, padding: 15, background: '#eab308', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>
        🤔 Может быть
      </button>
      <button 
        onClick={() => handleRsvp('not_going')} disabled={loading}
        style={{ flex: 1, padding: 15, background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>
        ❌ Не смогу
      </button>
    </div>
  );
}
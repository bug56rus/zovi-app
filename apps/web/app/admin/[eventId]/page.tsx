'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { playClick } from '../../utils/sound';

export default function EventDashboard() {
  const { eventId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const fetchEventData = async () => {
    const adminToken = localStorage.getItem(`admin_token_${eventId}`);
    if (!adminToken) {
      setError('У вас нет доступа к этому событию');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, {
        headers: { 'X-Admin-Token': adminToken }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setError('Не удалось загрузить данные');
      }
    } catch (e) {
      setError('Ошибка сети');
    }
    setLoading(false);
  };

  useEffect(() => { fetchEventData(); }, [eventId]);

  const generateInvite = async () => {
    playClick();
    setGenerating(true);
    const adminToken = localStorage.getItem(`admin_token_${eventId}`);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken as string },
        body: JSON.stringify({ count: 1 })
      });
      await fetchEventData();
    } catch (e) {
      alert('Ошибка при создании ссылки');
    }
    setGenerating(false);
  };

  const deleteInvite = async (inviteId: string) => {
    if (!confirm('Удалить это приглашение?')) return;
    playClick();
    const adminToken = localStorage.getItem(`admin_token_${eventId}`);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/invites/${inviteId}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Token': adminToken as string }
      });
      await fetchEventData();
    } catch (e) {
      alert('Ошибка при удалении');
    }
  };

  const shareInvite = async (inviteToken: string) => {
    playClick();
    const url = `${window.location.origin}/i/${inviteToken}`;
    const text = `Приглашаю тебя на «${data.event.title}»! Подтверди участие по ссылке:`;
    
    if (navigator.share) {
      try { await navigator.share({ title: data.event.title, text, url }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(url);
      alert('Ссылка скопирована!');
    }
  };

  const copyLink = (inviteToken: string) => {
    playClick();
    navigator.clipboard.writeText(`${window.location.origin}/i/${inviteToken}`);
    alert('Ссылка скопирована!');
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">Загрузка...</div>;
  if (error) return <div className="min-h-screen bg-black text-red-500 flex items-center justify-center font-sans">{error}</div>;
  if (!data) return null;

  const { event, invites } = data;
  const goingCount = invites.filter((i: any) => i.status === 'going').length;
  const notGoingCount = invites.filter((i: any) => i.status === 'not_going').length;
  const maybeCount = invites.filter((i: any) => i.status === 'maybe').length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* Шапка */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">{event.title}</h1>
          <p className="text-gray-400">📅 {new Date(event.dateTime).toLocaleString('ru-RU')}</p>
          <p className="text-gray-400">📍 {event.location || 'Место не указано'}</p>
        </div>

        {/* Статистика (Жидкое стекло) */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-green-500/20 backdrop-blur-md border border-green-500/30 p-4 rounded-2xl text-center">
            <div className="text-3xl font-bold text-green-400">{goingCount}</div>
            <div className="text-xs text-green-300 uppercase tracking-wider">Придут</div>
          </div>
          <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 p-4 rounded-2xl text-center">
            <div className="text-3xl font-bold text-yellow-400">{maybeCount}</div>
            <div className="text-xs text-yellow-300 uppercase tracking-wider">Не уверены</div>
          </div>
          <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 p-4 rounded-2xl text-center">
            <div className="text-3xl font-bold text-red-400">{notGoingCount}</div>
            <div className="text-xs text-red-300 uppercase tracking-wider">Не придут</div>
          </div>
        </div>

        <button onClick={generateInvite} disabled={generating}
          className="w-full py-4 mb-8 bg-white text-black font-semibold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          {generating ? 'Создаем...' : '+ Создать новую ссылку'}
        </button>

        {/* Список гостей */}
        <h3 className="text-xl font-semibold mb-4">Ваши приглашения ({invites.length}):</h3>
        <div className="flex flex-col gap-3">
          {invites.map((invite: any, index: number) => {
            let statusIcon = '⏳';
            if (invite.status === 'going') statusIcon = '✅';
            if (invite.status === 'maybe') statusIcon = '🤔';
            if (invite.status === 'not_going') statusIcon = '❌';

            return (
              <div key={invite.id} className="flex items-center justify-between bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <strong className="text-lg">Гость #{index + 1}</strong> 
                  <span className="text-xl">{statusIcon}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => copyLink(invite.inviteToken)}
                    className="px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 active:scale-95 transition-all text-sm font-medium">
                    📋 Копировать
                  </button>
                  <button onClick={() => shareInvite(invite.inviteToken)}
                    className="px-4 py-2 bg-blue-500/80 rounded-xl hover:bg-blue-500 active:scale-95 transition-all text-sm font-medium">
                    Поделиться ↗
                  </button>
                  <button onClick={() => deleteInvite(invite.id)}
                    className="px-3 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/40 active:scale-95 transition-all text-sm font-medium">
                    Удалить
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
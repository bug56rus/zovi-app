'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { playClick } from '../../utils/sound';
import { useTheme } from '../../context/ThemeContext';

export default function EventDashboard() {
  const { eventId } = useParams();
  const { theme } = useTheme();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  
  // Хранилище для локальных имен (связка inviteId -> Имя)
  const [localNames, setLocalNames] = useState<Record<string, string>>({});

  // Загружаем имена из localStorage при старте
  useEffect(() => {
    const saved = localStorage.getItem(`guest_names_${eventId}`);
    if (saved) {
      try { setLocalNames(JSON.parse(saved)); } catch (e) {}
    }
  }, [eventId]);

  const fetchEventData = async (isBackground = false) => {
    const adminToken = localStorage.getItem(`admin_token_${eventId}`);
    if (!adminToken) { setError('Нет доступа'); setLoading(false); return; }
    if (isBackground) setRefreshing(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, { 
        headers: { 'X-Admin-Token': adminToken },
        cache: 'no-store'
      });
      if (res.ok) setData(await res.json());
      else setError('Ошибка данных');
    } catch (e) { 
      if (!isBackground) setError('Ошибка сети'); 
    }
    
    if (isBackground) setRefreshing(false);
    else setLoading(false);
  };

  useEffect(() => { 
    fetchEventData();
    const interval = setInterval(() => fetchEventData(true), 5000);
    return () => clearInterval(interval);
  }, [eventId]);

  const generateInvite = async () => {
    playClick(); setGenerating(true);
    const adminToken = localStorage.getItem(`admin_token_${eventId}`);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/invites`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken as string }, 
        body: JSON.stringify({ count: 1 }) 
      });
      await fetchEventData(true);
    } catch (e) { alert('Ошибка при создании ссылки'); }
    setGenerating(false);
  };

  const deleteInvite = async (inviteId: string) => {
    if (!confirm('Удалить?')) return;
    playClick();
    const adminToken = localStorage.getItem(`admin_token_${eventId}`);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/invites/${inviteId}`, { 
        method: 'DELETE', headers: { 'X-Admin-Token': adminToken as string } 
      });
      await fetchEventData(true);
    } catch (e) { alert('Ошибка при удалении'); }
  };

  // ФУНКЦИЯ ПЕРЕИМЕНОВАНИЯ
  const renameGuest = (inviteId: string) => {
    playClick();
    const currentName = localNames[inviteId] || '';
    const newName = prompt('Введите имя гостя:', currentName);
    
    if (newName !== null) {
      const updatedNames = { ...localNames, [inviteId]: newName.trim() };
      setLocalNames(updatedNames);
      // Сохраняем ТОЛЬКО на устройстве. На сервер ничего не уходит!
      localStorage.setItem(`guest_names_${eventId}`, JSON.stringify(updatedNames));
    }
  };

  const shareInvite = async (inviteToken: string) => {
    playClick();
    const url = `${window.location.origin}/i/${inviteToken}`;
    const text = `Приглашаю тебя на «${data.event.title}»! Подтверди участие:`;
    if (navigator.share) { 
      try { await navigator.share({ title: data.event.title, text, url }); } catch (err) {} 
    } else { navigator.clipboard.writeText(url); alert('Скопировано!'); }
  };

  const copyLink = (inviteToken: string) => {
    playClick(); navigator.clipboard.writeText(`${window.location.origin}/i/${inviteToken}`); alert('Скопировано!');
  };

  const styles = {
    classic: { bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white", card: "bg-white/5 border-white/10", btnPrimary: "bg-white text-black", btnSecondary: "bg-white/10 hover:bg-white/20", textMuted: "text-gray-400" },
    light: { bg: "bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900", card: "bg-white/80 border-white shadow-sm", btnPrimary: "bg-blue-600 text-white", btnSecondary: "bg-gray-200 hover:bg-gray-300", textMuted: "text-gray-500" },
    kids: { bg: "bg-gradient-to-br from-yellow-200 via-pink-200 to-indigo-200 text-indigo-900", card: "bg-white/60 border-2 border-white rounded-3xl shadow-sm", btnPrimary: "bg-indigo-500 text-white rounded-full", btnSecondary: "bg-white/50 hover:bg-white/80 rounded-full", textMuted: "text-indigo-700" }
  };
  const s = styles[theme as keyof typeof styles] || styles.kids;

  if (loading) return <div className={`min-h-screen flex items-center justify-center font-sans ${s.bg}`}>Загрузка...</div>;
  if (error) return <div className="min-h-screen bg-red-500 flex items-center justify-center text-white font-sans">{error}</div>;
  if (!data) return null;

  const { event, invites } = data;
  const goingCount = invites.filter((i: any) => i.status === 'going').length;
  const notGoingCount = invites.filter((i: any) => i.status === 'not_going').length;
  const maybeCount = invites.filter((i: any) => i.status === 'maybe').length;

  return (
    <main className={`min-h-screen p-6 font-sans transition-colors duration-500 ${s.bg}`}>
      <div className="max-w-2xl mx-auto pt-10">
        
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{event.title}</h1>
            <p className={s.textMuted}>📅 {new Date(event.dateTime).toLocaleString('ru-RU')}</p>
            <p className={s.textMuted}>📍 {event.location || 'Не указано'}</p>
          </div>
          <button onClick={() => { playClick(); fetchEventData(true); }} disabled={refreshing}
            className={`p-3 rounded-full border transition-all ${s.card} ${refreshing ? 'opacity-50' : 'hover:scale-105 active:scale-95'}`}>
            {refreshing ? '⏳' : '🔄'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className={`p-4 rounded-2xl text-center border ${s.card}`}>
            <div className="text-3xl font-bold text-green-500">{goingCount}</div>
            <div className={`text-xs uppercase tracking-wider ${s.textMuted}`}>Придут</div>
          </div>
          <div className={`p-4 rounded-2xl text-center border ${s.card}`}>
            <div className="text-3xl font-bold text-yellow-500">{maybeCount}</div>
            <div className={`text-xs uppercase tracking-wider ${s.textMuted}`}>Не уверены</div>
          </div>
          <div className={`p-4 rounded-2xl text-center border ${s.card}`}>
            <div className="text-3xl font-bold text-red-500">{notGoingCount}</div>
            <div className={`text-xs uppercase tracking-wider ${s.textMuted}`}>Не придут</div>
          </div>
        </div>

        <button onClick={generateInvite} disabled={generating} className={`w-full py-4 mb-8 font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${s.btnPrimary}`}>
          {generating ? 'Создаем...' : '+ Создать новую ссылку'}
        </button>

        <h3 className="text-xl font-semibold mb-4">Ваши приглашения ({invites.length}):</h3>
        <div className="flex flex-col gap-3">
          {invites.map((invite: any, index: number) => {
            // Берем имя из localStorage или ставим "Гость #..."
            const displayName = localNames[invite.id] || `Гость #${index + 1}`;
            
            return (
              <div key={invite.id} className={`flex items-center justify-between p-4 border transition-all ${s.card}`}>
                <div className="flex items-center gap-2">
                  <strong className="text-lg">{displayName}</strong> 
                  {/* Кнопка редактирования имени */}
                  <button onClick={() => renameGuest(invite.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-1" title="Переименовать">
                    ✏️
                  </button>
                  <span className="ml-2">{invite.status === 'going' ? '✅' : invite.status === 'maybe' ? '🤔' : invite.status === 'not_going' ? '❌' : '⏳'}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => copyLink(invite.inviteToken)} className={`px-3 py-2 font-medium transition-all active:scale-95 ${s.btnSecondary}`}>📋</button>
                  <button onClick={() => shareInvite(invite.inviteToken)} className={`px-3 py-2 font-medium transition-all active:scale-95 ${s.btnSecondary}`}>↗</button>
                  <button onClick={() => deleteInvite(invite.id)} className="px-3 py-2 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500/40 transition-all active:scale-95 font-medium">✕</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { playClick } from '../../utils/sound';
import { useTheme } from '../../context/ThemeContext';
import PreviewCard from '../../components/PreviewCard'; // 👈 Импорт перетаскивания

const FONT_OPTIONS = [
  { name: 'Montserrat', var: 'var(--font-montserrat)' },
  { name: 'Playfair Display', var: 'var(--font-playfair)' },
  { name: 'Great Vibes', var: 'var(--font-great-vibes)' },
  { name: 'Caveat', var: 'var(--font-caveat)' },
  { name: 'Oswald', var: 'var(--font-oswald)' },
  { name: 'Literata', var: 'var(--font-literata)' },
  { name: 'Poiret One', var: 'var(--font-poiret)' }
];

export default function EventDashboard() {
  const { eventId } = useParams();
  const { theme } = useTheme();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const isEditingRef = useRef(isEditing);

  useEffect(() => {
    isEditingRef.current = isEditing;
  }, [isEditing]);

  // 👇 Теперь в форме есть textX и textY
  const [editForm, setEditForm] = useState({ 
    title: '', dateTime: '', location: '', description: '', 
    coverImage: '', textColor: '#ffffff', fontFamily: 'Great Vibes',
    textX: 50, textY: 50
  });
  
  const [localNames, setLocalNames] = useState<Record<string, string>>({});

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
      if (res.ok) {
        const json = await res.json();
        setData(json);
        
        if (!isEditingRef.current) {
          setEditForm({
            title: json.event.title,
            dateTime: new Date(json.event.dateTime).toISOString().slice(0, 16),
            location: json.event.location || '',
            description: json.event.description || '',
            coverImage: json.event.coverImage || '/covers/cover1.jpg',
            textColor: json.event.textColor || '#ffffff',
            fontFamily: json.event.fontFamily || 'Great Vibes',
            textX: json.event.textX ?? 50, // 👈 Загружаем координаты из БД
            textY: json.event.textY ?? 50
          });
        }
      }
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

  const saveChanges = async () => {
    playClick();
    const adminToken = localStorage.getItem(`admin_token_${eventId}`);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken as string },
        body: JSON.stringify(editForm) 
      });
      if (res.ok) { 
        setIsEditing(false); 
        await fetchEventData(true); 
      } 
      else alert('Ошибка при сохранении');
    } catch (e) { alert('Ошибка сети'); }
  };

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

  const renameGuest = (inviteId: string) => {
    playClick();
    const currentName = localNames[inviteId] || '';
    const newName = prompt('Введите имя гостя:', currentName);
    if (newName !== null) {
      const updatedNames = { ...localNames, [inviteId]: newName.trim() };
      setLocalNames(updatedNames);
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
    classic: { bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white", card: "bg-white/5 border-white/10", btnPrimary: "bg-white text-black", btnSecondary: "bg-white/10 hover:bg-white/20 border-white/10", textMuted: "text-gray-400", input: "bg-black/20 border-white/10 text-white" },
    light: { bg: "bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900", card: "bg-white/80 border-white shadow-sm", btnPrimary: "bg-blue-600 text-white", btnSecondary: "bg-gray-200 hover:bg-gray-300 border-gray-300", textMuted: "text-gray-500", input: "bg-gray-100 border-gray-300 text-gray-900" },
    kids: { bg: "bg-gradient-to-br from-yellow-200 via-pink-200 to-indigo-200 text-indigo-900", card: "bg-white/60 border-2 border-white rounded-3xl shadow-sm", btnPrimary: "bg-indigo-500 text-white rounded-full", btnSecondary: "bg-white/50 hover:bg-white/80 border-white/50 rounded-full", textMuted: "text-indigo-700", input: "bg-white/50 border-indigo-200 text-indigo-900" }
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
          <div className="w-full mr-4">
            {isEditing ? (
              <div className="flex flex-col gap-3">
                <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} 
                  className={`text-3xl font-bold w-full border rounded-xl px-3 py-2 focus:outline-none ${s.input}`} />
                
                <div className="w-full overflow-hidden">
                  <input type="datetime-local" value={editForm.dateTime} onChange={e => setEditForm({...editForm, dateTime: e.target.value})} 
                    className={`w-[100%] max-w-[100%] min-w-0 box-border appearance-none border rounded-xl px-3 py-2 focus:outline-none ${s.input}`} />
                </div>
                
                <input type="text" value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} 
                  className={`w-full border rounded-xl px-3 py-2 focus:outline-none ${s.input}`} placeholder="Место" />
                
                <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} 
                  className={`w-full border rounded-xl px-3 py-2 focus:outline-none ${s.input}`} placeholder="Описание (дресс-код, тема и т.д.)" rows={2} />

                {/* 👇 ЖИВОЙ ПРЕДПРОСМОТР С ПЕРЕТАСКИВАНИЕМ ПРИ РЕДАКТИРОВАНИИ 👇 */}
                <PreviewCard 
                  title={editForm.title}
                  dateTime={editForm.dateTime}
                  location={editForm.location}
                  description={editForm.description}
                  coverImage={editForm.coverImage}
                  textColor={editForm.textColor}
                  fontFamily={editForm.fontFamily}
                  textX={editForm.textX}
                  textY={editForm.textY}
                  onPositionChange={(x: number, y: number) => setEditForm({ ...editForm, textX: x, textY: y })}
                />

                <div className="bg-black/5 p-4 rounded-xl border border-black/10 mt-2">
                  <label className="text-sm opacity-70 mb-3 block">Выберите обложку</label>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {[1, 2, 3, 4].map(num => {
                      const url = `/covers/cover${num}.jpg`;
                      return (
                        <img key={num} src={url} alt={`Cover ${num}`} onClick={() => { playClick(); setEditForm({...editForm, coverImage: url}); }}
                          className={`w-16 h-16 object-cover rounded-xl cursor-pointer border-2 transition-all flex-shrink-0 ${editForm.coverImage === url ? 'border-indigo-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`} />
                      );
                    })}
                  </div>
                </div>

                <div className="bg-black/5 p-4 rounded-xl border border-black/10">
                  <label className="text-sm opacity-70 mb-4 block">Настройки текста</label>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <input type="color" value={editForm.textColor} onChange={(e) => setEditForm({...editForm, textColor: e.target.value})}
                        className="w-12 h-12 rounded-full cursor-pointer border-0 bg-transparent p-0 shadow-sm" title="Цвет текста" />
                      <span className="text-xs opacity-60">Цвет</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <select value={editForm.fontFamily} onChange={(e) => { playClick(); setEditForm({ ...editForm, fontFamily: e.target.value }); }}
                        className={`w-full max-w-[130px] p-3 rounded-xl border text-sm focus:outline-none truncate ${s.input}`}
                        style={{ fontFamily: FONT_OPTIONS.find(f => f.name === editForm.fontFamily)?.var }}>
                        {FONT_OPTIONS.map(font => (
                          <option key={font.name} value={font.name} style={{ fontFamily: font.var }}>{font.name}</option>
                        ))}
                      </select>
                      <span className="text-xs opacity-60">Шрифт</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <button onClick={saveChanges} className={`px-6 py-2 font-semibold rounded-xl ${s.btnPrimary}`}>Сохранить</button>
                  <button onClick={() => { playClick(); setIsEditing(false); fetchEventData(true); }} className={`px-6 py-2 font-semibold rounded-xl border ${s.btnSecondary}`}>Отмена</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold tracking-tight">{event.title}</h1>
                  <button onClick={() => { playClick(); setIsEditing(true); }} 
                    className={`p-2 text-lg leading-none rounded-full border transition-all shadow-sm active:scale-95 ${s.btnSecondary}`}>
                    ✏️
                  </button>
                </div>
                <p className={s.textMuted}>📅 {new Date(event.dateTime).toLocaleString('ru-RU')}</p>
                <p className={s.textMuted}>📍 {event.location || 'Не указано'}</p>
                {event.description && <p className={`mt-2 text-sm opacity-80 ${s.textMuted}`}>{event.description}</p>}
              </>
            )}
          </div>

          {!isEditing && (
            <button onClick={() => { playClick(); fetchEventData(true); }} disabled={refreshing}
              className={`p-3 rounded-full border transition-all ${s.card} ${refreshing ? 'opacity-50' : 'hover:scale-105 active:scale-95'}`}>
              {refreshing ? '⏳' : '🔄'}
            </button>
          )}
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
            const displayName = localNames[invite.id] || `Гость #${index + 1}`;
            return (
              <div key={invite.id} className={`flex items-center justify-between p-4 border transition-all ${s.card}`}>
                <div className="flex items-center gap-2">
                  <strong className="text-lg">{displayName}</strong> 
                  <button onClick={() => renameGuest(invite.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-1" title="Переименовать">✏️</button>
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
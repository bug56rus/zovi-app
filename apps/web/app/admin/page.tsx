'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { playClick } from '../utils/sound';
import { useTheme } from '../context/ThemeContext';
import PreviewCard from '../components/PreviewCard';
import CoverPicker from '../components/CoverPicker';

const MAX_EVENTS = 5;

const FONT_OPTIONS = [
  { name: 'Montserrat', var: 'var(--font-montserrat)' },
  { name: 'Playfair Display', var: 'var(--font-playfair)' },
  { name: 'Great Vibes', var: 'var(--font-great-vibes)' },
  { name: 'Caveat', var: 'var(--font-caveat)' },
  { name: 'Oswald', var: 'var(--font-oswald)' },
  { name: 'Literata', var: 'var(--font-literata)' },
  { name: 'Poiret One', var: 'var(--font-poiret)' }
];

export default function CreateEventPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  
  const [savedEvents, setSavedEvents] = useState<any[]>([]);

  const [form, setForm] = useState({ 
    title: '', dateTime: '', location: '', description: '',
    coverImage: '/covers/party/Party-001.jpg',
    textColor: '#000000',
    fontFamily: 'Great Vibes',
    textX: 50,
    textY: 50
  });

  useEffect(() => {
    const saved = localStorage.getItem('saved_events');
    if (saved) {
      try { setSavedEvents(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const deleteSavedEvent = (eventId: string) => {
    if (!confirm('Удалить событие из списка? Вы потеряете быстрый доступ к управлению.')) return;
    playClick();
    const updatedEvents = savedEvents.filter(ev => ev.id !== eventId);
    setSavedEvents(updatedEvents);
    localStorage.setItem('saved_events', JSON.stringify(updatedEvents));
    localStorage.removeItem(`admin_token_${eventId}`);
    localStorage.removeItem(`guest_names_${eventId}`);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();

    if (savedEvents.length >= MAX_EVENTS) {
      alert(`Достигнут лимит — ${MAX_EVENTS} событий. Удалите одно из старых, чтобы сохранить новое.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, templateId: theme })
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(`admin_token_${data.event.id}`, data.adminToken);
        
        const newEventInfo = { id: data.event.id, title: data.event.title, dateTime: data.event.dateTime, adminToken: data.adminToken };
        const updatedEvents = [...savedEvents, newEventInfo];
        setSavedEvents(updatedEvents);
        localStorage.setItem('saved_events', JSON.stringify(updatedEvents));
        
        router.push(`/admin/${data.event.id}`);
      } else alert('Ошибка при создании');
    } catch (error) { alert('Ошибка сети'); }
    setLoading(false);
  };

  const styles = {
    classic: { bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white", card: "bg-white/5 border-white/10", input: "bg-black/20 border-white/10 text-white placeholder-gray-500", btn: "bg-white text-black", divider: "border-white/10" },
    light: { bg: "bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900", card: "bg-white/70 border-white shadow-xl", input: "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400", btn: "bg-blue-600 text-white", divider: "border-gray-200" },
    kids: { bg: "bg-gradient-to-br from-yellow-200 via-pink-200 to-indigo-200 text-indigo-900", card: "bg-white/60 border-4 border-white shadow-xl rounded-[2.5rem]", input: "bg-white/50 border-indigo-200 text-indigo-900 placeholder-indigo-300", btn: "bg-indigo-500 text-white rounded-full", divider: "border-indigo-200/50" }
  };
  const s = styles[theme as keyof typeof styles] || styles.kids;

  const isLimitReached = savedEvents.length >= MAX_EVENTS;

  return (
    <main className={`min-h-screen p-6 flex items-center justify-center font-sans transition-colors duration-500 ${s.bg}`}>
      <div className={`w-full max-w-md backdrop-blur-xl border rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-500 ${s.card}`}>
        
        {/* БЛОК МОИХ СОБЫТИЙ (СТИЛЬ СПИСКА) */}
        {savedEvents.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
              <span>Мои события</span>
              <span className="text-sm font-normal opacity-50 bg-black/5 px-2 py-1 rounded-lg">{savedEvents.length} / {MAX_EVENTS}</span>
            </h2>

            {isLimitReached && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl mb-4 text-xs font-medium text-red-500 text-center">
                ⚠️ Лимит исчерпан. Удалите событие, чтобы создать новое.
              </div>
            )}

            {/* СПИСОК */}
            <div className={`flex flex-col border rounded-2xl overflow-hidden ${s.divider}`}>
              {savedEvents.map((ev, i) => (
                <div key={ev.id} className={`flex justify-between items-center p-4 ${i !== savedEvents.length - 1 ? 'border-b' : ''} ${s.divider} hover:bg-black/5 transition-colors`}>
                  
                  <Link href={`/admin/${ev.id}`} className="flex-1 min-w-0 mr-3 group">
                    <h3 className="font-bold text-base leading-tight truncate group-hover:text-indigo-500 transition-colors">{ev.title}</h3>
                    <p className="text-xs opacity-60 mt-1 truncate">
                      {new Date(ev.dateTime).toLocaleString('ru-RU')}
                    </p>
                  </Link>

                  <div className="flex gap-2 flex-shrink-0">
                    <Link 
                      href={`/admin/${ev.id}`} 
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${s.btn}`}
                    >
                      Открыть
                    </Link>
                    <button
                      onClick={() => deleteSavedEvent(ev.id)}
                      className="px-2 py-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all active:scale-95 text-xs"
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`flex items-center gap-4 my-8 opacity-30`}>
              <hr className={`flex-1 border-current ${s.divider}`} />
              <span className="text-[10px] uppercase tracking-widest font-bold">или создать новое</span>
              <hr className={`flex-1 border-current ${s.divider}`} />
            </div>
          </div>
        )}

        {/* ФОРМА СОЗДАНИЯ */}
        <h1 className="text-3xl font-bold mb-6 tracking-tight">
          {savedEvents.length > 0 ? 'Новое событие' : 'Создать событие'}
        </h1>
        
        <form onSubmit={handleCreate} className="flex flex-col gap-5">
          <div>
            <label className="text-sm opacity-70">Название</label>
            <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={`w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${s.input}`} placeholder="День рождения" />
          </div>
          
          <div>
            <label className="text-sm opacity-70">Дата и время</label>
            <div className="w-full overflow-hidden mt-2">
              <input required type="datetime-local" value={form.dateTime} onChange={e => setForm({...form, dateTime: e.target.value})} className={`w-[100%] max-w-[100%] min-w-0 box-border appearance-none border rounded-xl px-4 py-3 focus:outline-none transition-colors ${s.input}`} />
            </div>
          </div>

          <div>
            <label className="text-sm opacity-70">Место (опционально)</label>
            <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className={`w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${s.input}`} placeholder="Кафе" />
          </div>

          <div>
            <label className="text-sm opacity-70">Описание (дресс-код, тема и т.д.)</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={`w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${s.input}`} placeholder="Например: Дресс-код — все в белом." rows={3} />
          </div>

          <PreviewCard 
            title={form.title} dateTime={form.dateTime} location={form.location} description={form.description}
            coverImage={form.coverImage} textColor={form.textColor} fontFamily={form.fontFamily}
            textX={form.textX} textY={form.textY}
            onPositionChange={(x: number, y: number) => setForm({ ...form, textX: x, textY: y })}
          />

          <CoverPicker value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} />

          <div className="bg-black/5 p-4 rounded-xl border border-black/10">
            <label className="text-sm opacity-70 mb-4 block">Настройки текста</label>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-center gap-2 flex-1">
                <input type="color" value={form.textColor} onChange={(e) => setForm({...form, textColor: e.target.value})} className="w-12 h-12 rounded-full cursor-pointer border-0 bg-transparent p-0 shadow-sm" title="Цвет текста" />
                <span className="text-xs opacity-60">Цвет</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <select value={form.fontFamily} onChange={(e) => { playClick(); setForm({ ...form, fontFamily: e.target.value }); }}
                  className={`w-full max-w-[130px] p-3 rounded-xl border text-sm focus:outline-none truncate ${s.input}`}
                  style={{ fontFamily: FONT_OPTIONS.find(f => f.name === form.fontFamily)?.var }}>
                  {FONT_OPTIONS.map(font => (<option key={font.name} value={font.name} style={{ fontFamily: font.var }}>{font.name}</option>))}
                </select>
                <span className="text-xs opacity-60">Шрифт</span>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading || isLimitReached} className={`mt-2 w-full py-4 font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg ${isLimitReached ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : s.btn}`}>
            {loading ? 'Создаем...' : (isLimitReached ? '⚠️ Лимит событий' : 'Создать и перейти к гостям')}
          </button>
        </form>
      </div>
    </main>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { playClick } from '../utils/sound'; // 👈 ОДНА ТОЧКА
import { useTheme } from '../context/ThemeContext'; // 👈 ОДНА ТОЧКА
import PreviewCard from '../components/PreviewCard'; // 👈 ОДНА ТОЧКА
import CoverPicker from '../components/CoverPicker'; // 👈 ОДНА ТОЧКА

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
    coverImage: '/covers/business/Business-001.jpg',
    textColor: '#ffffff',
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
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
        
        const newEventInfo = {
          id: data.event.id,
          title: data.event.title,
          dateTime: data.event.dateTime,
          adminToken: data.adminToken
        };
        const updatedEvents = [...savedEvents, newEventInfo];
        setSavedEvents(updatedEvents);
        localStorage.setItem('saved_events', JSON.stringify(updatedEvents));
        
        router.push(`/admin/${data.event.id}`);
      } else alert('Ошибка при создании');
    } catch (error) { alert('Ошибка сети'); }
    setLoading(false);
  };

  const styles = {
    classic: { bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white", card: "bg-white/10 border-white/20", input: "bg-black/20 border-white/10 text-white placeholder-gray-500", btn: "bg-white text-black" },
    light: { bg: "bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900", card: "bg-white/70 border-white shadow-xl", input: "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400", btn: "bg-blue-600 text-white" },
    kids: { bg: "bg-gradient-to-br from-yellow-200 via-pink-200 to-indigo-200 text-indigo-900", card: "bg-white/60 border-4 border-white shadow-xl rounded-[2.5rem]", input: "bg-white/50 border-indigo-200 text-indigo-900 placeholder-indigo-300", btn: "bg-indigo-500 text-white rounded-full" }
  };
  const s = styles[theme as keyof typeof styles] || styles.kids;

  return (
    <main className={`min-h-screen p-6 flex items-center justify-center font-sans transition-colors duration-500 ${s.bg}`}>
      <div className={`w-full max-w-md backdrop-blur-xl border rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-500 ${s.card}`}>
        
        {savedEvents.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Мои события</h2>
            <div className="flex flex-col gap-3">
              {savedEvents.map(ev => (
                <div key={ev.id} className={`p-4 rounded-xl border flex justify-between items-center ${s.card}`}>
                  <div className="flex-1 mr-2">
                    <h3 className="font-bold text-lg leading-tight truncate">{ev.title}</h3>
                    <p className="text-xs opacity-70 mt-1">📅 {new Date(ev.dateTime).toLocaleString('ru-RU')}</p>
                  </div>
                  <Link 
                    href={`/admin/${ev.id}`} 
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${s.btn}`}
                  >
                    Управлять
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-4 my-8 opacity-20">
              <hr className="flex-1 border-current" />
              <span className="text-xs uppercase tracking-widest">или</span>
              <hr className="flex-1 border-current" />
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-6 tracking-tight">
          {savedEvents.length > 0 ? 'Создать новое' : 'Создать событие'}
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
            <textarea 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              className={`w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${s.input}`} 
              placeholder="Например: Дресс-код — все в белом." 
              rows={3}
            />
          </div>

          <PreviewCard 
            title={form.title}
            dateTime={form.dateTime}
            location={form.location}
            description={form.description}
            coverImage={form.coverImage}
            textColor={form.textColor}
            fontFamily={form.fontFamily}
            textX={form.textX}
            textY={form.textY}
            onPositionChange={(x: number, y: number) => setForm({ ...form, textX: x, textY: y })}
          />

          <CoverPicker 
            value={form.coverImage} 
            onChange={(url) => setForm({ ...form, coverImage: url })} 
          />

          <div className="bg-black/5 p-4 rounded-xl border border-black/10">
            <label className="text-sm opacity-70 mb-4 block">Настройки текста</label>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-center gap-2 flex-1">
                <input type="color" value={form.textColor} onChange={(e) => setForm({...form, textColor: e.target.value})}
                  className="w-12 h-12 rounded-full cursor-pointer border-0 bg-transparent p-0 shadow-sm" title="Цвет текста" />
                <span className="text-xs opacity-60">Цвет</span>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <select value={form.fontFamily} onChange={(e) => { playClick(); setForm({ ...form, fontFamily: e.target.value }); }}
                  className={`w-full max-w-[130px] p-3 rounded-xl border text-sm focus:outline-none truncate ${s.input}`}
                  style={{ fontFamily: FONT_OPTIONS.find(f => f.name === form.fontFamily)?.var }}>
                  {FONT_OPTIONS.map(font => (
                    <option key={font.name} value={font.name} style={{ fontFamily: font.var }}>{font.name}</option>
                  ))}
                </select>
                <span className="text-xs opacity-60">Шрифт</span>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className={`mt-2 w-full py-4 font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg ${s.btn}`}>
            {loading ? 'Создаем...' : 'Создать и перейти к гостям'}
          </button>
        </form>
      </div>
    </main>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { playClick } from '../utils/sound';
import { useTheme } from '../context/ThemeContext';
import PositionPicker from '../components/PositionPicker';
import PreviewCard from '../components/PreviewCard'; // 👈 ИМПОРТ

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
  
  const [form, setForm] = useState({ 
    title: '', dateTime: '', location: '', description: '',
    coverImage: '/covers/cover1.jpg',
    coverPosition: 'center',
    textColor: '#ffffff',
    fontFamily: 'Montserrat'
  });

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
        <h1 className="text-3xl font-bold mb-6 tracking-tight">Создать событие</h1>
        
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

          {/* 👇 ЖИВОЙ ПРЕДПРОСМОТР 👇 */}
          <PreviewCard 
            title={form.title}
            dateTime={form.dateTime}
            location={form.location}
            description={form.description}
            coverImage={form.coverImage}
            coverPosition={form.coverPosition}
            textColor={form.textColor}
            fontFamily={form.fontFamily}
          />

          <div className="bg-black/5 p-4 rounded-xl border border-black/10">
            <label className="text-sm opacity-70 mb-3 block">Выберите обложку</label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[1, 2, 3, 4].map(num => {
                const url = `/covers/cover${num}.jpg`;
                return (
                  <img key={num} src={url} alt={`Cover ${num}`} onClick={() => { playClick(); setForm({...form, coverImage: url}); }}
                    className={`w-16 h-16 object-cover rounded-xl cursor-pointer border-2 transition-all flex-shrink-0 ${form.coverImage === url ? 'border-indigo-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`} />
                );
              })}
            </div>
          </div>

          <div className="bg-black/5 p-4 rounded-xl border border-black/10">
            <label className="text-sm opacity-70 mb-4 block">Настройки текста</label>
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col items-center flex-1">
                <PositionPicker value={form.coverPosition} onChange={(pos) => setForm({...form, coverPosition: pos})} />
              </div>

              <div className="flex flex-col items-center gap-2 flex-1 mt-2">
                <input type="color" value={form.textColor} onChange={(e) => setForm({...form, textColor: e.target.value})}
                  className="w-12 h-12 rounded-full cursor-pointer border-0 bg-transparent p-0 shadow-sm" title="Цвет текста" />
                <span className="text-xs opacity-60">Цвет</span>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1 mt-2">
                <select value={form.fontFamily} onChange={(e) => { playClick(); setForm({ ...form, fontFamily: e.target.value }); }}
                  className={`w-full max-w-[110px] p-3 rounded-xl border text-sm focus:outline-none truncate ${s.input}`}
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
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { playClick } from '../utils/sound';

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    title: '', 
    dateTime: '', 
    location: '', 
    description: '',
    templateId: 'classic' // По умолчанию тёмная тема
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(`admin_token_${data.event.id}`, data.adminToken);
        router.push(`/admin/${data.event.id}`);
      } else {
        alert('Ошибка при создании события');
      }
    } catch (error) {
      alert('Ошибка сети');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 flex items-center justify-center font-sans">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 tracking-tight">Создать событие</h1>
        
        <form onSubmit={handleCreate} className="flex flex-col gap-5">
          <div>
            <label className="text-sm text-gray-300">Название</label>
            <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} 
              className="w-full mt-2 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors" placeholder="День рождения Маши" />
          </div>
          
          <div>
            <label className="text-sm text-gray-300">Дата и время</label>
            <input required type="datetime-local" value={form.dateTime} onChange={e => setForm({...form, dateTime: e.target.value})} 
              className="w-full mt-2 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors [color-scheme:dark]" />
          </div>

          <div>
            <label className="text-sm text-gray-300">Место (опционально)</label>
            <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} 
              className="w-full mt-2 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors" placeholder="Кафе Лето" />
          </div>

          {/* ВЫБОР ТЕМЫ */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Стиль приглашения</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => { playClick(); setForm({...form, templateId: 'classic'}); }}
                className={`flex-1 py-2 rounded-xl text-sm border transition-all ${form.templateId === 'classic' ? 'bg-white/30 border-white' : 'bg-black/20 border-white/10 text-gray-400'}`}>
                🌙 Тёмная
              </button>
              <button type="button" onClick={() => { playClick(); setForm({...form, templateId: 'light'}); }}
                className={`flex-1 py-2 rounded-xl text-sm border transition-all ${form.templateId === 'light' ? 'bg-white/30 border-white' : 'bg-black/20 border-white/10 text-gray-400'}`}>
                ☀️ Светлая
              </button>
              <button type="button" onClick={() => { playClick(); setForm({...form, templateId: 'kids'}); }}
                className={`flex-1 py-2 rounded-xl text-sm border transition-all ${form.templateId === 'kids' ? 'bg-white/30 border-white' : 'bg-black/20 border-white/10 text-gray-400'}`}>
                🎈 Детская
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} 
            className="mt-4 w-full py-4 bg-white text-black font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            {loading ? 'Создаем...' : 'Создать и перейти к гостям'}
          </button>
        </form>
      </div>
    </main>
  );
}
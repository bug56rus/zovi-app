'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { playClick } from '../utils/sound'; // Импортируем звук

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', dateTime: '', location: '', description: '' });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick(); // Звук!
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
        <h1 className="text-3xl font-bold mb-8 tracking-tight">Создать событие</h1>
        
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

          <button type="submit" disabled={loading} 
            className="mt-6 w-full py-4 bg-white text-black font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            {loading ? 'Создаем...' : 'Создать и перейти к гостям'}
          </button>
        </form>
      </div>
    </main>
  );
}
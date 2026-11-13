'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { playClick } from '../utils/sound';
import { useTheme } from '../context/ThemeContext';

export default function CreateEventPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', dateTime: '', location: '', description: '' });

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

  // Цвета фона и свечения для разных тем
  let bgClass = "bg-[#fef08a] text-indigo-900"; 
  let glowBg = 'radial-gradient(circle at 10% 20%, rgba(236, 72, 153, 0.6) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.6) 0%, transparent 50%)';
  let cardClass = "bg-white/60 border-4 border-white shadow-xl rounded-[2.5rem]";
  let inputClass = "bg-white/50 border-indigo-200 text-indigo-900 placeholder-indigo-300 focus:border-indigo-400";
  let btnClass = "bg-indigo-500 text-white rounded-full";

  if (theme === 'classic') {
    bgClass = "bg-[#0a0a0a] text-white";
    glowBg = 'radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)';
    cardClass = "bg-white/10 border-white/20 backdrop-blur-xl rounded-3xl";
    inputClass = "bg-black/20 border-white/10 text-white placeholder-gray-500 focus:border-white/40";
    btnClass = "bg-white text-black rounded-xl";
  } else if (theme === 'light') {
    bgClass = "bg-[#f3f4f6] text-gray-900";
    glowBg = 'radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)';
    cardClass = "bg-white/80 border-white shadow-xl rounded-3xl";
    inputClass = "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-400";
    btnClass = "bg-blue-600 text-white rounded-xl";
  }

  return (
    <main 
      className={`min-h-screen p-6 flex items-center justify-center font-sans transition-colors duration-500 relative overflow-hidden ${bgClass}`}
      style={{ backgroundImage: glowBg }}
    >
      <div className={`w-full max-w-md border p-8 shadow-2xl transition-all duration-500 relative z-10 ${cardClass}`}>
        <h1 className="text-3xl font-bold mb-6 tracking-tight">Создать событие</h1>
        
        <form onSubmit={handleCreate} className="flex flex-col gap-5">
          <div>
            <label className="text-sm opacity-70">Название</label>
            <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} 
              className={`w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${inputClass}`} 
              placeholder="День рождения" />
          </div>
          
          <div>
            <label className="text-sm opacity-70">Дата и время</label>
            <input required type="datetime-local" value={form.dateTime} onChange={e => setForm({...form, dateTime: e.target.value})} 
              className={`w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${inputClass}`} />
          </div>

          <div>
            <label className="text-sm opacity-70">Место (опционально)</label>
            <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} 
              className={`w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${inputClass}`} 
              placeholder="Кафе" />
          </div>

          <button type="submit" disabled={loading} 
            className={`mt-4 w-full py-4 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg ${btnClass}`}>
            {loading ? 'Создаем...' : 'Создать и перейти к гостям'}
          </button>
        </form>
      </div>
    </main>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { playClick } from '../utils/sound';
import { useTheme } from '../context/ThemeContext';

export default function CreateEventPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', dateTime: '', location: '', description: '', templateId: 'classic' });

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
      } else alert('Ошибка при создании');
    } catch (error) { alert('Ошибка сети'); }
    setLoading(false);
  };

  // Стили для страницы создания
  const styles = {
    classic: { bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white", card: "bg-white/10 border-white/20", input: "bg-black/20 border-white/10 text-white placeholder-gray-500", btn: "bg-white text-black" },
    light: { bg: "bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900", card: "bg-white/70 border-white shadow-xl", input: "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400", btn: "bg-blue-600 text-white" },
    kids: { bg: "bg-gradient-to-br from-yellow-200 via-pink-200 to-indigo-200 text-indigo-900", card: "bg-white/60 border-4 border-white shadow-xl rounded-[2.5rem]", input: "bg-white/50 border-indigo-200 text-indigo-900 placeholder-indigo-300", btn: "bg-indigo-500 text-white rounded-full" }
  };

  const s = styles[theme] || styles.classic;

  return (
    <main className={`min-h-screen p-6 flex items-center justify-center font-sans transition-colors duration-500 ${s.bg}`}>
      <div className={`w-full max-w-md backdrop-blur-xl border rounded-3xl p-8 shadow-2xl transition-all duration-500 ${s.card}`}>
        <h1 className="text-3xl font-bold mb-6 tracking-tight">Создать событие</h1>
        
        <form onSubmit={handleCreate} className="flex flex-col gap-5">
          <div>
            <label className="text-sm opacity-70">Название</label>
            <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={`w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${s.input}`} placeholder="День рождения" />
          </div>
          <div>
            <label className="text-sm opacity-70">Дата и время</label>
            <input required type="datetime-local" value={form.dateTime} onChange={e => setForm({...form, dateTime: e.target.value})} className={`w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${s.input}`} />
          </div>
          <div>
            <label className="text-sm opacity-70">Место (опционально)</label>
            <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className={`w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${s.input}`} placeholder="Кафе" />
          </div>

          <button type="submit" disabled={loading} className={`mt-4 w-full py-4 font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg ${s.btn}`}>
            {loading ? 'Создаем...' : 'Создать'}
          </button>
        </form>
      </div>
    </main>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', dateTime: '', location: '', description: '' });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <main style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 500, margin: '0 auto' }}>
      <h1>Создать мероприятие</h1>
      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <div>
          <label>Название события</label>
          <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} 
            style={{ width: '100%', padding: 10, marginTop: 5, borderRadius: 8, border: '1px solid #ccc' }} placeholder="День рождения Маши" />
        </div>
        
        <div>
          <label>Дата и время</label>
          <input required type="datetime-local" value={form.dateTime} onChange={e => setForm({...form, dateTime: e.target.value})} 
            style={{ width: '100%', padding: 10, marginTop: 5, borderRadius: 8, border: '1px solid #ccc' }} />
        </div>

        <div>
          <label>Место (опционально)</label>
          <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} 
            style={{ width: '100%', padding: 10, marginTop: 5, borderRadius: 8, border: '1px solid #ccc' }} placeholder="Кафе Лето" />
        </div>

        <button type="submit" disabled={loading} 
          style={{ padding: 15, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', marginTop: 10 }}>
          {loading ? 'Создаем...' : 'Создать и перейти к гостям'}
        </button>
      </form>
    </main>
  );
}
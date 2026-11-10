'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EventDashboard() {
  const { eventId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  // Загружаем данные события и список инвайтов
  const fetchEventData = async () => {
    const adminToken = localStorage.getItem(`admin_token_${eventId}`);
    if (!adminToken) {
      setError('У вас нет доступа к этому событию (потерян ключ администратора)');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:3000/events/${eventId}`, {
        headers: { 'X-Admin-Token': adminToken }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setError('Не удалось загрузить данные (возможно, неверный ключ)');
      }
    } catch (e) {
      setError('Ошибка сети');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  // Генерация новой ссылки
  const generateInvite = async () => {
    setGenerating(true);
    const adminToken = localStorage.getItem(`admin_token_${eventId}`);
    try {
      const res = await fetch(`http://127.0.0.1:3000/events/${eventId}/invites`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken as string
        },
        body: JSON.stringify({ count: 1 })
      });
      if (res.ok) {
        await fetchEventData(); // Обновляем список
      }
    } catch (e) {
      alert('Ошибка при создании ссылки');
    }
    setGenerating(false);
  };

  // Системное меню "Поделиться" (Safari, iOS, Android)
  const shareInvite = async (inviteToken: string) => {
    const url = `${window.location.origin}/i/${inviteToken}`;
    const text = `Приглашаю тебя на «${data.event.title}»! Подтверди участие по ссылке:`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: data.event.title, text: text, url: url });
      } catch (err) {
        console.log('Отмена шаринга', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Ссылка скопирована в буфер обмена!');
    }
  };

  // Копирование ТОЛЬКО чистой ссылки
  const copyLink = (inviteToken: string) => {
    const url = `${window.location.origin}/i/${inviteToken}`;
    navigator.clipboard.writeText(url);
    alert('Ссылка скопирована!');
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>Загрузка...</div>;
  if (error) return <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif', color: 'red' }}>{error}</div>;
  if (!data) return null;

  const { event, invites } = data;
  const goingCount = invites.filter((i: any) => i.status === 'going').length;
  const notGoingCount = invites.filter((i: any) => i.status === 'not_going').length;
  const maybeCount = invites.filter((i: any) => i.status === 'maybe').length;

  return (
    <main style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
      
      {/* Шапка */}
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ marginBottom: 5 }}>{event.title}</h1>
        <p style={{ color: '#666', margin: 0 }}>📅 {new Date(event.dateTime).toLocaleString('ru-RU')}</p>
        <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: 14 }}>📍 {event.location || 'Место не указано'}</p>
      </div>

      {/* Статистика */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
        <div style={{ flex: 1, background: '#dcfce7', padding: 15, borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#166534' }}>{goingCount}</div>
          <div style={{ fontSize: 12, color: '#166534' }}>Придут</div>
        </div>
        <div style={{ flex: 1, background: '#fef9c3', padding: 15, borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#854d0e' }}>{maybeCount}</div>
          <div style={{ fontSize: 12, color: '#854d0e' }}>Не уверены</div>
        </div>
        <div style={{ flex: 1, background: '#fee2e2', padding: 15, borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#991b1b' }}>{notGoingCount}</div>
          <div style={{ fontSize: 12, color: '#991b1b' }}>Не придут</div>
        </div>
      </div>

      {/* Кнопка создания инвайта */}
      <button 
        onClick={generateInvite} disabled={generating}
        style={{ width: '100%', padding: 15, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', marginBottom: 30, opacity: generating ? 0.7 : 1 }}>
        {generating ? 'Создаем...' : '+ Создать новую ссылку-приглашение'}
      </button>

      {/* Список приглашений */}
      <h3>Ваши приглашения ({invites.length}):</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {invites.map((invite: any, index: number) => {
          let statusIcon = '⏳';
          if (invite.status === 'going') statusIcon = '✅';
          if (invite.status === 'maybe') statusIcon = '🤔';
          if (invite.status === 'not_going') statusIcon = '❌';

          return (
            <div key={invite.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f4f4f5', padding: 15, borderRadius: 8 }}>
              <div>
                <strong>Гость #{index + 1}</strong> 
                <span style={{ marginLeft: 10, color: '#666', fontSize: 14 }}>{statusIcon}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => copyLink(invite.inviteToken)}
                  style={{ padding: '8px 12px', background: '#e4e4e7', border: 'none', borderRadius: 20, cursor: 'pointer', fontSize: 14, fontWeight: '500' }}>
                  📋 Копировать
                </button>
                <button 
                  onClick={() => shareInvite(invite.inviteToken)}
                  style={{ padding: '8px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 20, cursor: 'pointer', fontSize: 14, fontWeight: '500' }}>
                  Поделиться ↗
                </button>
              </div>
            </div>
          );
        })}
        {invites.length === 0 && (
          <p style={{ color: '#999', textAlign: 'center' }}>У вас пока нет приглашений. Нажмите кнопку выше, чтобы создать первое.</p>
        )}
      </div>
    </main>
  );
}
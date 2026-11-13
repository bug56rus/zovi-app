'use client';

import Link from 'next/link';
import { useTheme } from './context/ThemeContext';

export default function Home() {
  const { theme } = useTheme();

  let bgColor = '#fef08a'; 
  let glow1 = '#ec4899'; // Ярко-розовый
  let glow2 = '#3b82f6'; // Ярко-синий
  let glow3 = '#a855f7'; // Ярко-фиолетовый

  if (theme === 'classic') {
    bgColor = '#0a0a0a';
    glow1 = '#7e22ce';
    glow2 = '#1d4ed8';
    glow3 = '#be185d';
  } else if (theme === 'light') {
    bgColor = '#f3f4f6';
    glow1 = '#fbcfe8'; 
    glow2 = '#bfdbfe';
    glow3 = '#e9d5ff';
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui, sans-serif',
      background: bgColor,
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.5s'
    }}>
      
      {/* ТЕСТОВОЕ СВЕЧЕНИЕ (БЕЗ ПРОЗРАЧНОСТИ, ЧТОБЫ ТОЧНО УВИДЕТЬ) */}
      <div className="blob blob-1" style={{ background: glow1, opacity: 0.7 }}></div>
      <div className="blob blob-2" style={{ background: glow2, opacity: 0.7 }}></div>
      <div className="blob blob-3" style={{ background: glow3, opacity: 0.7 }}></div>

      {/* КОНТЕНТ */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <h1 style={{
          fontSize: '72px',
          fontWeight: 'bold',
          letterSpacing: '-2px',
          marginBottom: '16px',
          color: theme === 'classic' ? 'white' : theme === 'light' ? '#111827' : '#312e81',
        }}>Зови</h1>
        
        {/* ДОБАВИЛ ТЕКСТ (V2), ЧТОБЫ ВЫ ПОНЯЛИ, ОБНОВИЛСЯ ЛИ САЙТ */}
        <p style={{
          fontSize: '20px',
          marginBottom: '48px',
          maxWidth: '400px',
          opacity: 0.8,
          color: theme === 'classic' ? '#d1d5db' : theme === 'light' ? '#374151' : '#3730a3',
        }}>Создавай события и собирай друзей. (V2)</p>
        
        <Link 
          href="/admin" 
          style={{
            display: 'inline-block',
            padding: '20px 40px',
            borderRadius: '999px',
            fontWeight: 'bold',
            fontSize: '18px',
            textDecoration: 'none',
            background: theme === 'classic' ? 'white' : theme === 'light' ? '#2563eb' : '#6366f1',
            color: theme === 'classic' ? 'black' : 'white',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}
        >
          Создать мероприятие
        </Link>
      </div>

    </main>
  );
}
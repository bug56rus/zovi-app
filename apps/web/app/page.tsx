'use client';

import Link from 'next/link';
import { useTheme } from './context/ThemeContext';

export default function Home() {
  const { theme } = useTheme();

  let bgColor = '#fef08a'; // Детская (желтая)
  let glow1 = 'rgba(236, 72, 153, 0.8)';  // Розовый
  let glow2 = 'rgba(59, 130, 246, 0.8)';  // Синий
  let glow3 = 'rgba(168, 85, 247, 0.8)';  // Фиолетовый

  if (theme === 'classic') {
    bgColor = '#0a0a0a';
    glow1 = 'rgba(168, 85, 247, 0.6)';
    glow2 = 'rgba(59, 130, 246, 0.6)';
    glow3 = 'rgba(236, 72, 153, 0.5)';
  } else if (theme === 'light') {
    bgColor = '#f3f4f6';
    glow1 = 'rgba(236, 72, 153, 0.5)';
    glow2 = 'rgba(59, 130, 246, 0.5)';
    glow3 = 'rgba(168, 85, 247, 0.5)';
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
      
      {/* ВСТРОЕННЫЙ CSS (ГАРАНТИРОВАННО РАБОТАЕТ) */}
      <style>{`
        @keyframes moveBlob1 {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(80px, -60px) scale(1.2); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes moveBlob2 {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(-100px, 80px) scale(1.3); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes moveBlob3 {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(60px, 100px) scale(0.8); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          will-change: transform;
          pointer-events: none;
        }
        .blob-1 {
          top: 5%; left: 5%;
          width: 350px; height: 350px;
          animation: moveBlob1 12s ease-in-out infinite;
        }
        .blob-2 {
          top: 25%; right: 0%;
          width: 450px; height: 450px;
          animation: moveBlob2 16s ease-in-out infinite;
        }
        .blob-3 {
          bottom: 5%; left: 20%;
          width: 400px; height: 400px;
          animation: moveBlob3 14s ease-in-out infinite;
        }
      `}</style>

      {/* СВЕЧЕНИЕ */}
      <div className="blob blob-1" style={{ background: glow1 }}></div>
      <div className="blob blob-2" style={{ background: glow2 }}></div>
      <div className="blob blob-3" style={{ background: glow3 }}></div>

      {/* КОНТЕНТ */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <h1 style={{
          fontSize: '72px',
          fontWeight: 'bold',
          letterSpacing: '-2px',
          marginBottom: '16px',
          color: theme === 'classic' ? 'white' : theme === 'light' ? '#111827' : '#312e81',
        }}>Зови</h1>
        <p style={{
          fontSize: '20px',
          marginBottom: '48px',
          maxWidth: '400px',
          opacity: 0.8,
          color: theme === 'classic' ? '#d1d5db' : theme === 'light' ? '#374151' : '#3730a3',
        }}>Создавай события и собирай друзей. Без сбора персональных данных.</p>
        
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
            transition: 'transform 0.2s',
          }}
        >
          Создать мероприятие
        </Link>
      </div>

    </main>
  );
}
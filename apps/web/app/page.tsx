'use client';

import Link from 'next/link';
import { useTheme } from './context/ThemeContext';

export default function Home() {
  const { theme } = useTheme();

  // Цвета для свечения (просто градиенты)
  let glowBg = '';
  let textColor = '#312e81';
  let btnBg = '#6366f1';

  if (theme === 'classic') {
    glowBg = 'radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.6) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.6) 0%, transparent 50%)';
    textColor = '#ffffff';
    btnBg = '#ffffff';
  } else if (theme === 'light') {
    glowBg = 'radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)';
    textColor = '#111827';
    btnBg = '#2563eb';
  } else {
    // Детская (по умолчанию)
    glowBg = 'radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.8) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.8) 0%, transparent 60%)';
    textColor = '#312e81';
    btnBg = '#6366f1';
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
      backgroundColor: theme === 'classic' ? '#0a0a0a' : theme === 'light' ? '#f3f4f6' : '#fef08a',
      backgroundImage: glowBg, // ВОТ ОНО СВЕЧЕНИЕ
      position: 'relative',
      transition: 'background 0.5s'
    }}>
      
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <h1 style={{
          fontSize: '72px',
          fontWeight: 'bold',
          letterSpacing: '-2px',
          marginBottom: '16px',
          color: textColor,
        }}>Зови</h1>
        
        {/* ЕСЛИ ВЫ ВИДИТЕ ЭТОТ ТЕКСТ, ЗНАЧИТ САЙТ ОБНОВИЛСЯ! */}
        <p style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '48px',
          color: 'red',
        }}>САЙТ ОБНОВИЛСЯ! (V3)</p>
        
        <Link 
          href="/admin" 
          style={{
            display: 'inline-block',
            padding: '20px 40px',
            borderRadius: '999px',
            fontWeight: 'bold',
            fontSize: '18px',
            textDecoration: 'none',
            background: btnBg,
            color: theme === 'classic' ? 'black' : 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}
        >
          Создать мероприятие
        </Link>
      </div>

    </main>
  );
}
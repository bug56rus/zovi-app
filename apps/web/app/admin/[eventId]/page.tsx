'use client';

import Link from 'next/link';
import { useTheme } from './context/ThemeContext';

export default function Home() {
  const { theme } = useTheme();

  // Базовые настройки для тем
  let bgColor = '#fef08a'; 
  let textColor = '#312e81';
  let subTextColor = '#4338ca';
  let cardBg = 'rgba(255, 255, 255, 0.6)';
  let cardBorder = '1px solid rgba(255, 255, 255, 0.8)';
  let btnBg = '#6366f1';
  let btnColor = '#ffffff';
  
  // Свечение (градиенты)
  let glowBg = 'radial-gradient(circle at 15% 15%, rgba(236, 72, 153, 0.5) 0%, transparent 40%), radial-gradient(circle at 85% 85%, rgba(59, 130, 246, 0.5) 0%, transparent 40%)';

  if (theme === 'classic') {
    bgColor = '#0a0a0a';
    textColor = '#ffffff';
    subTextColor = '#a1a1aa';
    cardBg = 'rgba(255, 255, 255, 0.05)';
    cardBorder = '1px solid rgba(255, 255, 255, 0.1)';
    btnBg = '#ffffff';
    btnColor = '#000000';
    glowBg = 'radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)';
  } else if (theme === 'light') {
    bgColor = '#f3f4f6';
    textColor = '#111827';
    subTextColor = '#4b5563';
    cardBg = 'rgba(255, 255, 255, 0.8)';
    cardBorder = '1px solid #e5e7eb';
    btnBg = '#2563eb';
    btnColor = '#ffffff';
    glowBg = 'radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)';
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: bgColor,
      backgroundImage: glowBg,
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.5s ease'
    }}>
      
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '800px', width: '100%' }}>
        
        {/* Главный заголовок */}
        <h1 style={{
          fontSize: 'clamp(48px, 10vw, 96px)', // Адаптивный размер шрифта
          fontWeight: '800',
          letterSpacing: '-0.04em',
          marginBottom: '16px',
          color: textColor,
          lineHeight: 1.1
        }}>Зови</h1>
        
        {/* Подзаголовок */}
        <p style={{
          fontSize: 'clamp(18px, 3vw, 24px)',
          marginBottom: '48px',
          color: subTextColor,
          maxWidth: '600px',
          margin: '0 auto 48px auto',
          lineHeight: 1.5
        }}>
          Создавай стильные приглашения за 2 минуты. Без скачивания приложений и сбора личных данных.
        </p>
        
        {/* Карточки преимуществ */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
          marginBottom: '48px'
        }}>
          <div style={{ flex: '1 1 200px', background: cardBg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: cardBorder, padding: '24px', borderRadius: '24px', textAlign: 'left' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: textColor }}>100% Анонимно</h3>
            <p style={{ fontSize: '14px', color: subTextColor, margin: 0 }}>Мы не собираем имена и телефоны ваших гостей.</p>
          </div>
          
          <div style={{ flex: '1 1 200px', background: cardBg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: cardBorder, padding: '24px', borderRadius: '24px', textAlign: 'left' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✨</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: textColor }}>Красиво</h3>
            <p style={{ fontSize: '14px', color: subTextColor, margin: 0 }}>Современный дизайн, который не стыдно отправить.</p>
          </div>
          
          <div style={{ flex: '1 1 200px', background: cardBg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: cardBorder, padding: '24px', borderRadius: '24px', textAlign: 'left' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡️</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: textColor }}>Без приложений</h3>
            <p style={{ fontSize: '14px', color: subTextColor, margin: 0 }}>Гости подтверждают участие в один клик по ссылке.</p>
          </div>
        </div>

        {/* Кнопка */}
        <Link 
          href="/admin" 
          style={{
            display: 'inline-block',
            padding: '20px 48px',
            borderRadius: '999px',
            fontWeight: 'bold',
            fontSize: '18px',
            textDecoration: 'none',
            background: btnBg,
            color: btnColor,
            boxShadow: theme === 'classic' ? '0 10px 40px rgba(255,255,255,0.2)' : '0 10px 40px rgba(99,102,241,0.3)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Создать мероприятие
        </Link>
      </div>

      {/* Футер */}
      <div style={{ position: 'absolute', bottom: '24px', zIndex: 10, fontSize: '14px', color: subTextColor, opacity: 0.6 }}>
        © {new Date().getFullYear()} Зови. Сделано с любовью.
      </div>

    </main>
  );
}
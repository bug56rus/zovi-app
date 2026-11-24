'use client';

import Link from 'next/link';
import { useTheme } from './context/ThemeContext';

export default function Home() {
  const { theme } = useTheme();

  let bgClass = "bg-[#fef08a] text-indigo-900";
  let glow1 = "bg-pink-500/40";
  let glow2 = "bg-blue-500/40";
  let glow3 = "bg-purple-500/40";
  let cardClass = "bg-white/40 border-white/50";
  let btnClass = "bg-indigo-600 text-white shadow-indigo-500/50";
  let textMuted = "text-indigo-700/80";

  if (theme === 'classic') {
    bgClass = "bg-[#0a0a0a] text-white";
    glow1 = "bg-purple-600/30";
    glow2 = "bg-blue-600/30";
    glow3 = "bg-pink-600/20";
    cardClass = "bg-white/5 border-white/10";
    btnClass = "bg-white text-black shadow-white/20";
    textMuted = "text-gray-400";
  } else if (theme === 'light') {
    bgClass = "bg-gray-50 text-gray-900";
    glow1 = "bg-blue-300/40";
    glow2 = "bg-purple-300/40";
    glow3 = "bg-pink-300/30";
    cardClass = "bg-white/60 border-white shadow-xl";
    btnClass = "bg-blue-600 text-white shadow-blue-500/30";
    textMuted = "text-gray-500";
  }

  return (
    <main className={`min-h-screen flex items-center justify-center p-6 font-sans transition-colors duration-500 relative overflow-hidden ${bgClass}`}>
      
      {/* ФОНОВОЕ СВЕЧЕНИЕ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full blur-[100px] animate-float1 ${glow1}`}></div>
        <div className={`absolute top-[30%] right-[5%] w-[400px] h-[400px] rounded-full blur-[120px] animate-float2 ${glow2}`}></div>
        <div className={`absolute bottom-[5%] left-[25%] w-[350px] h-[350px] rounded-full blur-[90px] animate-float3 ${glow3}`}></div>
      </div>

      {/* ЕДИНАЯ СТЕКЛЯННАЯ ПЛАШКА */}
      <div className={`relative z-10 w-full max-w-md backdrop-blur-2xl border rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center text-center ${cardClass}`}>
        
        <h1 
          className="text-7xl mb-2 drop-shadow-sm" 
          style={{ fontFamily: 'var(--font-great-vibes)' }}
        >
          Зови
        </h1>
        
        <p className={`text-base font-medium mb-8 max-w-[260px] ${textMuted}`}>
          Создавай стильные приглашения и собирай друзей без сбора персональных данных.
        </p>

        {/* Преимущества внутри плашки */}
        <div className="flex justify-between w-full gap-2 mb-8">
          <div className="flex flex-col items-center flex-1">
            <span className="text-2xl mb-1">🔒</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Анонимно</span>
          </div>
          <div className="flex flex-col items-center flex-1 border-x border-black/5">
            <span className="text-2xl mb-1">✨</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Красиво</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-2xl mb-1">⚡️</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Быстро</span>
          </div>
        </div>

        <Link 
          href="/admin" 
          className={`w-full py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl ${btnClass}`}
        >
          Создать мероприятие
        </Link>

      </div>
    </main>
  );
}
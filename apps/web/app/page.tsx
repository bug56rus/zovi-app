'use client';

import Link from 'next/link';
import { useTheme } from './context/ThemeContext';

export default function Home() {
  const { theme } = useTheme();

  let bgClass = "bg-[#fef08a] text-indigo-900"; // Kids
  let glow1 = "bg-pink-500/40";
  let glow2 = "bg-blue-500/40";
  let glow3 = "bg-purple-500/40";
  let btnBg = "bg-indigo-600 text-white shadow-indigo-500/50";
  let cardBg = "bg-white/40 border-white/50";

  if (theme === 'classic') {
    bgClass = "bg-[#0a0a0a] text-white";
    glow1 = "bg-purple-600/30";
    glow2 = "bg-blue-600/30";
    glow3 = "bg-pink-600/20";
    btnBg = "bg-white text-black shadow-white/20";
    cardBg = "bg-white/5 border-white/10";
  } else if (theme === 'light') {
    bgClass = "bg-gray-50 text-gray-900";
    glow1 = "bg-blue-300/40";
    glow2 = "bg-purple-300/40";
    glow3 = "bg-pink-300/30";
    btnBg = "bg-blue-600 text-white shadow-blue-500/30";
    cardBg = "bg-white/60 border-white shadow-xl";
  }

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center p-6 font-sans transition-colors duration-500 relative overflow-hidden ${bgClass}`}>
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full blur-[100px] animate-float1 ${glow1}`}></div>
        <div className={`absolute top-[30%] right-[5%] w-[400px] h-[400px] rounded-full blur-[120px] animate-float2 ${glow2}`}></div>
        <div className={`absolute bottom-[5%] left-[25%] w-[350px] h-[350px] rounded-full blur-[90px] animate-float3 ${glow3}`}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        
        <h1 
          className="text-8xl mb-2 drop-shadow-sm" 
          style={{ fontFamily: 'var(--font-great-vibes)' }}
        >
          Зови
        </h1>
        
        <p className="text-xl font-medium mb-10 opacity-80">
          Создавай стильные приглашения и собирай друзей. Без сбора персональных данных.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-10 w-full">
          
          <div className={`flex flex-col items-center p-4 rounded-2xl border backdrop-blur-md w-[30%] ${cardBg}`}>
            <span className="text-2xl mb-1">✨</span>
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Красиво</span>
          </div>
          <div className={`flex flex-col items-center p-4 rounded-2xl border backdrop-blur-md w-[30%] ${cardBg}`}>
            <span className="text-2xl mb-1">⚡️</span>
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Быстро</span>
          </div>
        </div>

        <Link 
          href="/admin" 
          className={`px-10 py-5 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl ${btnBg}`}
        >
          Создать мероприятие
        </Link>

      </div>

      <div className="absolute bottom-6 z-10 text-xs opacity-40">
        © {new Date().getFullYear()} Создавайте поводы для встреч.
      </div>

    </main>
  );
}
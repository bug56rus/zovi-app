// apps/web/app/page.tsx
'use client';

import Link from 'next/link';
import { useTheme } from './context/ThemeContext';

export default function Home() {
  const { theme } = useTheme();

  let bgClass = "bg-gradient-to-br from-yellow-200 via-pink-200 to-indigo-200 text-indigo-900"; 
  let glow1 = "bg-pink-400/40";
  let glow2 = "bg-yellow-300/40";
  let glow3 = "bg-blue-400/30";

  if (theme === 'classic') {
    bgClass = "bg-[#0a0a0a] text-white";
    glow1 = "bg-purple-600/30";
    glow2 = "bg-blue-600/30";
    glow3 = "bg-pink-600/20";
  } else if (theme === 'light') {
    bgClass = "bg-gray-50 text-gray-900";
    glow1 = "bg-blue-300/40";
    glow2 = "bg-purple-300/40";
    glow3 = "bg-pink-300/30";
  }

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center p-6 font-sans transition-colors duration-500 relative overflow-hidden ${bgClass}`}>
      
      {/* ФОНОВОЕ СВЕЧЕНИЕ (GLOW EFFECT) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[10%] left-[20%] w-[300px] h-[300px] rounded-full blur-[100px] animate-float1 ${glow1}`}></div>
        <div className={`absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full blur-[120px] animate-float2 ${glow2}`}></div>
        <div className={`absolute bottom-[10%] left-[30%] w-[350px] h-[350px] rounded-full blur-[90px] animate-float3 ${glow3}`}></div>
      </div>

      {/* КОНТЕНТ */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-7xl font-bold mb-4 tracking-tighter drop-shadow-sm">Зови</h1>
        <p className="text-xl mb-12 opacity-80 max-w-md">Создавай события и собирай друзей. Без сбора персональных данных.</p>
        
        <Link 
          href="/admin" 
          className={`px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all ${
            theme === 'classic' 
              ? 'bg-white text-black shadow-white/10' 
              : theme === 'light' 
                ? 'bg-blue-600 text-white shadow-blue-500/30' 
                : 'bg-indigo-500 text-white shadow-indigo-500/40'
          }`}
        >
          Создать мероприятие
        </Link>
      </div>

    </main>
  );
}
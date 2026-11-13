'use client';

import Link from 'next/link';
import { useTheme } from './context/ThemeContext';

export default function Home() {
  const { theme } = useTheme();

  // Базовые настройки для тем
  let bgClass = "bg-[#fef08a] text-indigo-900"; // Фон для детской темы
  let glow1 = "bg-pink-500/60";
  let glow2 = "bg-yellow-400/60";
  let glow3 = "bg-blue-500/50";

  if (theme === 'classic') {
    bgClass = "bg-[#0a0a0a] text-white";
    glow1 = "bg-purple-600/50";
    glow2 = "bg-blue-600/50";
    glow3 = "bg-pink-600/40";
  } else if (theme === 'light') {
    bgClass = "bg-gray-50 text-gray-900";
    glow1 = "bg-blue-400/40";
    glow2 = "bg-purple-400/40";
    glow3 = "bg-pink-400/40";
  }

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center p-6 font-sans transition-colors duration-500 relative overflow-hidden ${bgClass}`}>
      
      {/* ФОНОВОЕ СВЕЧЕНИЕ */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full blur-[100px] mix-blend-screen animate-float1 ${glow1}`}></div>
        <div className={`absolute top-[30%] right-[5%] w-[400px] h-[400px] rounded-full blur-[120px] mix-blend-screen animate-float2 ${glow2}`}></div>
        <div className={`absolute bottom-[5%] left-[25%] w-[350px] h-[350px] rounded-full blur-[90px] mix-blend-screen animate-float3 ${glow3}`}></div>
      </div>

      {/* КОНТЕНТ */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-7xl font-bold mb-4 tracking-tighter drop-shadow-sm">Зови</h1>
        <p className="text-xl mb-12 opacity-80 max-w-md">Создавай события и собирай друзей. Без сбора персональных данных.</p>
        
        <Link 
          href="/admin" 
          className={`px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all ${
            theme === 'classic' 
              ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.3)]' 
              : theme === 'light' 
                ? 'bg-blue-600 text-white shadow-blue-500/50' 
                : 'bg-indigo-500 text-white shadow-indigo-500/50'
          }`}
        >
          Создать мероприятие
        </Link>
      </div>

    </main>
  );
}
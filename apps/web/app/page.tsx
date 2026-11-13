'use client';

import Link from 'next/link';
import { useTheme } from './context/ThemeContext';

export default function Home() {
  const { theme } = useTheme();

  let bgClass = "bg-gradient-to-br from-yellow-200 via-pink-200 to-indigo-200 text-indigo-900"; 
  if (theme === 'classic') bgClass = "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white";
  if (theme === 'light') bgClass = "bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900";

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center p-6 font-sans transition-colors duration-500 ${bgClass}`}>
      <h1 className="text-6xl font-bold mb-6 tracking-tighter">Зови</h1>
      <p className="text-xl mb-12 opacity-80 text-center max-w-md">Создавай события и собирай друзей. Без сбора персональных данных.</p>
      
      <Link href="/admin" className="px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all bg-indigo-500 text-white">
        Создать мероприятие
      </Link>
    </main>
  );
}
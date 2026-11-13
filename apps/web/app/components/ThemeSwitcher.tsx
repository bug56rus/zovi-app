'use client';

import { useTheme } from '../context/ThemeContext';
import { playClick } from '../utils/sound';
import { usePathname } from 'next/navigation'; // 👈 ИМПОРТ

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname(); // 👈 ПОЛУЧАЕМ ПУТЬ

  // Если это страница гостя, ничего не рендерим
  if (pathname.startsWith('/i/')) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
      {/* ... кнопки остаются без изменений ... */}
      <button onClick={() => { playClick(); setTheme('classic'); }} className={`p-2 rounded-full transition-all ${theme === 'classic' ? 'bg-white/30' : 'hover:bg-white/10'}`}>🌙</button>
      <button onClick={() => { playClick(); setTheme('light'); }} className={`p-2 rounded-full transition-all ${theme === 'light' ? 'bg-white/30' : 'hover:bg-white/10'}`}>☀️</button>
      <button onClick={() => { playClick(); setTheme('kids'); }} className={`p-2 rounded-full transition-all ${theme === 'kids' ? 'bg-white/30' : 'hover:bg-white/10'}`}>🎈</button>
    </div>
  );
}
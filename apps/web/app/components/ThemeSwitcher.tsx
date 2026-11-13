'use client';

import { useTheme } from '../context/ThemeContext';
import { playClick } from '../utils/sound';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
      <button 
        onClick={() => { playClick(); setTheme('classic'); }} 
        className={`p-2 rounded-full transition-all ${theme === 'classic' ? 'bg-white/30' : 'hover:bg-white/10'}`}
        title="Тёмная тема"
      >
        🌙
      </button>
      <button 
        onClick={() => { playClick(); setTheme('light'); }} 
        className={`p-2 rounded-full transition-all ${theme === 'light' ? 'bg-white/30' : 'hover:bg-white/10'}`}
        title="Светлая тема"
      >
        ☀️
      </button>
      <button 
        onClick={() => { playClick(); setTheme('kids'); }} 
        className={`p-2 rounded-full transition-all ${theme === 'kids' ? 'bg-white/30' : 'hover:bg-white/10'}`}
        title="Детская тема"
      >
        🎈
      </button>
    </div>
  );
}
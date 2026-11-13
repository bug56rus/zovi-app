'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'classic' | 'light' | 'kids';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'kids', // Детская по умолчанию
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('kids');
  const [isMounted, setIsMounted] = useState(false); // Защита от гидратации

  useEffect(() => {
    const savedTheme = localStorage.getItem('app_theme') as Theme;
    if (savedTheme && ['classic', 'light', 'kids'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
    setIsMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('app_theme', newTheme);
  };

  // Пока не смонтировалось, рендерим детей без контекста, чтобы не было ошибки
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
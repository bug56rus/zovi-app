// apps/web/app/context/ThemeContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'classic' | 'light' | 'kids';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'classic',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('classic');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app_theme') as Theme;
    if (savedTheme && ['classic', 'light', 'kids'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('app_theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
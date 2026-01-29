import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';
export type FontSize = 'normal' | 'large' | 'xl';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('aeternacy-theme') as Theme;
      return saved || 'dark';
    } catch (e) {
      return 'dark';
    }
  });
  
  const [fontSize, setFontSizeState] = useState<FontSize>('normal');

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      body.style.backgroundColor = '#050811';
      body.style.color = '#f8fafc';
    } else {
      root.classList.remove('dark');
      body.style.backgroundColor = '#FDFBF7';
      body.style.color = '#2D2A26';
    }
    
    try {
      localStorage.setItem('aeternacy-theme', theme);
    } catch (e) {}
  }, [theme]);

  useEffect(() => {
    try {
      const savedFontSize = localStorage.getItem('aeternacy-font-size') as FontSize;
      if (savedFontSize) {
          applyFontSize(savedFontSize);
      }
    } catch (e) {}
  }, []);

  const setTheme = (newTheme: Theme) => {
      setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const applyFontSize = (size: FontSize) => {
      setFontSizeState(size);
      try {
        localStorage.setItem('aeternacy-font-size', size);
      } catch (e) {}
      const percentage = size === 'xl' ? '125%' : size === 'large' ? '112.5%' : '100%';
      document.documentElement.style.fontSize = percentage;
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, fontSize, setFontSize: applyFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
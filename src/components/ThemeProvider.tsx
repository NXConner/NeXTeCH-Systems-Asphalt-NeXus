import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'asphalt-command' | 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('selected-theme') as Theme) || 'asphalt-command';
    }
    return 'asphalt-command';
  });

  useEffect(() => {
    localStorage.setItem('selected-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// ... existing code ...
// Move non-component exports to a new file ThemeProviderUtils.ts and import them here if needed
// ... existing code ... 
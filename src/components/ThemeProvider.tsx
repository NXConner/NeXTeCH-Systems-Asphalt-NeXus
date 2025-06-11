import React, { createContext, useContext, useEffect, useState } from 'react';
import { allThemes } from '../themes/themeConfig';

const ThemeContext = createContext({ theme: 'asphalt', setTheme: (t: string) => {}, themes: allThemes });
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState(() => localStorage.getItem('theme') || 'asphalt');

  useEffect(() => {
    // persist theme key
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // apply dark mode CSS class
    document.documentElement.classList.add('dark');

    // inject CSS variables for the selected theme's dark palette
    const config = allThemes[theme];
    if (config) {
      const colors = config.colors.dark;
      Object.entries(colors).forEach(([key, value]) => {
        const varName = `--${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
        document.documentElement.style.setProperty(varName, String(value));
      });
    }
  }, [theme]);

  const setTheme = (t: string) => {
    setThemeState(t);
    localStorage.setItem('theme', t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: allThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ... existing code ...
// Move non-component exports to a new file ThemeProviderUtils.ts and import them here if needed
// ... existing code ... 
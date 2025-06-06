import { useTheme } from '../ThemeProvider';

function ThemePreview({ themeConfig, mode }: { themeConfig: any, mode: 'light' | 'dark' }) {
  const colors = themeConfig.colors[mode];
  return (
    <span className="flex items-center gap-1 mr-2">
      <span style={{ background: `hsl(${colors.primary})` }} className="w-4 h-4 rounded-full border border-border" title="Primary" />
      <span style={{ background: `hsl(${colors.accent})` }} className="w-4 h-4 rounded-full border border-border" title="Accent" />
      <span style={{ background: `hsl(${colors.background})` }} className="w-4 h-4 rounded-full border border-border" title="Background" />
    </span>
  );
}

export function ThemeSwitcher({ onThemeChange }: { onThemeChange?: () => void } = {}) {
  const { theme, setTheme, themes } = useTheme();
  const mode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(themes).map(([key, config]) => (
        <button
          key={key}
          className={`px-3 py-1 rounded font-semibold border flex items-center transition-colors ${theme === key ? 'bg-primary text-primaryForeground border-primary' : 'bg-muted text-foreground border-border hover:bg-accent hover:text-accentForeground'}`}
          onClick={() => {
            setTheme(key);
            if (onThemeChange) onThemeChange();
            // Dispatch a custom event for map zoom reset
            window.dispatchEvent(new CustomEvent('theme-changed'));
          }}
          type="button"
        >
          <ThemePreview themeConfig={config} mode={mode} />
          {config.name}
        </button>
      ))}
    </div>
  );
}

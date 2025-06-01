import { useTheme } from '../ThemeProvider';

interface AchievementBadgeProps {
  name: string;
  tier: 'bronze' | 'silver' | 'gold';
  progress?: number;
  count?: number;
}

type Theme = 'asphalt-command' | 'light' | 'dark' | 'system';

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ name, tier, progress, count }) => {
  const { theme } = useTheme() as { theme: Theme };
  const color = tier === 'bronze' ? '#CD7F32' : tier === 'silver' ? '#C0C0C0' : '#FFD700';

  return (
    <div
      className={`p-4 rounded-lg ${theme === 'asphalt-command' ? 'bg-[url(/assets/textures/crack-pattern.png)]' : 'bg-gray-800'}`}
      style={{ border: `2px solid ${color}`, boxShadow: `0 0 10px ${color}` }}
    >
      <h3 className="font-['Bebas_Neue'] text-xl">{name}</h3>
      <p className="text-sm capitalize">{tier}</p>
      {typeof progress === 'number' && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}
      {typeof count === 'number' && (
        <div className="text-xs text-muted-foreground mt-1">{count} completed</div>
      )}
    </div>
  );
};

export default AchievementBadge; 
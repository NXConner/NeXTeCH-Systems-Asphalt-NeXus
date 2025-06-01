import { useTheme } from '../ThemeProvider';
import { toast } from '@/components/ui/use-toast';

interface SafetyAlertProps {
  message: string;
  type: 'osha' | 'deq' | 'vdot' | 'ada';
}

type Theme = 'asphalt-command' | 'light' | 'dark' | 'system';

const SafetyAlert: React.FC<SafetyAlertProps> = ({ message, type }) => {
  const { theme } = useTheme() as { theme: Theme };

  const handleClick = () => {
    toast({
      title: `${type.toUpperCase()} Alert`,
      description: message,
      variant: 'destructive',
    });
  };

  return (
    <div
      className={`p-2 rounded ${theme === 'asphalt-command' ? 'alert-projection' : 'bg-red-500 text-white'}`}
      onClick={handleClick}
    >
      <p>{type.toUpperCase()}: {message}</p>
    </div>
  );
};

export default SafetyAlert; 
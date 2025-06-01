import { useState } from 'react';
import { Button } from './button';

export default function MicroInteractions() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="transition-all duration-300">
      <Button
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 1000);
        }}
        className={loading ? 'bg-blue-400 animate-pulse' : 'bg-blue-600'}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Click Me'}
      </Button>
    </div>
  );
} 
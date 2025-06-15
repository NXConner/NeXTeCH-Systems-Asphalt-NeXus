import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimelinePanelProps {
  timeline: Array<{
    id?: string;
    timestamp: string;
    user?: string;
    type?: string;
    action?: string;
    data?: any;
  }>;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const TimelinePanel: React.FC<TimelinePanelProps> = ({ 
  timeline, 
  currentIndex, 
  onIndexChange 
}) => {
  const handlePrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < timeline.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  };

  return (
    <div className="bg-background/95 border p-4 rounded-lg shadow-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Timeline</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrevious}
            disabled={currentIndex <= 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2 py-1 bg-muted rounded text-sm">
            {currentIndex + 1} / {timeline.length}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNext}
            disabled={currentIndex >= timeline.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="max-h-60 overflow-y-auto">
        <ul className="space-y-2">
          {timeline.map((event, idx) => (
            <li 
              key={event.id || idx} 
              className={`p-2 rounded ${idx === currentIndex ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted/50'}`}
              onClick={() => onIndexChange(idx)}
            >
              <div className="flex justify-between text-sm">
                <span className="font-medium">{event.type || event.action}</span>
                <span className="text-muted-foreground">{new Date(event.timestamp).toLocaleTimeString()}</span>
              </div>
              {event.user && (
                <div className="text-xs text-muted-foreground mt-1">By: {event.user}</div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TimelinePanel; 
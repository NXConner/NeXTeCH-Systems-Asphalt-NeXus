import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ruler, Navigation, Eye } from 'lucide-react';

interface ARControlsProps {
  mode: 'measure' | 'navigate' | 'visualize';
  onModeChange: (mode: 'measure' | 'navigate' | 'visualize') => void;
}

export const ARControls: React.FC<ARControlsProps> = ({
  mode,
  onModeChange
}) => {
  return (
    <div className="absolute top-4 left-4 z-50 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
      <div className="flex flex-col gap-2">
        <Select
          value={mode}
          onValueChange={(value: 'measure' | 'navigate' | 'visualize') => onModeChange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select AR Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="measure">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                <span>Measure</span>
              </div>
            </SelectItem>
            <SelectItem value="navigate">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                <span>Navigate</span>
              </div>
            </SelectItem>
            <SelectItem value="visualize">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>Visualize</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Implement calibration */}}
          >
            Calibrate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Implement capture */}}
          >
            Capture
          </Button>
        </div>
      </div>
    </div>
  );
}; 
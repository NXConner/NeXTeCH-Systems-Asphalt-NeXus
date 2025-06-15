import React from 'react';
import { Button } from '@/components/ui/button';
import { useMapContext } from '@/contexts/MapContext';
import { 
  Select, 
  Pencil, 
  Ruler, 
  Layers, 
  Download, 
  Share2, 
  Settings,
  X
} from 'lucide-react';

export const MapTools: React.FC = () => {
  const {
    toolMode,
    setToolMode,
    isDrawing,
    setIsDrawing,
    isMeasuring,
    setIsMeasuring,
    clearSelection
  } = useMapContext();

  const handleToolSelect = (mode: 'select' | 'draw' | 'measure' | 'none') => {
    if (toolMode === mode) {
      clearSelection();
    } else {
      setToolMode(mode);
      setIsDrawing(mode === 'draw');
      setIsMeasuring(mode === 'measure');
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
      <Button
        variant={toolMode === 'select' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => handleToolSelect('select')}
        title="Select"
      >
        <Select className="h-4 w-4" />
      </Button>

      <Button
        variant={toolMode === 'draw' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => handleToolSelect('draw')}
        title="Draw"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Button
        variant={toolMode === 'measure' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => handleToolSelect('measure')}
        title="Measure"
      >
        <Ruler className="h-4 w-4" />
      </Button>

      <div className="h-px bg-border my-1" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {}}
        title="Layers"
      >
        <Layers className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {}}
        title="Export"
      >
        <Download className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {}}
        title="Share"
      >
        <Share2 className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {}}
        title="Settings"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {toolMode !== 'none' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={clearSelection}
          title="Cancel"
          className="text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}; 
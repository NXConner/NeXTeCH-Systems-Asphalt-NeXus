import React from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, RefreshCw, Plus, Minus, Layers, Edit3, Trash2, Download, Ruler, MapPin, Truck, HardHat, AlertTriangle, Users, Eye, Sun, Moon } from 'lucide-react';
import { useResponsiveMap } from '@/hooks/useResponsiveMap';

interface MapControlsProps {
  isFullscreen: boolean;
  onFullscreen: () => void;
  onResetView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleLayers: () => void;
  onToggleDrawing: () => void;
  onClearDrawings: () => void;
  onExport: () => void;
  onMeasure: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  isFullscreen,
  onFullscreen,
  onResetView,
  onZoomIn,
  onZoomOut,
  onToggleLayers,
  onToggleDrawing,
  onClearDrawings,
  onExport,
  onMeasure,
  onToggleDarkMode,
  darkMode
}) => {
  const { getPositionClasses, getLayoutClasses, isMobile } = useResponsiveMap();
  
  return (
    <div className={`absolute ${getPositionClasses()} z-50 flex ${getLayoutClasses()} gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg`}>
      <Button variant="ghost" size="icon" onClick={onFullscreen}>
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </Button>
      <Button variant="ghost" size="icon" onClick={onResetView}>
        <RefreshCw className="h-4 w-4" />
      </Button>
      
      {/* Always show zoom controls, even on mobile */}
      <Button variant="ghost" size="icon" onClick={onZoomIn}>
        <Plus className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onZoomOut}>
        <Minus className="h-4 w-4" />
      </Button>
      
      {/* Hide advanced controls on mobile */}
      {!isMobile && (
        <>
          <Button variant="ghost" size="icon" onClick={onToggleLayers}>
            <Layers className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleDrawing}>
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClearDrawings}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onExport}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onMeasure}>
            <Ruler className="h-4 w-4" />
          </Button>
        </>
      )}
      
      {/* Always show theme toggle */}
      <Button variant="ghost" size="icon" onClick={onToggleDarkMode}>
        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      
      {/* Show a "more" menu on mobile */}
      {isMobile && (
        <Button variant="outline" size="sm" className="text-xs">
          More
        </Button>
      )}
    </div>
  );
};

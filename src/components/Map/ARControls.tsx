import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Eye, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import * as L from 'leaflet';

interface ARControlsProps {
  onToggleAR: () => void;
  onToggleVR: () => void;
  onResetView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: (angle: number) => void;
}

export const ARControls: React.FC<ARControlsProps> = ({
  onToggleAR,
  onToggleVR,
  onResetView,
  onZoomIn,
  onZoomOut,
  onRotate
}) => {
  const map = useMap();
  const [isARMode, setIsARMode] = useState(false);
  const [isVRMode, setIsVRMode] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!map) return;

    // Handle device orientation
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (isARMode && event.alpha !== null) {
        const newRotation = event.alpha;
        setRotation(newRotation);
        onRotate(newRotation);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [map, isARMode, onRotate]);

  const handleToggleAR = () => {
    setIsARMode(!isARMode);
    setIsVRMode(false);
    onToggleAR();
  };

  const handleToggleVR = () => {
    setIsVRMode(!isVRMode);
    setIsARMode(false);
    onToggleVR();
  };

  const handleResetView = () => {
    setRotation(0);
    setScale(1);
    onResetView();
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
    onZoomIn();
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
    onZoomOut();
  };

  return (
    <div className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
      <Button
        variant={isARMode ? 'default' : 'ghost'}
        size="icon"
        onClick={handleToggleAR}
        title="Toggle AR"
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Button
        variant={isVRMode ? 'default' : 'ghost'}
        size="icon"
        onClick={handleToggleVR}
        title="Toggle VR"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>

      {(isARMode || isVRMode) && (
        <>
          <div className="h-px bg-border my-1" />

          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetView}
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>

          <div className="px-2">
            <Slider
              value={[rotation]}
              min={0}
              max={360}
              step={1}
              onValueChange={([value]) => {
                setRotation(value);
                onRotate(value);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}; 
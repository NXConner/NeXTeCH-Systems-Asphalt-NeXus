import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import * as L from 'leaflet';

interface ThemeSwitcherProps {
  isDarkMode: boolean;
  onThemeChange: (isDark: boolean) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  isDarkMode,
  onThemeChange
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Update map tile layer based on theme
    const tileLayer = isDarkMode
      ? L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19
        })
      : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        });

    // Remove existing tile layer
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add new tile layer
    tileLayer.addTo(map);

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [map, isDarkMode]);

  return (
    <div className="absolute bottom-4 right-4 z-[1000]">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onThemeChange(!isDarkMode)}
        className="bg-background/80 backdrop-blur-sm"
      >
        {isDarkMode ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}; 
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { useWeather } from '@/hooks/useWeather';

interface WeatherOverlayProps {
  visible: boolean;
}

export const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ visible }) => {
  const map = useMap();
  const [layer, setLayer] = useState<L.TileLayer | null>(null);
  const { weatherData, loading, error } = useWeather();

  useEffect(() => {
    if (!map) return;

    // Create weather layer
    const weatherLayer = L.tileLayer('https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={apiKey}', {
      layer: 'temp_new',
      apiKey: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
      opacity: 0.7
    });

    setLayer(weatherLayer);

    return () => {
      if (weatherLayer) {
        map.removeLayer(weatherLayer);
      }
    };
  }, [map]);

  useEffect(() => {
    if (!map || !layer) return;

    if (visible) {
      layer.addTo(map);
    } else {
      map.removeLayer(layer);
    }
  }, [visible, map, layer]);

  useEffect(() => {
    if (!layer || !weatherData) return;

    // Update layer based on weather data
    layer.setUrl(`https://tile.openweathermap.org/map/${weatherData.layer}/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`);
  }, [layer, weatherData]);

  if (loading) {
    return (
      <div className="absolute top-4 right-4 z-[1000] bg-background/80 backdrop-blur-sm p-2 rounded-lg">
        Loading weather data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute top-4 right-4 z-[1000] bg-destructive/80 backdrop-blur-sm p-2 rounded-lg text-destructive-foreground">
        Error loading weather data: {error.message}
      </div>
    );
  }

  return null;
}; 
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Cloud, CloudRain, CloudSnow, Sun, Wind } from 'lucide-react';
import * as L from 'leaflet';

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  windSpeed: number;
  precipitation: number;
  humidity: number;
}

interface WeatherOverlayProps {
  apiKey: string;
  onWeatherAlert?: (alert: string) => void;
}

export const WeatherOverlay: React.FC<WeatherOverlayProps> = ({
  apiKey,
  onWeatherAlert
}) => {
  const map = useMap();
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overlay, setOverlay] = useState<L.TileLayer | null>(null);

  useEffect(() => {
    if (!map) return;

    // Create weather overlay layer
    const weatherLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=${apiKey}`,
      {
        attribution: 'Weather data © OpenWeatherMap',
        opacity: 0.7
      }
    );

    setOverlay(weatherLayer);

    return () => {
      if (weatherLayer) {
        map.removeLayer(weatherLayer);
      }
    };
  }, [map, apiKey]);

  const fetchWeatherData = async (lat: number, lng: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();

      if (data.cod !== 200) {
        throw new Error(data.message);
      }

      const weather: WeatherData = {
        temperature: data.main.temp,
        condition: data.weather[0].main,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
        precipitation: data.rain?.['1h'] || 0,
        humidity: data.main.humidity
      };

      setWeatherData(prev => ({
        ...prev,
        [`${lat},${lng}`]: weather
      }));

      // Check for severe weather conditions
      if (data.weather[0].main === 'Thunderstorm' || data.wind.speed > 20) {
        onWeatherAlert?.(`Severe weather alert: ${data.weather[0].description}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    fetchWeatherData(lat, lng);
  };

  useEffect(() => {
    if (!map) return;

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="h-4 w-4" />;
      case 'clouds':
        return <Cloud className="h-4 w-4" />;
      case 'rain':
        return <CloudRain className="h-4 w-4" />;
      case 'snow':
        return <CloudSnow className="h-4 w-4" />;
      default:
        return <Wind className="h-4 w-4" />;
    }
  };

  return (
    <div className="absolute bottom-4 left-4 z-[1000]">
      <div className="bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-4">
        <div className="space-y-4">
          {Object.entries(weatherData).map(([key, data]) => (
            <div key={key} className="flex items-center gap-2">
              {getWeatherIcon(data.condition)}
              <div>
                <div className="text-sm font-medium">
                  {data.temperature}°C
                </div>
                <div className="text-xs text-muted-foreground">
                  {data.condition}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-sm text-muted-foreground">
              Loading weather data...
            </div>
          )}
          {error && (
            <div className="text-sm text-destructive">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 
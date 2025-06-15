import { useState, useEffect, useCallback } from 'react';
import { useMap } from 'react-leaflet';

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  windSpeed: number;
  precipitation: number;
  humidity: number;
  timestamp: number;
}

interface WeatherAlert {
  id: string;
  type: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  message: string;
  timestamp: number;
}

interface UseWeatherOptions {
  apiKey: string;
  updateInterval?: number;
  onAlert?: (alert: WeatherAlert) => void;
}

export const useWeather = ({
  apiKey,
  updateInterval = 300000, // 5 minutes
  onAlert
}: UseWeatherOptions) => {
  const map = useMap();
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async (lat: number, lng: number) => {
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
        humidity: data.main.humidity,
        timestamp: Date.now()
      };

      setWeatherData(prev => ({
        ...prev,
        [`${lat},${lng}`]: weather
      }));

      // Check for severe weather conditions
      if (data.weather[0].main === 'Thunderstorm' || data.wind.speed > 20) {
        const alert: WeatherAlert = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'weather',
          severity: data.wind.speed > 30 ? 'severe' : 'moderate',
          message: `Severe weather alert: ${data.weather[0].description}`,
          timestamp: Date.now()
        };

        setAlerts(prev => [...prev, alert]);
        onAlert?.(alert);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, onAlert]);

  const fetchHistoricalWeather = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=current,minutely&appid=${apiKey}&units=metric`
      );
      const data = await response.json();

      if (data.cod) {
        throw new Error(data.message);
      }

      return data.hourly.map((hour: any) => ({
        temperature: hour.temp,
        condition: hour.weather[0].main,
        icon: hour.weather[0].icon,
        windSpeed: hour.wind_speed,
        precipitation: hour.rain?.['1h'] || 0,
        humidity: hour.humidity,
        timestamp: hour.dt * 1000
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch historical weather data');
      return [];
    }
  }, [apiKey]);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      fetchWeatherData(lat, lng);
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, fetchWeatherData]);

  useEffect(() => {
    const interval = setInterval(() => {
      Object.entries(weatherData).forEach(([key, data]) => {
        if (Date.now() - data.timestamp > updateInterval) {
          const [lat, lng] = key.split(',').map(Number);
          fetchWeatherData(lat, lng);
        }
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [weatherData, updateInterval, fetchWeatherData]);

  return {
    weatherData,
    alerts,
    isLoading,
    error,
    fetchWeatherData,
    fetchHistoricalWeather,
    clearAlerts,
    removeAlert
  };
}; 
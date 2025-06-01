import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function GPSLocation() {
  const [location, setLocation] = useState<string|null>(null);
  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocation('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => setLocation(`Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}`),
      err => setLocation('Unable to retrieve location')
    );
  };
  return (
    <div className="p-4 border rounded">
      <Button onClick={getLocation}>Get GPS Location</Button>
      {location && <div className="mt-2">{location}</div>}
    </div>
  );
} 
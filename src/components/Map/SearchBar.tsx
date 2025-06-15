import React, { useState, useCallback } from 'react';
import { useMap } from 'react-leaflet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import * as L from 'leaflet';
import debounce from 'lodash/debounce';

interface SearchResult {
  id: string;
  name: string;
  coordinates: [number, number];
}

export const SearchBar: React.FC = () => {
  const map = useMap();
  const [query, setQuery] = useState('');
  const [marker, setMarker] = useState<L.Marker | null>(null);

  const searchLocation = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) return;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&limit=1`
        );
        const data = await response.json();

        if (data.length > 0) {
          const result: SearchResult = {
            id: data[0].place_id,
            name: data[0].display_name,
            coordinates: [parseFloat(data[0].lat), parseFloat(data[0].lon)]
          };

          // Update marker
          if (marker) {
            map.removeLayer(marker);
          }

          const newMarker = L.marker(result.coordinates)
            .addTo(map)
            .bindPopup(result.name)
            .openPopup();

          setMarker(newMarker);

          // Center map on result
          map.setView(result.coordinates, 15);
        }
      } catch (error) {
        console.error('Error searching location:', error);
      }
    }, 300),
    [map, marker]
  );

  const handleSearch = () => {
    searchLocation(query);
  };

  const handleClear = () => {
    setQuery('');
    if (marker) {
      map.removeLayer(marker);
      setMarker(null);
    }
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-96">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search locations..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSearch()}
          className="bg-background/80 backdrop-blur-sm pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              title="Clear"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearch}
            title="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}; 
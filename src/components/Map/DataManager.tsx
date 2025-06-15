import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Layers, Filter, Download, Play, Pause } from 'lucide-react';
import * as L from 'leaflet';
import 'leaflet.heat';

interface DataLayer {
  id: string;
  name: string;
  type: 'heatmap' | 'marker' | 'polygon';
  data: any[];
  color: string;
  radius: number;
  opacity: number;
  isVisible: boolean;
  layer: L.Layer | null;
}

interface DataManagerProps {
  onLayerChange?: (layers: DataLayer[]) => void;
}

export const DataManager: React.FC<DataManagerProps> = ({
  onLayerChange
}) => {
  const map = useMap();
  const [layers, setLayers] = useState<DataLayer[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    if (!map) return;

    // Initialize layers
    const initialLayers: DataLayer[] = [
      {
        id: 'heatmap-1',
        name: 'Temperature Heatmap',
        type: 'heatmap',
        data: [],
        color: '#ff0000',
        radius: 25,
        opacity: 0.7,
        isVisible: true,
        layer: null
      },
      {
        id: 'markers-1',
        name: 'Location Markers',
        type: 'marker',
        data: [],
        color: '#0000ff',
        radius: 10,
        opacity: 1,
        isVisible: true,
        layer: null
      }
    ];

    setLayers(initialLayers);

    return () => {
      initialLayers.forEach(layer => {
        if (layer.layer) {
          map.removeLayer(layer.layer);
        }
      });
    };
  }, [map]);

  const createHeatmapLayer = (layer: DataLayer) => {
    if (!map) return null;

    const points = layer.data.map(point => [
      point.lat,
      point.lng,
      point.intensity || 1
    ]);

    return L.heatLayer(points, {
      radius: layer.radius,
      blur: layer.radius / 2,
      maxZoom: 10,
      max: 1.0,
      gradient: {
        0.4: layer.color,
        0.6: '#ffff00',
        0.8: '#ff0000',
        1.0: '#ff0000'
      }
    });
  };

  const createMarkerLayer = (layer: DataLayer) => {
    if (!map) return null;

    const markerGroup = L.layerGroup();
    layer.data.forEach(point => {
      const marker = L.circleMarker([point.lat, point.lng], {
        radius: layer.radius,
        color: layer.color,
        fillColor: layer.color,
        fillOpacity: layer.opacity
      }).bindPopup(point.name || 'Location');

      markerGroup.addLayer(marker);
    });

    return markerGroup;
  };

  const updateLayer = (layerId: string, updates: Partial<DataLayer>) => {
    setLayers(prev => prev.map(layer => {
      if (layer.id === layerId) {
        const updatedLayer = { ...layer, ...updates };

        // Remove old layer
        if (layer.layer) {
          map.removeLayer(layer.layer);
        }

        // Create new layer
        let newLayer: L.Layer | null = null;
        if (updatedLayer.isVisible) {
          if (updatedLayer.type === 'heatmap') {
            newLayer = createHeatmapLayer(updatedLayer);
          } else if (updatedLayer.type === 'marker') {
            newLayer = createMarkerLayer(updatedLayer);
          }

          if (newLayer) {
            newLayer.addTo(map);
          }
        }

        return { ...updatedLayer, layer: newLayer };
      }
      return layer;
    }));
  };

  const handleToggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(layer => {
      if (layer.id === layerId) {
        const isVisible = !layer.isVisible;
        if (layer.layer) {
          if (isVisible) {
            layer.layer.addTo(map);
          } else {
            map.removeLayer(layer.layer);
          }
        }
        return { ...layer, isVisible };
      }
      return layer;
    }));
  };

  const handleOpacityChange = (layerId: string, opacity: number) => {
    updateLayer(layerId, { opacity });
  };

  const handleRadiusChange = (layerId: string, radius: number) => {
    updateLayer(layerId, { radius });
  };

  const handleExportData = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    const dataStr = JSON.stringify(layer.data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `${layer.name.toLowerCase().replace(/\s+/g, '-')}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handlePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const filteredLayers = layers.filter(layer =>
    layer.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <div className="bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Input
            type="text"
            placeholder="Filter layers..."
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            className="w-48"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handlePlayback}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {filteredLayers.map(layer => (
              <div key={layer.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={layer.isVisible}
                      onCheckedChange={() => handleToggleLayer(layer.id)}
                    />
                    <span className="text-sm">{layer.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleExportData(layer.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                {layer.isVisible && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Opacity</span>
                      <Slider
                        value={[layer.opacity * 100]}
                        onValueChange={([value]) => handleOpacityChange(layer.id, value / 100)}
                        max={100}
                        step={1}
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Radius</span>
                      <Slider
                        value={[layer.radius]}
                        onValueChange={([value]) => handleRadiusChange(layer.id, value)}
                        max={50}
                        step={1}
                        className="w-32"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}; 
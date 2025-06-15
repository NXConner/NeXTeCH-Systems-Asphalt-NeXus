import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Layers, Eye, EyeOff } from 'lucide-react';
import * as L from 'leaflet';

interface Layer {
  id: string;
  name: string;
  type: 'tile' | 'overlay' | 'marker' | 'heatmap';
  layer: L.Layer;
  isVisible: boolean;
  opacity: number;
  zIndex: number;
}

interface LayerManagerProps {
  onLayerChange?: (layers: Layer[]) => void;
}

export const LayerManager: React.FC<LayerManagerProps> = ({
  onLayerChange
}) => {
  const map = useMap();
  const [layers, setLayers] = useState<Layer[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Initialize base layers
  useEffect(() => {
    if (!map) return;

    const baseLayers: Layer[] = [
      {
        id: 'satellite',
        name: 'Satellite',
        type: 'tile',
        layer: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 19
        }),
        isVisible: true,
        opacity: 1,
        zIndex: 1
      },
      {
        id: 'street',
        name: 'Street',
        type: 'tile',
        layer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }),
        isVisible: false,
        opacity: 1,
        zIndex: 2
      },
      {
        id: 'terrain',
        name: 'Terrain',
        type: 'tile',
        layer: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
          maxZoom: 17
        }),
        isVisible: false,
        opacity: 1,
        zIndex: 3
      }
    ];

    setLayers(baseLayers);
    baseLayers[0].layer.addTo(map);

    return () => {
      baseLayers.forEach(layer => {
        if (layer.layer) {
          map.removeLayer(layer.layer);
        }
      });
    };
  }, [map]);

  const handleToggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(layer => {
      if (layer.id === layerId) {
        if (layer.isVisible) {
          map.removeLayer(layer.layer);
        } else {
          layer.layer.addTo(map);
        }
        return { ...layer, isVisible: !layer.isVisible };
      }
      return layer;
    }));
  };

  const handleOpacityChange = (layerId: string, opacity: number) => {
    setLayers(prev => prev.map(layer => {
      if (layer.id === layerId) {
        if (layer.type === 'tile') {
          (layer.layer as L.TileLayer).setOpacity(opacity);
        }
        return { ...layer, opacity };
      }
      return layer;
    }));
  };

  const handleZIndexChange = (layerId: string, zIndex: number) => {
    setLayers(prev => {
      const newLayers = prev.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, zIndex };
        }
        return layer;
      }).sort((a, b) => a.zIndex - b.zIndex);

      // Reorder layers on map
      newLayers.forEach(layer => {
        if (layer.isVisible) {
          layer.layer.setZIndex(layer.zIndex);
        }
      });

      return newLayers;
    });
  };

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-background/80 backdrop-blur-sm"
      >
        <Layers className="h-4 w-4" />
      </Button>

      {isExpanded && (
        <div className="mt-2 w-64 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-4">
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {layers.map(layer => (
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
                      onClick={() => handleToggleLayer(layer.id)}
                    >
                      {layer.isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {layer.isVisible && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">Opacity</span>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={layer.opacity}
                          onChange={e => handleOpacityChange(layer.id, parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">Z-Index</span>
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={layer.zIndex}
                          onChange={e => handleZIndexChange(layer.id, parseInt(e.target.value))}
                          className="w-20"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

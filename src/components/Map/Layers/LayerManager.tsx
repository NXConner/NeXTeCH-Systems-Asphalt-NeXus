import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Layers, ChevronDown, ChevronRight } from 'lucide-react';
import * as L from 'leaflet';

interface Layer {
  id: string;
  name: string;
  type: 'base' | 'overlay';
  visible: boolean;
  layer: L.Layer;
}

interface LayerGroup {
  id: string;
  name: string;
  layers: Layer[];
  expanded: boolean;
}

export const LayerManager: React.FC = () => {
  const map = useMap();
  const [isOpen, setIsOpen] = useState(false);
  const [layerGroups, setLayerGroups] = useState<LayerGroup[]>([]);

  useEffect(() => {
    if (!map) return;

    // Initialize layer groups
    const groups: LayerGroup[] = [
      {
        id: 'base',
        name: 'Base Layers',
        layers: [
          {
            id: 'satellite',
            name: 'Satellite',
            type: 'base',
            visible: true,
            layer: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
              attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
            })
          },
          {
            id: 'street',
            name: 'Street',
            type: 'base',
            visible: false,
            layer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            })
          }
        ],
        expanded: true
      },
      {
        id: 'overlays',
        name: 'Overlays',
        layers: [
          {
            id: 'weather',
            name: 'Weather',
            type: 'overlay',
            visible: false,
            layer: L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY')
          },
          {
            id: 'traffic',
            name: 'Traffic',
            type: 'overlay',
            visible: false,
            layer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
          }
        ],
        expanded: true
      }
    ];

    setLayerGroups(groups);

    // Add initial layers
    groups.forEach(group => {
      group.layers.forEach(layer => {
        if (layer.visible) {
          layer.layer.addTo(map);
        }
      });
    });

    return () => {
      // Cleanup layers
      groups.forEach(group => {
        group.layers.forEach(layer => {
          if (layer.layer) {
            map.removeLayer(layer.layer);
          }
        });
      });
    };
  }, [map]);

  const toggleLayer = (layerId: string) => {
    setLayerGroups(prevGroups => {
      return prevGroups.map(group => ({
        ...group,
        layers: group.layers.map(layer => {
          if (layer.id === layerId) {
            const newVisible = !layer.visible;
            if (newVisible) {
              layer.layer.addTo(map);
            } else {
              map.removeLayer(layer.layer);
            }
            return { ...layer, visible: newVisible };
          }
          return layer;
        })
      }));
    });
  };

  const toggleGroup = (groupId: string) => {
    setLayerGroups(prevGroups => {
      return prevGroups.map(group => {
        if (group.id === groupId) {
          return { ...group, expanded: !group.expanded };
        }
        return group;
      });
    });
  };

  return (
    <div className="absolute top-4 left-4 z-[1000]">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-background/80 backdrop-blur-sm"
      >
        <Layers className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="mt-2 w-64 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-4">
          <ScrollArea className="h-[400px]">
            {layerGroups.map(group => (
              <div key={group.id} className="mb-4">
                <div
                  className="flex items-center justify-between cursor-pointer mb-2"
                  onClick={() => toggleGroup(group.id)}
                >
                  <h3 className="font-medium">{group.name}</h3>
                  {group.expanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>

                {group.expanded && (
                  <div className="space-y-2 pl-4">
                    {group.layers.map(layer => (
                      <div key={layer.id} className="flex items-center space-x-2">
                        <Switch
                          id={layer.id}
                          checked={layer.visible}
                          onCheckedChange={() => toggleLayer(layer.id)}
                        />
                        <Label htmlFor={layer.id}>{layer.name}</Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}; 
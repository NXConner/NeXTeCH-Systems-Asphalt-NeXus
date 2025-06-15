import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useCollaboration } from '@/hooks/useCollaboration';
import * as L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface CollaborationLayerProps {
  visible: boolean;
}

export const CollaborationLayer: React.FC<CollaborationLayerProps> = ({ visible }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<L.Marker[]>([]);
  const { collaborators, cursorPositions, annotations } = useCollaboration();

  useEffect(() => {
    if (!map) return;

    // Create markers for each collaborator
    const newMarkers = collaborators.map(collaborator => {
      const marker = L.marker([0, 0], {
        icon: L.divIcon({
          className: 'collaborator-cursor',
          html: `<div class="cursor-${collaborator.id}">${collaborator.name}</div>`,
          iconSize: [20, 20]
        })
      });

      return marker;
    });

    setMarkers(newMarkers);

    return () => {
      // Cleanup markers
      newMarkers.forEach(marker => {
        map.removeLayer(marker);
      });
    };
  }, [map, collaborators]);

  useEffect(() => {
    if (!map || !visible) return;

    // Add markers to map
    markers.forEach(marker => {
      marker.addTo(map);
    });

    return () => {
      // Remove markers from map
      markers.forEach(marker => {
        map.removeLayer(marker);
      });
    };
  }, [map, visible, markers]);

  useEffect(() => {
    if (!map || !visible) return;

    // Update marker positions
    markers.forEach((marker, index) => {
      const collaborator = collaborators[index];
      if (collaborator && cursorPositions[collaborator.id]) {
        const { lat, lng } = cursorPositions[collaborator.id];
        marker.setLatLng([lat, lng]);
      }
    });
  }, [map, visible, markers, collaborators, cursorPositions]);

  useEffect(() => {
    if (!map || !visible) return;

    // Handle annotations
    annotations.forEach(annotation => {
      const { type, coordinates, content, author } = annotation;

      switch (type) {
        case 'marker':
          L.marker(coordinates, {
            icon: L.divIcon({
              className: 'annotation-marker',
              html: `<div>${content}</div>`,
              iconSize: [30, 30]
            })
          }).addTo(map);
          break;

        case 'polygon':
          L.polygon(coordinates, {
            color: '#3388ff',
            fillOpacity: 0.2
          }).addTo(map);
          break;

        case 'polyline':
          L.polyline(coordinates, {
            color: '#3388ff',
            weight: 3
          }).addTo(map);
          break;
      }
    });
  }, [map, visible, annotations]);

  return (
    <>
      {collaborators.map((collaborator) => (
        <Marker
          key={collaborator.id}
          position={collaborator.position}
          icon={L.divIcon({
            className: 'collaborator-marker',
            html: `
              <div class="relative">
                <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-lg">
                  <img src="${collaborator.avatar || '/default-avatar.png'}" alt="${collaborator.name}" class="w-full h-full object-cover" />
                </div>
                <div class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                  collaborator.status === 'online' ? 'bg-green-500' :
                  collaborator.status === 'away' ? 'bg-yellow-500' :
                  'bg-gray-500'
                } border-2 border-white"></div>
              </div>
            `
          })}
        >
          <Popup>
            <div className="p-2">
              <div className="flex items-center gap-2 mb-2">
                <Avatar src={collaborator.avatar} alt={collaborator.name} />
                <div>
                  <div className="font-medium">{collaborator.name}</div>
                  <Badge variant={collaborator.status === 'online' ? 'success' : 'secondary'}>
                    {collaborator.status}
                  </Badge>
                </div>
              </div>
              {collaborator.currentTask && (
                <div className="text-sm text-muted-foreground">
                  Current Task: {collaborator.currentTask}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}; 
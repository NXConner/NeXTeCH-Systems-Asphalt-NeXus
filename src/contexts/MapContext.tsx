import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getGeofences } from '@/services/geofenceService';
import { getLayers } from '@/services/layerService';
import { logger } from '@/lib/logger';
import * as L from 'leaflet';

export type ToolMode = 'select' | 'draw' | 'measure' | 'none';

interface MapContextType {
  toolMode: ToolMode;
  setToolMode: (mode: ToolMode) => void;
  selectedFeatures: L.Layer[];
  setSelectedFeatures: (features: L.Layer[]) => void;
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
  isMeasuring: boolean;
  setIsMeasuring: (measuring: boolean) => void;
  clearSelection: () => void;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toolMode, setToolMode] = useState<ToolMode>('none');
  const [selectedFeatures, setSelectedFeatures] = useState<L.Layer[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const channelRef = useRef<any>(null);
  const [geofences, setGeofences] = useState<any[]>([]);
  const [layers, setLayers] = useState<any[]>([]);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [geofencesData, layersData] = await Promise.all([
          getGeofences(),
          getLayers()
        ]);

        setGeofences(geofencesData || []);
        setLayers(layersData || []);
        setRetryCount(0); // Reset retry count on success
      } catch (error) {
        logger.error('Error fetching map data:', error);
        
        // Retry on network errors
        if (error instanceof TypeError && retryCount < MAX_RETRIES) {
          logger.info(`Retrying data fetch (attempt ${retryCount + 1}/${MAX_RETRIES})`);
          setRetryCount(prev => prev + 1);
          await delay(RETRY_DELAY * (retryCount + 1));
          fetchData(); // Retry the fetch
        } else {
          // Set empty arrays to prevent UI breakage
          setGeofences([]);
          setLayers([]);
        }
      }
    };

    fetchData();
  }, [retryCount]);

  useEffect(() => {
    const setupChannel = () => {
      const channel = supabase.channel('geofence');
      
      channel
        .on('broadcast', { event: 'timeline-update' }, (payload) => {
          setTimeline(prev => [payload.payload, ...prev]);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            logger.info('Successfully subscribed to geofence channel');
          } else if (status === 'CLOSED') {
            logger.warn('Geofence channel closed, attempting to reconnect...');
            setTimeout(setupChannel, 1000); // Attempt to reconnect after 1 second
          }
        });

      channelRef.current = channel;
    };

    setupChannel();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedFeatures([]);
    setToolMode('none');
    setIsDrawing(false);
    setIsMeasuring(false);
  }, []);

  return (
    <MapContext.Provider
      value={{
        toolMode,
        setToolMode,
        selectedFeatures,
        setSelectedFeatures,
        isDrawing,
        setIsDrawing,
        isMeasuring,
        setIsMeasuring,
        clearSelection
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};

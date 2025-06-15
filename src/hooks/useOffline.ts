import { useState, useEffect, useCallback } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';

interface OfflineState {
  isOnline: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  cachedTiles: Set<string>;
}

interface UseOfflineOptions {
  onStateChange?: (state: OfflineState) => void;
}

export const useOffline = ({
  onStateChange
}: UseOfflineOptions = {}) => {
  const map = useMap();
  const [state, setState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    isDownloading: false,
    downloadProgress: 0,
    cachedTiles: new Set()
  });

  useEffect(() => {
    const handleOnline = () => {
      setState(prev => {
        const newState = { ...prev, isOnline: true };
        onStateChange?.(newState);
        return newState;
      });
    };

    const handleOffline = () => {
      setState(prev => {
        const newState = { ...prev, isOnline: false };
        onStateChange?.(newState);
        return newState;
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onStateChange]);

  const downloadMapTiles = useCallback(async () => {
    if (!map || state.isDownloading) return;

    setState(prev => {
      const newState = { ...prev, isDownloading: true, downloadProgress: 0 };
      onStateChange?.(newState);
      return newState;
    });

    try {
      const bounds = map.getBounds();
      const zoom = map.getZoom();
      const tileSize = 256;
      const tiles: string[] = [];

      // Calculate tiles to download
      const nw = bounds.getNorthWest();
      const se = bounds.getSouthEast();
      const tileNw = map.project(nw, zoom).divideBy(tileSize).floor();
      const tileSe = map.project(se, zoom).ceil();

      for (let x = tileNw.x; x <= tileSe.x; x++) {
        for (let y = tileNw.y; y <= tileSe.y; y++) {
          const tileUrl = `https://{s}.tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
          tiles.push(tileUrl);
        }
      }

      // Download tiles
      const totalTiles = tiles.length;
      let downloadedTiles = 0;

      for (const tileUrl of tiles) {
        try {
          const response = await fetch(tileUrl);
          const blob = await response.blob();
          const cacheKey = tileUrl;

          // Store tile in IndexedDB
          const db = await openDB();
          await db.put('tiles', blob, cacheKey);

          downloadedTiles++;
          setState(prev => {
            const newState = {
              ...prev,
              downloadProgress: (downloadedTiles / totalTiles) * 100,
              cachedTiles: new Set([...prev.cachedTiles, cacheKey])
            };
            onStateChange?.(newState);
            return newState;
          });
        } catch (error) {
          console.error('Error downloading tile:', error);
        }
      }
    } catch (error) {
      console.error('Error downloading map tiles:', error);
    } finally {
      setState(prev => {
        const newState = { ...prev, isDownloading: false };
        onStateChange?.(newState);
        return newState;
      });
    }
  }, [map, state.isDownloading, onStateChange]);

  const clearCache = useCallback(async () => {
    try {
      const db = await openDB();
      await db.clear('tiles');
      setState(prev => {
        const newState = { ...prev, cachedTiles: new Set() };
        onStateChange?.(newState);
        return newState;
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }, [onStateChange]);

  const getCachedTile = useCallback(async (url: string) => {
    try {
      const db = await openDB();
      return await db.get('tiles', url);
    } catch (error) {
      console.error('Error getting cached tile:', error);
      return null;
    }
  }, []);

  const openDB = async () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('mapTiles', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('tiles')) {
          db.createObjectStore('tiles');
        }
      };
    });
  };

  return {
    ...state,
    downloadMapTiles,
    clearCache,
    getCachedTile
  };
}; 
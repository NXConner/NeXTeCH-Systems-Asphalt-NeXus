import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Wifi, WifiOff, Map } from 'lucide-react';
import * as L from 'leaflet';

interface OfflineManagerProps {
  onOfflineStatusChange?: (isOffline: boolean) => void;
}

export const OfflineManager: React.FC<OfflineManagerProps> = ({
  onOfflineStatusChange
}) => {
  const map = useMap();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [cachedTiles, setCachedTiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      onOfflineStatusChange?.(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
      onOfflineStatusChange?.(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onOfflineStatusChange]);

  const downloadMapTiles = async () => {
    if (!map) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    const bounds = map.getBounds();
    const zoom = map.getZoom();
    const tileLayer = map.getPane('tilePane');
    const tileSize = 256;
    const tiles: string[] = [];

    // Calculate tiles to download
    const nw = bounds.getNorthWest();
    const se = bounds.getSouthEast();
    const tileNw = map.project(nw, zoom).divideBy(tileSize).floor();
    const tileSe = map.project(se, zoom).divideBy(tileSize).ceil();

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
        setDownloadProgress((downloadedTiles / totalTiles) * 100);
        setCachedTiles(prev => new Set([...prev, cacheKey]));
      } catch (error) {
        console.error('Error downloading tile:', error);
      }
    }

    setIsDownloading(false);
  };

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

  const clearCache = async () => {
    try {
      const db = await openDB();
      await db.clear('tiles');
      setCachedTiles(new Set());
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  return (
    <div className="absolute bottom-4 left-4 z-[1000]">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-background/80 backdrop-blur-sm"
          title={isOffline ? 'Offline Mode' : 'Online Mode'}
        >
          {isOffline ? (
            <WifiOff className="h-4 w-4" />
          ) : (
            <Wifi className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={downloadMapTiles}
          disabled={isDownloading || isOffline}
          className="bg-background/80 backdrop-blur-sm"
          title="Download Map Tiles"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={clearCache}
          className="bg-background/80 backdrop-blur-sm"
          title="Clear Cache"
        >
          <Map className="h-4 w-4" />
        </Button>
      </div>

      {isDownloading && (
        <div className="mt-2 w-48 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-4">
          <div className="space-y-2">
            <div className="text-sm">Downloading tiles...</div>
            <Progress value={downloadProgress} />
            <div className="text-xs text-muted-foreground">
              {Math.round(downloadProgress)}%
            </div>
          </div>
        </div>
      )}

      {cachedTiles.size > 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          {cachedTiles.size} tiles cached
        </div>
      )}
    </div>
  );
}; 
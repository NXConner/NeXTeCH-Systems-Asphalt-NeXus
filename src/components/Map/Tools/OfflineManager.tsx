import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, Trash2 } from 'lucide-react';

interface OfflineManagerProps {
  isOffline: boolean;
  onSync: () => void;
  cachedTiles: {
    total: number;
    downloaded: number;
    size: number;
  };
}

export const OfflineManager: React.FC<OfflineManagerProps> = ({
  isOffline,
  onSync,
  cachedTiles
}) => {
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    try {
      await onSync();
      setSyncProgress(100);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="absolute bottom-4 left-4 z-50 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant={isOffline ? 'destructive' : 'success'}>
            {isOffline ? 'Offline' : 'Online'}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {formatSize(cachedTiles.size)} cached
          </span>
        </div>

        <Progress value={syncProgress} className="w-[200px]" />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <Upload className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Sync
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Implement download area */}}
          >
            <Download className="h-4 w-4" />
            Download Area
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Implement clear cache */}}
          >
            <Trash2 className="h-4 w-4" />
            Clear Cache
          </Button>
        </div>
      </div>
    </div>
  );
}; 
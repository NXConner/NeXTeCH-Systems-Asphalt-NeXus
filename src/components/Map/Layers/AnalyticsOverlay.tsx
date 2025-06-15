import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useAnalytics } from '@/hooks/useAnalytics';
import * as L from 'leaflet';
import 'leaflet.heat';
import { LayerGroup, Circle, Popup } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, Download } from 'lucide-react';

interface AnalyticsOverlayProps {
  visible: boolean;
  type: 'heatmap' | 'clusters' | 'choropleth';
  data: any[];
}

export const AnalyticsOverlay: React.FC<AnalyticsOverlayProps> = ({
  visible,
  type,
  data
}) => {
  const map = useMap();
  const [layer, setLayer] = useState<L.Layer | null>(null);
  const { generateHeatmap, generateClusters, generateChoropleth } = useAnalytics();

  useEffect(() => {
    if (!map || !visible || !data.length) return;

    let newLayer: L.Layer | null = null;

    switch (type) {
      case 'heatmap':
        newLayer = generateHeatmap(data);
        break;

      case 'clusters':
        newLayer = generateClusters(data);
        break;

      case 'choropleth':
        newLayer = generateChoropleth(data);
        break;
    }

    if (newLayer) {
      newLayer.addTo(map);
      setLayer(newLayer);
    }

    return () => {
      if (newLayer) {
        map.removeLayer(newLayer);
      }
    };
  }, [map, visible, type, data, generateHeatmap, generateClusters, generateChoropleth]);

  return null;
};

interface AnalyticsOverlayProps {
  data: {
    heatmapData: Array<[number, number, number]>;
    clusters: Array<{
      center: [number, number];
      radius: number;
      count: number;
      metrics: {
        average: number;
        min: number;
        max: number;
        total: number;
      };
    }>;
  };
  onGenerateReport: () => void;
}

export const AnalyticsOverlay: React.FC<AnalyticsOverlayProps> = ({
  data,
  onGenerateReport
}) => {
  return (
    <LayerGroup>
      {/* Heatmap Layer */}
      {data.heatmapData.map((point, index) => (
        <Circle
          key={`heatmap-${index}`}
          center={[point[0], point[1]]}
          radius={point[2] * 10}
          pathOptions={{
            fillColor: '#ff0000',
            fillOpacity: 0.3,
            color: 'transparent'
          }}
        />
      ))}

      {/* Cluster Markers */}
      {data.clusters.map((cluster, index) => (
        <Circle
          key={`cluster-${index}`}
          center={cluster.center}
          radius={cluster.radius}
          pathOptions={{
            fillColor: '#0000ff',
            fillOpacity: 0.2,
            color: '#0000ff',
            weight: 2
          }}
        >
          <Popup>
            <Card className="w-64">
              <CardHeader>
                <CardTitle className="text-sm">Cluster Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <div className="font-medium">Data Points: {cluster.count}</div>
                    <div>Average: {cluster.metrics.average.toFixed(2)}</div>
                    <div>Min: {cluster.metrics.min.toFixed(2)}</div>
                    <div>Max: {cluster.metrics.max.toFixed(2)}</div>
                    <div>Total: {cluster.metrics.total.toFixed(2)}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={onGenerateReport}
                  >
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {/* Implement export */}}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Popup>
        </Circle>
      ))}
    </LayerGroup>
  );
}; 
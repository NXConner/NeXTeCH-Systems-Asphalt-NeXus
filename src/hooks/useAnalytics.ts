import { useState, useEffect, useCallback } from 'react';
import * as L from 'leaflet';
import 'leaflet.heat';
import 'leaflet.markercluster';
import { useMap } from 'react-leaflet';

interface DataPoint {
  lat: number;
  lng: number;
  value: number;
  properties?: Record<string, any>;
}

interface AnalyticsOptions {
  radius?: number;
  blur?: number;
  maxZoom?: number;
  minOpacity?: number;
  gradient?: Record<number, string>;
}

export interface AnalyticsData {
  id: string;
  type: string;
  value: number;
  timestamp: number;
  category?: string;
  location?: [number, number];
}

export interface AnalyticsState {
  data: AnalyticsData[];
  filteredData: AnalyticsData[];
  dateRange: [Date, Date];
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useAnalytics = () => {
  const map = useMap();
  const [state, setState] = useState<AnalyticsState>({
    data: [],
    filteredData: [],
    dateRange: [
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      new Date()
    ],
    selectedCategory: null,
    isLoading: false,
    error: null
  });

  const fetchData = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // Simulated data - replace with actual API call
      const mockData: AnalyticsData[] = Array.from({ length: 100 }, (_, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        type: ['temperature', 'humidity', 'pressure'][Math.floor(Math.random() * 3)],
        value: Math.random() * 100,
        timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
        category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
        location: [
          51.505 + (Math.random() - 0.5) * 0.1,
          -0.09 + (Math.random() - 0.5) * 0.1
        ]
      }));

      setState(prev => ({
        ...prev,
        data: mockData,
        filteredData: mockData,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch data',
        isLoading: false
      }));
    }
  };

  const filterData = () => {
    const { data, dateRange, selectedCategory } = state;
    const filtered = data.filter(item => {
      const itemDate = new Date(item.timestamp);
      const isInDateRange = itemDate >= dateRange[0] && itemDate <= dateRange[1];
      const isInCategory = !selectedCategory || item.category === selectedCategory;
      return isInDateRange && isInCategory;
    });

    setState(prev => ({ ...prev, filteredData: filtered }));
  };

  const updateDateRange = (range: [Date, Date]) => {
    setState(prev => ({ ...prev, dateRange: range }));
  };

  const updateCategory = (category: string | null) => {
    setState(prev => ({ ...prev, selectedCategory: category }));
  };

  const exportData = (format: 'json' | 'csv' = 'json') => {
    const { filteredData } = state;
    let dataStr: string;
    let mimeType: string;
    let fileExtension: string;

    if (format === 'json') {
      dataStr = JSON.stringify(filteredData, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
    } else {
      const headers = ['id', 'type', 'value', 'timestamp', 'category', 'location'];
      const csvRows = [
        headers.join(','),
        ...filteredData.map(item => [
          item.id,
          item.type,
          item.value,
          item.timestamp,
          item.category || '',
          item.location ? item.location.join(',') : ''
        ].join(','))
      ];
      dataStr = csvRows.join('\n');
      mimeType = 'text/csv';
      fileExtension = 'csv';
    }

    const dataUri = `data:${mimeType};charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `analytics-data.${fileExtension}`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getChartData = (type: 'bar' | 'line' | 'pie') => {
    const { filteredData } = state;

    switch (type) {
      case 'bar':
        return filteredData.reduce((acc, item) => {
          const date = new Date(item.timestamp).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = { date, value: 0 };
          }
          acc[date].value += item.value;
          return acc;
        }, {} as Record<string, { date: string; value: number }>);

      case 'line':
        return filteredData
          .sort((a, b) => a.timestamp - b.timestamp)
          .map(item => ({
            date: new Date(item.timestamp).toLocaleTimeString(),
            value: item.value
          }));

      case 'pie':
        return filteredData.reduce((acc, item) => {
          const category = item.category || 'Unknown';
          if (!acc[category]) {
            acc[category] = { name: category, value: 0 };
          }
          acc[category].value += item.value;
          return acc;
        }, {} as Record<string, { name: string; value: number }>);

      default:
        return {};
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [state.dateRange, state.selectedCategory]);

  return {
    ...state,
    updateDateRange,
    updateCategory,
    exportData,
    getChartData,
    refreshData: fetchData
  };
}; 
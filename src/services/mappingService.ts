import { supabase } from '@/lib/supabase';

interface MapData {
  heatmapPoints: Array<[number, number, number]>;
  droneData: Array<{lat: number, lng: number, data: any}>;
  pciData: Array<{lat: number, lng: number, value: number}>;
  geofences: Array<{
    id: number;
    geometry: any;
    name?: string;
    hazard?: boolean;
  }>;
}

export const fetchMapData = async (): Promise<MapData> => {
  try {
    // Fetch heatmap data
    const { data: heatmapData, error: heatmapError } = await supabase
      .from('heatmap_data')
      .select('*');
    if (heatmapError) throw heatmapError;

    // Fetch drone data
    const { data: droneData, error: droneError } = await supabase
      .from('drone_data')
      .select('*');
    if (droneError) throw droneError;

    // Fetch PCI data
    const { data: pciData, error: pciError } = await supabase
      .from('pci_data')
      .select('*');
    if (pciError) throw pciError;

    // Fetch geofences
    const { data: geofenceData, error: geofenceError } = await supabase
      .from('geofences')
      .select('*');
    if (geofenceError) throw geofenceError;

    return {
      heatmapPoints: heatmapData?.map(d => [d.lat, d.lng, d.intensity]) || [],
      droneData: droneData?.map(d => ({lat: d.lat, lng: d.lng, data: d.data})) || [],
      pciData: pciData?.map(d => ({lat: d.lat, lng: d.lng, value: d.value})) || [],
      geofences: geofenceData || []
    };
  } catch (error) {
    console.error('Error fetching map data:', error);
    return {
      heatmapPoints: [],
      droneData: [],
      pciData: [],
      geofences: []
    };
  }
};

export const saveMapView = async (view: { center: [number, number]; zoom: number; layers: string[] }) => {
  try {
    const { error } = await supabase
      .from('map_views')
      .insert([view]);
    if (error) throw error;
  } catch (error) {
    console.error('Error saving map view:', error);
  }
};

export const exportMapData = async (format: 'geojson' | 'csv') => {
  try {
    const { data, error } = await supabase
      .from('map_data')
      .select('*');
    if (error) throw error;

    if (format === 'geojson') {
      return {
        type: 'FeatureCollection',
        features: data.map(d => ({
          type: 'Feature',
          geometry: d.geometry,
          properties: d.properties
        }))
      };
    } else {
      // Convert to CSV format
      return data.map(d => ({
        ...d.properties,
        lat: d.geometry.coordinates[1],
        lng: d.geometry.coordinates[0]
      }));
    }
  } catch (error) {
    console.error('Error exporting map data:', error);
    return null;
  }
};

export const importMapData = async (data: any, format: 'geojson' | 'csv') => {
  try {
    let features;
    if (format === 'geojson') {
      features = data.features.map((f: any) => ({
        geometry: f.geometry,
        properties: f.properties
      }));
    } else {
      features = data.map((d: any) => ({
        geometry: {
          type: 'Point',
          coordinates: [d.lng, d.lat]
        },
        properties: d
      }));
    }

    const { error } = await supabase
      .from('map_data')
      .insert(features);
    if (error) throw error;
  } catch (error) {
    console.error('Error importing map data:', error);
  }
};

export const fetchWeatherData = async (bounds: { north: number; south: number; east: number; west: number }) => {
  try {
    const response = await fetch(`/api/weather?bounds=${JSON.stringify(bounds)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Layer {
  id: string;
  name: string;
  url: string;
  visible: boolean;
}

interface LayersContextType {
  layers: Layer[];
  addLayer: (layer: Omit<Layer, 'id'>) => Promise<void>;
  removeLayer: (id: string) => Promise<void>;
  toggleLayer: (id: string) => void;
}

const LayersContext = createContext<LayersContextType | undefined>(undefined);

export const LayersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layers, setLayers] = useState<Layer[]>([]);

  useEffect(() => {
    supabase.from<Layer>('layers').select('*').then(({ data }) => {
      setLayers(data ?? []);
    });
  }, []);

  const addLayer = async (layer: Omit<Layer, 'id'>) => {
    const { data, error } = await supabase.from<Layer>('layers').insert([{ ...layer }]).single();
    if (data) setLayers(prev => [data, ...prev]);
  };

  const removeLayer = async (id: string) => {
    await supabase.from('layers').delete().eq('id', id);
    setLayers(prev => prev.filter(l => l.id !== id));
  };

  const toggleLayer = (id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  return (
    <LayersContext.Provider value={{ layers, addLayer, removeLayer, toggleLayer }}>
      {children}
    </LayersContext.Provider>
  );
};

export const useLayers = () => {
  const ctx = useContext(LayersContext);
  if (!ctx) throw new Error('useLayers must be used within LayersProvider');
  return ctx;
};

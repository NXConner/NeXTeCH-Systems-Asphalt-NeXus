import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function PCIHeatmapOverlay() {
  const [polygons, setPolygons] = useState<any[]>([]);
  useEffect(() => {
    const fetchPCI = async () => {
      // Replace with real Supabase table/logic
      const { data } = await supabase.from('pci_polygons').select('*');
      setPolygons(data || []);
    };
    fetchPCI();
  }, []);
  const getColor = (score: number) => {
    if (score >= 85) return 'rgba(34,197,94,0.5)';
    if (score >= 70) return 'rgba(253,224,71,0.5)';
    return 'rgba(239,68,68,0.5)';
  };
  return (
    <svg className="absolute inset-0 pointer-events-none z-40 w-full h-full">
      {polygons.map((poly, i) => (
        <polygon
          key={i}
          points={poly.coordinates.map((p: any) => `${p.lng},${p.lat}`).join(' ')}
          fill={getColor(poly.pciScore)}
          stroke="#222"
          strokeWidth={2}
        >
          <title>PCI: {poly.pciScore}</title>
        </polygon>
      ))}
    </svg>
  );
} 
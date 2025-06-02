import { useState } from 'react';

interface PressureWashZoneDrawerProps {
  onPhotoUpload: (type: 'before' | 'after', file: File) => void;
}

const PressureWashZoneDrawer: React.FC<PressureWashZoneDrawerProps> = ({ onPhotoUpload }) => {
  const [dirtyZones, setDirtyZones] = useState<any[]>([]);
  const [cleanZones, setCleanZones] = useState<any[]>([]);
  const [mode, setMode] = useState<'dirty' | 'clean'>('dirty');

  const handleDrawZone = () => {
    const zone = { id: Date.now(), area: Math.random() * 1000, type: mode };
    if (mode === 'dirty') setDirtyZones(z => [...z, zone]);
    else setCleanZones(z => [...z, zone]);
  };

  const totalArea = [...dirtyZones, ...cleanZones].reduce((sum, z) => sum + z.area, 0);
  const cleanedArea = cleanZones.reduce((sum, z) => sum + z.area, 0);
  const dirtyArea = dirtyZones.reduce((sum, z) => sum + z.area, 0);

  return (
    <div className="p-4 border rounded bg-gray-50 mt-4">
      <div className="font-bold mb-2">Pressure Wash Zones</div>
      <div className="flex gap-4 mb-2">
        <button className={`px-3 py-1 rounded ${mode==='dirty'?'bg-red-500':'bg-gray-300'} text-white`} onClick={()=>setMode('dirty')}>Dirty Mode</button>
        <button className={`px-3 py-1 rounded ${mode==='clean'?'bg-green-600':'bg-gray-300'} text-white`} onClick={()=>setMode('clean')}>Clean Mode</button>
        <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={handleDrawZone}>Draw Zone</button>
      </div>
      <div className="flex gap-4 mb-2">
        <label className="block">
          <span className="text-xs">Upload Before Photo</span>
          <input type="file" accept="image/*" className="block" onChange={e => e.target.files && onPhotoUpload('before', e.target.files[0])} />
        </label>
        <label className="block">
          <span className="text-xs">Upload After Photo</span>
          <input type="file" accept="image/*" className="block" onChange={e => e.target.files && onPhotoUpload('after', e.target.files[0])} />
        </label>
      </div>
      <div className="text-xs text-muted-foreground">Dirty Zones: {dirtyZones.length} | Clean Zones: {cleanZones.length}</div>
      <div className="text-xs mt-2">Total Area: {totalArea.toFixed(1)} sq ft | Cleaned: {cleanedArea.toFixed(1)} | Dirty: {dirtyArea.toFixed(1)}</div>
    </div>
  );
};

export default PressureWashZoneDrawer; 
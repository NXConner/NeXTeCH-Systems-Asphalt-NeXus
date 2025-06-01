import React from 'react';

interface PressureWashZoneDrawerProps {
  dirtyZones: any[];
  cleanZones: any[];
  onDrawZone: (zone: any) => void;
  onPhotoUpload: (type: 'before' | 'after', file: File) => void;
}

const PressureWashZoneDrawer: React.FC<PressureWashZoneDrawerProps> = ({ dirtyZones, cleanZones, onDrawZone, onPhotoUpload }) => {
  return (
    <div className="p-4 border rounded bg-gray-50 mt-4">
      <div className="font-bold mb-2">Pressure Wash Zones</div>
      <div className="flex gap-4 mb-2">
        <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => onDrawZone({ type: 'dirty' })}>Draw Dirty Zone</button>
        <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => onDrawZone({ type: 'clean' })}>Draw Clean Zone</button>
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
    </div>
  );
};

export default PressureWashZoneDrawer; 
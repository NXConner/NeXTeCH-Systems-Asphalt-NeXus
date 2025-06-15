import React from 'react';
import { useMap } from '@/contexts/MapContext';
import { usePermissions } from '@/contexts/PermissionsContext';

const DrawToolbar: React.FC = () => {
  const { toolMode, startDraw, startEdit, saveEdits, cancelEdit } = useMap();
  const { hasPermission } = usePermissions();

  return (
    <div className="flex space-x-2 p-2 bg-white shadow rounded">
      {hasPermission('draw_geofence') && (
        <button onClick={startDraw} disabled={toolMode === 'draw'}>Draw Polygon</button>
      )}
      <button onClick={() => startEdit('')} disabled={toolMode === 'edit'}>Edit</button>
      {toolMode === 'edit' && (
        <>
          <button onClick={saveEdits}>Save</button>
          <button onClick={cancelEdit}>Cancel</button>
        </>
      )}
      <button onClick={cancelEdit} disabled={toolMode === 'pan'}>Pan</button>
    </div>
  );
};

export default DrawToolbar;

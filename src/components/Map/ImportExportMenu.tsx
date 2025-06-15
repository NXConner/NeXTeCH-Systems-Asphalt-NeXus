import React from 'react';
import { exportGeoJSON } from '@/utils/exportGeoJSON';
import { importGeoJSON } from '@/utils/importGeoJSON';
import { getGeofences } from '@/services/geofenceService';

const ImportExportMenu: React.FC = () => {
  const handleExport = async () => {
    const geofences = await getGeofences();
    exportGeoJSON({ type: 'FeatureCollection', features: geofences.map(g => g.geojson) });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const geojson = JSON.parse(reader.result as string);
        importGeoJSON(geojson);
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <button onClick={handleExport}>Export GeoJSON</button>
      <input type="file" accept=".geojson,.json" onChange={handleImport} />
    </div>
  );
};

export default ImportExportMenu;

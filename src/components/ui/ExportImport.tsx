import React from 'react';
import { Button } from './button';

export default function ExportImport() {
  const handleExport = () => {
    const data = { jobs: [], vehicles: [], forum: [] }; // Replace with actual data
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.json';
    a.click();
    URL.revokeObjectURL(url);
    console.log('Data exported');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = JSON.parse(event.target?.result as string);
        console.log('Data imported:', data);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleExport} size="sm" aria-label="Export Data">Export Data</Button>
      <input type="file" accept=".json" onChange={handleImport} className="hidden-file-input" id="import" title="Import Data File" />
      <label htmlFor="import">
        <Button size="sm" aria-label="Import Data" type="button">Import Data</Button>
      </label>
    </div>
  );
} 
import React from 'react';
import { saveAs } from 'file-saver';

interface ExportUtilityProps {
  data: any[];
  filename: string;
  availableFields: { key: string; label: string }[];
  type: string;
}

const ExportUtility: React.FC<ExportUtilityProps> = ({ data, filename, availableFields }) => {
  const handleExport = () => {
    if (!data.length || !availableFields.length) return;
    const csv = [
      availableFields.map(f => f.label).join(','),
      ...data.map(row => availableFields.map(f => JSON.stringify(row[f.key] ?? '')).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  };

  if (!data.length || !availableFields.length) {
    return <span className="text-muted-foreground">No data to export</span>;
  }

  return (
    <button onClick={handleExport} className="px-4 py-2 bg-primary text-white rounded">Export CSV</button>
  );
};

export default ExportUtility;
export { ExportUtility }; 
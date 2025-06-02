import React from 'react';

interface LineStripingTemplateLibraryProps {
  onDropTemplate: (template: string) => void;
  selectedArea: any;
}

const templates = [
  { name: 'Parking Stall', svg: <rect width="60" height="360" fill="#fff" stroke="#000" strokeWidth="4" />, paintLF: 18 },
  { name: 'Fire Lane', svg: <rect width="60" height="360" fill="#f00" stroke="#000" strokeWidth="4" />, paintLF: 24 },
  { name: 'Hash Mark', svg: <rect width="60" height="60" fill="#00f" stroke="#000" strokeWidth="4" />, paintLF: 6 },
  { name: 'Crosswalk', svg: <rect width="180" height="60" fill="#fff" stroke="#000" strokeWidth="4" />, paintLF: 36 },
  { name: 'ADA Space', svg: <rect width="80" height="360" fill="#00ffcc" stroke="#000" strokeWidth="4" />, paintLF: 20 },
];

const LineStripingTemplateLibrary: React.FC<LineStripingTemplateLibraryProps> = ({ onDropTemplate, selectedArea }) => {
  const handleDrop = (t: any) => {
    // Snap to selected area and calculate paint volume
    if (selectedArea) {
      const paintGallons = t.paintLF / 320; // 320 LF/gal for 4" lines
      alert(`Dropped ${t.name} on area. Paint needed: ${paintGallons.toFixed(2)} gal`);
    }
    onDropTemplate(t.name);
  };
  return (
    <div className="p-4 border rounded bg-gray-50 mt-4">
      <div className="font-bold mb-2">Line Striping Templates</div>
      <div className="flex gap-4">
        {templates.map(t => (
          <div
            key={t.name}
            draggable
            onDragEnd={() => handleDrop(t)}
            className="flex flex-col items-center cursor-move"
            title={t.name}
          >
            <svg width={60} height={60} viewBox="0 0 60 60">{t.svg}</svg>
            <span className="text-xs mt-1">{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LineStripingTemplateLibrary; 
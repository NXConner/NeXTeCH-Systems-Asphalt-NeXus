import React from 'react';

interface PCIHeatmapOverlayProps {
  pciData?: Array<{ lat: number; lng: number; pci: number }>;
}

const getColor = (pci: number) => {
  if (pci >= 85) return 'rgba(0,200,0,0.5)'; // Excellent
  if (pci >= 55) return 'rgba(255,200,0,0.5)'; // Fair
  return 'rgba(255,0,0,0.5)'; // Poor
};

const PCIHeatmapOverlay: React.FC<PCIHeatmapOverlayProps> = ({ pciData = [] }) => {
  if (!pciData.length) return <div className="text-xs text-muted-foreground">No PCI data available.</div>;
  return (
    <div className="absolute inset-0 pointer-events-none z-40" aria-label="PCI heatmap overlay">
      {pciData.map((point, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${point.lng}%`,
            top: `${point.lat}%`,
            width: 32,
            height: 32,
            background: getColor(point.pci),
            filter: 'blur(8px)',
          }}
          title={`PCI: ${point.pci}`}
          role="img"
          aria-label={`PCI value: ${point.pci} at lat ${point.lat}, lng ${point.lng}`}
        />
      ))}
    </div>
  );
};

export default PCIHeatmapOverlay; 
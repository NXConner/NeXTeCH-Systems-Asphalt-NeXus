import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../ThemeProvider';
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

interface ARProjectionProps {
  type: 'measurement' | 'task' | 'alert' | 'compliance' | 'crack' | 'pci' | 'line' | 'geofence';
  content: string;
  position: { lat: number; lng: number };
  region?: string;
  tooltip?: string;
  overlays?: Array<{
    type: 'crack' | 'pci' | 'compliance';
    content: string;
    position: { lat: number; lng: number };
    tooltip?: string;
    compliant?: boolean;
    pciScore?: number;
  }>;
}

type Theme = 'asphalt-command' | 'light' | 'dark' | 'system';

const ARProjection: React.FC<ARProjectionProps> = ({ type, content, position, region, tooltip, overlays }) => {
  const { theme } = useTheme() as { theme: Theme };
  const projectionRef = useRef<HTMLDivElement>(null);
  const [arSupported, setArSupported] = useState(false);

  useEffect(() => {
    if (Capacitor.getPlatform() !== 'web') {
      setArSupported(true);
      // Simulate AR projection using device camera and GPS
      const projectAR = async () => {
        await Camera.getPhoto({ resultType: 'uri', source: 'camera' });
        await Geolocation.getCurrentPosition();
        // Placeholder for AR rendering logic
        if (projectionRef.current) {
          projectionRef.current.style.transform = `translate(${position.lat}px, ${position.lng}px)`;
        }
      };
      projectAR();
    } else {
      setArSupported(false);
    }
  }, [position]);

  if (!arSupported) {
    return <div className="p-4 bg-yellow-100 text-yellow-800 rounded">AR features coming soon. Please use a supported device.</div>;
  }

  const className =
    theme === 'asphalt-command'
      ? type === 'measurement'
        ? 'ar-projection'
        : type === 'task'
        ? 'task-projection'
        : type === 'alert'
        ? 'alert-projection'
        : type === 'compliance'
        ? 'compliance-projection'
        : type === 'crack'
        ? 'crack-projection'
        : type === 'pci'
        ? 'pci-projection'
        : type === 'line'
        ? 'line-projection'
        : type === 'geofence'
        ? 'geofence-projection'
        : ''
      : '';

  return (
    <div ref={projectionRef} className={className} title={tooltip} style={{ position: 'absolute', left: position.lng, top: position.lat }}>
      {content}
      {overlays && overlays.map((o, i) => (
        <div
          key={i}
          className={`absolute ${o.type}-projection`}
          style={{ left: o.position.lat, top: o.position.lng }}
          title={o.tooltip}
        >
          {o.type === 'pci' && o.pciScore !== undefined ? `PCI: ${o.pciScore}` : o.content}
          {o.type === 'compliance' && o.compliant !== undefined && (
            <span className={`ml-2 ${o.compliant ? 'text-green-600' : 'text-red-600'}`}>{o.compliant ? 'Compliant' : 'Non-compliant'}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ARProjection; 
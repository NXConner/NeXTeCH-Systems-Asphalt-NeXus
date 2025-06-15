import React from 'react';
import { LayerGroup, Circle, Popup } from 'react-leaflet';
import { useMap } from 'react-leaflet';

interface ComplianceData {
  lat: number;
  lng: number;
  status: 'compliant' | 'warning' | 'violation';
  details: {
    type: string;
    description: string;
    lastChecked: string;
    nextCheck: string;
    inspector?: string;
  };
}

const ComplianceOverlay: React.FC = () => {
  const map = useMap();
  const [data, setData] = React.useState<ComplianceData[]>([]);

  React.useEffect(() => {
    // Fetch compliance data based on current map bounds
    const fetchData = async () => {
      const bounds = map.getBounds();
      try {
        const response = await fetch(`/api/compliance?bounds=${JSON.stringify(bounds)}`);
        const newData = await response.json();
        setData(newData);
      } catch (error) {
        console.error('Error fetching compliance data:', error);
      }
    };

    fetchData();
    map.on('moveend', fetchData);

    return () => {
      map.off('moveend', fetchData);
    };
  }, [map]);

  const getColor = (status: ComplianceData['status']) => {
    switch (status) {
      case 'compliant':
        return '#00E676';
      case 'warning':
        return '#FFD600';
      case 'violation':
        return '#D50000';
      default:
        return '#757575';
    }
  };

  return (
    <LayerGroup>
      {data.map((point, index) => (
        <Circle
          key={index}
          center={[point.lat, point.lng]}
          radius={8}
          pathOptions={{
            color: getColor(point.status),
            fillColor: getColor(point.status),
            fillOpacity: 0.7,
            weight: 2
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="text-lg font-semibold mb-2">
                Compliance Status: {point.status.charAt(0).toUpperCase() + point.status.slice(1)}
              </h3>
              <div className="space-y-1">
                <p>Type: {point.details.type}</p>
                <p>Description: {point.details.description}</p>
                <p>Last Checked: {new Date(point.details.lastChecked).toLocaleDateString()}</p>
                <p>Next Check: {new Date(point.details.nextCheck).toLocaleDateString()}</p>
                {point.details.inspector && <p>Inspector: {point.details.inspector}</p>}
              </div>
              <div
                className="w-full h-2 rounded mt-2"
                style={{ backgroundColor: getColor(point.status) }}
              />
            </div>
          </Popup>
        </Circle>
      ))}
    </LayerGroup>
  );
};

export default ComplianceOverlay; 
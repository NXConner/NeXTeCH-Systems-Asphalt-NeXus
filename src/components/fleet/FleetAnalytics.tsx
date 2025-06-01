import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const gpsData = [
  { vehicle: 'Truck 1', miles: 120 },
  { vehicle: 'Truck 2', miles: 90 },
];
const costData = [
  { vehicle: 'Truck 1', cost: 500 },
  { vehicle: 'Truck 2', cost: 350 },
];

export default function FleetAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-bold">GPS/Telematics</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={gpsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vehicle" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="miles" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="font-bold">Cost Tracking</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vehicle" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cost" fill="#f59e42" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 
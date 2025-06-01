import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

const sampleData = [
  { month: 'Jan', value: 120 },
  { month: 'Feb', value: 140 },
  { month: 'Mar', value: 160 },
  { month: 'Apr', value: 180 },
  { month: 'May', value: 200 },
  { month: 'Jun', value: 220 },
];

export default function PredictiveAnalytics() {
  const [scenario, setScenario] = useState('baseline');
  // In real app, scenario would affect data
  return (
    <Card>
      <CardHeader>
        <CardTitle>Predictive Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <button className={`px-3 py-1 rounded ${scenario==='baseline'?'bg-blue-500 text-white':'bg-gray-200'}`} onClick={()=>setScenario('baseline')}>Baseline</button>
          <button className={`px-3 py-1 rounded ${scenario==='growth'?'bg-blue-500 text-white':'bg-gray-200'}`} onClick={()=>setScenario('growth')}>Growth</button>
          <button className={`px-3 py-1 rounded ${scenario==='recession'?'bg-blue-500 text-white':'bg-gray-200'}`} onClick={()=>setScenario('recession')}>Recession</button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 text-muted-foreground text-sm">
          Scenario: <b>{scenario}</b> (trend, forecast, and what-if analysis)
        </div>
      </CardContent>
    </Card>
  );
} 
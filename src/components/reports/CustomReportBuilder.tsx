import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const fields = [
  'Job', 'Revenue', 'Crew', 'Material Usage', 'Customer', 'Date', 'Status', 'Cost'
];

export default function CustomReportBuilder() {
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState('none');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Report Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <input className="mb-2 p-2 border rounded w-full" placeholder="Report Name" value={name} onChange={e=>setName(e.target.value)} />
        <div className="mb-2">Select Fields:</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {fields.map(f => (
            <button key={f} className={`px-2 py-1 rounded border ${selected.includes(f)?'bg-blue-500 text-white':'bg-gray-100'}`} onClick={()=>setSelected(s=>s.includes(f)?s.filter(x=>x!==f):[...s,f])}>{f}</button>
          ))}
        </div>
        <div className="mb-4">
          <label className="mr-2">Schedule:</label>
          <select
            value={schedule}
            onChange={e=>setSchedule(e.target.value)}
            className="border rounded p-1"
            aria-label="Schedule"
            title="Schedule"
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button>Save</Button>
          <Button variant="outline">Export CSV</Button>
          <Button variant="outline">Export PDF</Button>
          <Button variant="outline">Export Excel</Button>
        </div>
      </CardContent>
    </Card>
  );
} 
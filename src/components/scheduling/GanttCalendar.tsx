import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const tasks = [
  { id: 1, name: 'Sealcoating', start: '2024-06-01', end: '2024-06-03', dependsOn: null },
  { id: 2, name: 'Paving', start: '2024-06-04', end: '2024-06-06', dependsOn: 1 },
];

export default function GanttCalendar() {
  const [selected, setSelected] = useState<number|null>(null);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gantt/Calendar View</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="mb-4">
          {tasks.map(t => (
            <li key={t.id} className="mb-2">
              <span className="font-bold">{t.name}</span> ({t.start} - {t.end})
              {t.dependsOn && <span className="ml-2 text-xs text-gray-500">Depends on #{t.dependsOn}</span>}
              <Button size="sm" className="ml-2" onClick={()=>setSelected(t.id)}>Select</Button>
            </li>
          ))}
        </ul>
        {selected && <div className="mt-2">Task #{selected} selected. Drag-and-drop and notifications coming soon.</div>}
      </CardContent>
    </Card>
  );
} 
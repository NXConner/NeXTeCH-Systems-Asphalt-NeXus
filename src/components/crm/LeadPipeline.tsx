import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
const initialLeads = [
  { id: 1, name: 'Acme Corp', stage: 'New' },
  { id: 2, name: 'Smith Paving', stage: 'Contacted' },
];

export default function LeadPipeline() {
  const [leads, setLeads] = useState(initialLeads);
  const moveLead = (id: number, dir: 1 | -1) => {
    setLeads(ls => ls.map(l => {
      const idx = stages.indexOf(l.stage);
      if (l.id === id && idx + dir >= 0 && idx + dir < stages.length) {
        return { ...l, stage: stages[idx + dir] };
      }
      return l;
    }));
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          {stages.map(stage => (
            <div key={stage} className="flex-1">
              <div className="font-bold mb-2">{stage}</div>
              {leads.filter(l => l.stage === stage).map(l => (
                <div key={l.id} className="mb-2 p-2 bg-gray-100 rounded flex items-center justify-between">
                  <span>{l.name}</span>
                  <div className="flex gap-1">
                    <Button size="sm" onClick={()=>moveLead(l.id, -1)} disabled={stages.indexOf(l.stage)===0}>{'<'}</Button>
                    <Button size="sm" onClick={()=>moveLead(l.id, 1)} disabled={stages.indexOf(l.stage)===stages.length-1}>{'>'}</Button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
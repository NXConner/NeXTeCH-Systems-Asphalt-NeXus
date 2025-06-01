import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const reports = [
  { id: 1, name: 'OSHA Safety', date: '2024-06-01' },
  { id: 2, name: 'EPA Compliance', date: '2024-05-15' },
];

export default function ComplianceReport() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance & Safety Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="mb-4">
          {reports.map(r => (
            <li key={r.id}>{r.name} ({r.date})</li>
          ))}
        </ul>
        <Button title="Export PDF">Export PDF</Button>
        <Button variant="outline" className="ml-2" title="Export CSV">Export CSV</Button>
      </CardContent>
    </Card>
  );
} 
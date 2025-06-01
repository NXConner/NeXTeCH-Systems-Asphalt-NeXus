import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mockPayroll = [
  { id: 1, period: '2024-05-01 to 2024-05-15', total: 12000, status: 'Completed' },
  { id: 2, period: '2024-04-16 to 2024-04-30', total: 11800, status: 'Completed' },
  { id: 3, period: '2024-04-01 to 2024-04-15', total: 11750, status: 'Completed' },
];

export default function PayrollDashboard() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Payroll Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button className="w-full">Run Payroll</Button>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Recent Payroll Runs</h3>
            <ul className="space-y-2">
              {mockPayroll.map(run => (
                <li key={run.id} className="border rounded p-2 flex justify-between items-center">
                  <span>{run.period}</span>
                  <span>${run.total.toLocaleString()}</span>
                  <span className="text-green-600">{run.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
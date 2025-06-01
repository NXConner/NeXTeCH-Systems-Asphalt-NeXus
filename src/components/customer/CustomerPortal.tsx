import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const jobs = [
  { id: 1, name: 'Sealcoating - Main St', status: 'In Progress' },
  { id: 2, name: 'Paving - Oak Ave', status: 'Completed' },
];
const estimates = [
  { id: 1, desc: 'Sealcoating', amount: 1200 },
];
const invoices = [
  { id: 1, desc: 'Sealcoating', amount: 1200, paid: false },
];

export default function CustomerPortal() {
  const [feedback, setFeedback] = useState('');
  const [file, setFile] = useState<File|null>(null);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Portal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-bold">Jobs</h3>
          <ul>{jobs.map(j=>(<li key={j.id}>{j.name} - {j.status}</li>))}</ul>
        </div>
        <div className="mb-4">
          <h3 className="font-bold">Estimates</h3>
          <ul>{estimates.map(e=>(<li key={e.id}>{e.desc} - ${e.amount}</li>))}</ul>
        </div>
        <div className="mb-4">
          <h3 className="font-bold">Invoices</h3>
          <ul>{invoices.map(i=>(<li key={i.id}>{i.desc} - ${i.amount} - {i.paid?'Paid':'Unpaid'}</li>))}</ul>
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="upload-doc">Upload Document:</label>
          <input id="upload-doc" type="file" title="Upload document" onChange={e=>setFile(e.target.files?.[0]||null)} />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="feedback">Feedback/Rating:</label>
          <textarea id="feedback" className="w-full border rounded p-2" value={feedback} onChange={e=>setFeedback(e.target.value)} title="Feedback or rating" placeholder="Enter your feedback or rating here" />
          <Button className="mt-2">Submit Feedback</Button>
        </div>
      </CardContent>
    </Card>
  );
} 
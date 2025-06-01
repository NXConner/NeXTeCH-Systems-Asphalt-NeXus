import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const jobs = [
  { id: 1, status: 'In Progress', invoiceApproved: false },
  { id: 2, status: 'Completed', invoiceApproved: true },
  // ...add more as needed
];

export default function CustomerPortal() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Portal</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {jobs.map(job => (
            <li key={job.id} className="flex justify-between items-center">
              <span>Job #{job.id} - {job.status}</span>
              <span className={job.invoiceApproved ? 'text-green-600' : 'text-yellow-600'}>
                {job.invoiceApproved ? 'Invoice Approved' : 'Pending Approval'}
              </span>
            </li>
          ))}
        </ul>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Leave Feedback</button>
      </CardContent>
    </Card>
  );
} 
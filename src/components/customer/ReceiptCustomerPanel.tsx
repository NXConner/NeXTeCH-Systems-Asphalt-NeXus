import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export default function ReceiptCustomerPanel() {
  const [receipt, setReceipt] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receipt Upload (Customer)</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-green-600">Receipt uploaded!</div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-2">
            <label htmlFor="receipt-upload-customer" className="sr-only">Upload receipt file</label>
            <input
              id="receipt-upload-customer"
              type="file"
              accept="image/*,application/pdf"
              onChange={e => setReceipt(e.target.files?.[0] || null)}
              className="border rounded px-2 py-1 w-full"
              title="Upload receipt file"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload Receipt</button>
          </form>
        )}
      </CardContent>
    </Card>
  );
} 
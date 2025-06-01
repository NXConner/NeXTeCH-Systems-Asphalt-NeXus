import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ReceiptUpload() {
  const [image, setImage] = useState<string | null>(null);
  const [fields, setFields] = useState({
    date: '',
    amount: '',
    vendor: '',
    category: '',
  });
  const [extracted, setExtracted] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setImage(ev.target?.result as string);
        // Mock extraction
        setFields({
          date: '2024-05-20',
          amount: '123.45',
          vendor: 'Acme Supplies',
          category: 'Materials',
        });
        setExtracted(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Receipt Upload & Auto-Extract</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="receipt-photo">Take/Upload Photo</Label>
            <Input id="receipt-photo" type="file" accept="image/*" capture="environment" onChange={handleFile} />
          </div>
          {image && (
            <div className="mb-4">
              <img src={image} alt="Receipt preview" className="max-h-48 rounded border" />
            </div>
          )}
          {extracted && (
            <form className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" value={fields.date} onChange={e => setFields(f => ({ ...f, date: e.target.value }))} />
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" value={fields.amount} onChange={e => setFields(f => ({ ...f, amount: e.target.value }))} />
              <Label htmlFor="vendor">Vendor</Label>
              <Input id="vendor" value={fields.vendor} onChange={e => setFields(f => ({ ...f, vendor: e.target.value }))} />
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={fields.category} onChange={e => setFields(f => ({ ...f, category: e.target.value }))} />
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
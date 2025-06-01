import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function QuickAdd() {
  const [type, setType] = useState('job');
  const [value, setValue] = useState('');
  return (
    <div className="p-4 border rounded">
      <select value={type} onChange={e=>setType(e.target.value)} className="border rounded p-1 mr-2" title="Select type" aria-label="Select type">
        <option value="job">Job</option>
        <option value="customer">Customer</option>
        <option value="note">Note</option>
      </select>
      <input className="border rounded p-1 mr-2" value={value} onChange={e=>setValue(e.target.value)} placeholder={`Add new ${type}`} />
      <Button>Add</Button>
    </div>
  );
} 
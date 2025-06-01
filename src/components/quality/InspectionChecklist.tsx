import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const checklist = [
  { id: 1, item: 'Surface Cleaned', checked: false },
  { id: 2, item: 'Cracks Filled', checked: false },
  { id: 3, item: 'Sealant Applied', checked: false },
];

export default function InspectionChecklist() {
  const [items, setItems] = useState(checklist);
  const [photo, setPhoto] = useState<File|null>(null);
  const [warranty, setWarranty] = useState('');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inspection Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="mb-4">
          {items.map((c, i) => (
            <li key={c.id} className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked={c.checked} onChange={()=>setItems(items=>items.map((it,j)=>j===i?{...it,checked:!it.checked}:it))} title={c.item} aria-label={c.item} />
              {c.item}
            </li>
          ))}
        </ul>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="photo-upload">Photo Documentation:</label>
          <input id="photo-upload" type="file" accept="image/*" title="Upload inspection photo" onChange={e=>setPhoto(e.target.files?.[0]||null)} />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="warranty">Warranty Tracking:</label>
          <input id="warranty" className="border rounded p-2 w-full" value={warranty} onChange={e=>setWarranty(e.target.value)} title="Warranty info" placeholder="Enter warranty info" />
        </div>
        <Button>Save Checklist</Button>
      </CardContent>
    </Card>
  );
} 
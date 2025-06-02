import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInspectionChecklists } from '@/hooks/useInspectionChecklists';
import { toast } from 'sonner';

export default function InspectionChecklist({ employeeId = 'emp-1', jobId = null }) {
  const { checklists, isLoading, error, addChecklist } = useInspectionChecklists(employeeId);
  const [items, setItems] = useState([]);
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
        <Button onClick={async () => {
          try {
            await addChecklist.mutateAsync({
              date: new Date().toISOString().split('T')[0],
              employee_id: employeeId,
              job_id: jobId,
              items,
              photo_url: photo ? photo.name : '',
              warranty,
              notes: '',
            });
            setItems([]);
            setPhoto(null);
            setWarranty('');
            toast.success('Inspection checklist saved!');
          } catch (e) {
            toast.error('Failed to save checklist');
          }
        }}>Save Checklist</Button>
      </CardContent>
    </Card>
  );
} 
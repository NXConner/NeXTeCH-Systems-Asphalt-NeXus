import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const docs = [
  { id: 1, name: 'Contract #1', type: 'Contract' },
  { id: 2, name: 'Estimate #2', type: 'Estimate' },
];

export default function ESignatureWorkflow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState<number|null>(null);
  const clear = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, 300, 100);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>E-Signature Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="font-bold mb-2">Documents</div>
          <ul>{docs.map(d=>(<li key={d.id}><button className={`underline ${selected===d.id?'font-bold':''}`} onClick={()=>setSelected(d.id)}>{d.name} ({d.type})</button></li>))}</ul>
        </div>
        {selected && (
          <div className="mb-4">
            <div className="mb-2">Sign below:</div>
            <canvas ref={canvasRef} width={300} height={100} className="border" style={{background:'#fff'}} />
            <div className="mt-2 flex gap-2">
              <Button onClick={clear}>Clear</Button>
              <Button>Save Signature</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
import CustomerContractManager from '@/components/contracts/CustomerContractManager';
import { useState } from 'react';
import { PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer';
import SignatureCanvas from 'react-signature-canvas';
import { supabase } from '@/integrations/supabase/client';

// TODO: Implement digital contract builder and e-signature capture. Feature coming soon.
const ContractBuilder = () => {
  const [contractText, setContractText] = useState('');
  const [signature, setSignature] = useState<string | null>(null);
  const [sigPad, setSigPad] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // 1. Import PDF renderer only if available
  let PDFDownloadLink: any = null, Document: any = null, Page: any = null, Text: any = null;
  try {
    ({ PDFDownloadLink, Document, Page, Text } = require('@react-pdf/renderer'));
  } catch {}

  const handleSave = async () => {
    setSaving(true);
    // Save contract and signature to Supabase (use correct schema)
    await supabase.from('contracts').insert({ content: contractText, signed: !!signature });
    setSaving(false);
  };

  const ContractDoc = () => (
    <Document>
      <Page>
        <Text>{contractText}</Text>
        {signature && <Text>Signed</Text>}
      </Page>
    </Document>
  );

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-bold mb-2">Digital Contract Builder</h2>
      <textarea value={contractText} onChange={e => setContractText(e.target.value)} className="w-full h-32 mb-2 border rounded" placeholder="Enter contract text..." />
      <div className="mb-2">
        <SignatureCanvas penColor="black" canvasProps={{ width: 500, height: 100, className: 'border' }} ref={setSigPad} onEnd={() => setSignature(sigPad?.getTrimmedCanvas().toDataURL('image/png'))} />
        <button onClick={() => sigPad?.clear()} className="btn btn-secondary ml-2">Clear</button>
      </div>
      <button onClick={handleSave} className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Contract'}</button>
      {PDFDownloadLink && Document && Page && Text ? (
        <PDFDownloadLink document={<Document><Page><Text>{contractText}</Text>{signature && <Text>Signed</Text>}</Page></Document>} fileName="contract.pdf">
          {({ loading }: any) => (loading ? 'Generating PDF...' : 'Download PDF')}
        </PDFDownloadLink>
      ) : (
        <div className="text-red-500 mt-2">PDF download not available</div>
      )}
    </div>
  );
};

export default function Contracts() {
  return <ContractBuilder />;
} 
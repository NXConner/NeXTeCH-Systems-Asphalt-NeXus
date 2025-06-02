import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import jszip from 'jszip';
import { saveAs } from 'file-saver';

export default function TaxSummary() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      // Replace with real Supabase queries for estimates, invoices, expenses
      const { data: estimates } = await supabase.from('estimates').select('*');
      const { data: invoices } = await supabase.from('invoices').select('*');
      const { data: expenses } = await supabase.from('expenses').select('*');
      setSummary({ estimates, invoices, expenses });
      setLoading(false);
    };
    fetchSummary();
  }, []);

  const exportCSV = () => {
    if (!summary) return;
    let csv = 'Type,Date,Amount\n';
    summary.estimates?.forEach((e: any) => csv += `Estimate,${e.date},${e.amount}\n`);
    summary.invoices?.forEach((i: any) => csv += `Invoice,${i.date},${i.amount}\n`);
    summary.expenses?.forEach((x: any) => csv += `Expense,${x.date},${x.amount}\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'tax-summary.csv');
  };

  if (loading) return <div>Loading tax summary...</div>;
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Tax Summary</h1>
      <div className="mb-4">Estimates: {summary.estimates?.length || 0} | Invoices: {summary.invoices?.length || 0} | Expenses: {summary.expenses?.length || 0}</div>
      <Button onClick={exportCSV}>Export CSV</Button>
      {/* Add PDF export and detailed breakdown as needed */}
    </div>
  );
} 
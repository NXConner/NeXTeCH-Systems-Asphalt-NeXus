import ReceiptManager from '@/components/receipts/ReceiptManager';

// TODO: Implement receipt upload and expense tracking. Feature coming soon.
export default function Receipts() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Receipts & Expenses</h1>
      <ReceiptManager />
    </div>
  );
} 
import CustomerContractManager from '@/components/contracts/CustomerContractManager';

// TODO: Implement digital contract builder and e-signature capture. Feature coming soon.
export default function Contracts() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Contracts & E-Signatures</h1>
      <CustomerContractManager />
    </div>
  );
} 
import React, { useEffect, useState } from 'react';
import { fetchCustomerContracts } from '@/services/contractService';

export const CustomerContractManager = () => {
  const [contracts, setContracts] = useState([]);
  useEffect(() => {
    fetchCustomerContracts().then(setContracts);
  }, []);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Customer Contracts</h2>
      <ul>
        {contracts.map((c: any) => (
          <li key={c.id}>{c.customerName} - {c.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerContractManager; 
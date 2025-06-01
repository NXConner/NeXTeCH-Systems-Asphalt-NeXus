import { useState, useEffect } from 'react';
import { fetchReceipts } from '@/services/receiptService';

export function useReceipts() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchReceipts()
      .then(setReceipts)
      .finally(() => setLoading(false));
  }, []);

  return { receipts, loading };
} 
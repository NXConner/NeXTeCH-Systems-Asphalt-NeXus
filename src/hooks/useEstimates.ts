import { useState, useEffect } from 'react';
import { fetchEstimateActions } from '@/services/estimateService';

export function useEstimates() {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchEstimateActions()
      .then(setEstimates)
      .finally(() => setLoading(false));
  }, []);

  return { estimates, loading };
} 
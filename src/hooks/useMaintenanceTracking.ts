import { useState, useEffect } from 'react';
import { fetchMaintenanceItems } from '@/services/maintenanceService';

export function useMaintenanceTracking() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMaintenanceItems()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return { items, loading };
} 
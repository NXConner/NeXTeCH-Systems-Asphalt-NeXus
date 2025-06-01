import { useState, useEffect } from 'react';
import { fetchTimeEntries, fetchTimeSummary } from '@/services/timeTrackingService';

export function useTimeTracking() {
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTimeEntries(), fetchTimeSummary()])
      .then(([e, s]) => {
        setEntries(e);
        setSummary(s);
      })
      .finally(() => setLoading(false));
  }, []);

  return { entries, summary, loading };
} 
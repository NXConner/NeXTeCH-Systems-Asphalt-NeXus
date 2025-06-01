import React, { useEffect, useState } from 'react';
import { fetchEstimateFollowUps } from '@/services/estimateService';

export const EstimateFollowUp = () => {
  const [followUps, setFollowUps] = useState([]);
  useEffect(() => {
    fetchEstimateFollowUps().then(setFollowUps);
  }, []);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Estimate Follow Up</h2>
      <ul>
        {followUps.map((f: any) => (
          <li key={f.id}>{f.status} - {f.date}</li>
        ))}
      </ul>
    </div>
  );
};

export default EstimateFollowUp; 
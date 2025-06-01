import React, { useEffect, useState } from 'react';
import { fetchEstimateActions } from '@/services/estimateService';

export const EstimateActions = () => {
  const [actions, setActions] = useState([]);
  useEffect(() => {
    fetchEstimateActions().then(setActions);
  }, []);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Estimate Actions</h2>
      <ul>
        {actions.map((a: any) => (
          <li key={a.id}>{a.label}</li>
        ))}
      </ul>
    </div>
  );
};

export default EstimateActions; 
import React, { useEffect, useState } from 'react';
import { fetchResources } from '@/services/resourceService';

export const ResourceAllocation = () => {
  const [resources, setResources] = useState([]);
  useEffect(() => {
    fetchResources().then(setResources);
  }, []);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Resource Allocation</h2>
      <ul>
        {resources.map((r: any) => (
          <li key={r.id}>{r.name} - {r.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default ResourceAllocation; 
import React from 'react';
import { useCostData } from '../../hooks/useCostData';

const CostManagementCenter: React.FC = () => {
  const { costData } = useCostData();

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default CostManagementCenter;
export { CostManagementCenter }; 
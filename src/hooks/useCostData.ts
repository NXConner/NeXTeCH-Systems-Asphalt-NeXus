import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CostData {
  id: string;
  item_type: 'material' | 'supply' | 'fuel' | 'labor';
  item_name: string;
  current_price: number;
  price_with_tax: number;
  unit: string;
  location_state: string;
  last_updated: string;
}

interface LinkedCostData {
  jobId?: string;
  employeeId?: string;
  vehicleId?: string;
  costs: CostData[];
  totalCost: number;
}

export const useCostData = () => {
  const queryClient = useQueryClient();

  const { data: costData = [], isLoading, error } = useQuery({
    queryKey: ['cost-data'],
    queryFn: async () => {
      const { data, error } = await supabase.from('cost_data').select('*');
      if (error) throw error;
      return data;
    }
  });

  // Add/Update/Delete mutations can be added here as needed

  const getCostByType = (type: string) => {
    return costData.filter((item: any) => item.item_type === type);
  };

  const getCostByName = (name: string) => {
    return costData.find((item: any) => item.item_name.toLowerCase().includes(name.toLowerCase()));
  };

  const linkCostsToJob = (jobId: string, costs: CostData[]) => {
    const totalCost = costs.reduce((sum, cost) => sum + cost.price_with_tax, 0);
    queryClient.setQueryData(['linked-data'], (prevData: Map<string, LinkedCostData> | undefined) => {
      if (prevData) {
        return new Map(prevData.set(jobId, { jobId, costs, totalCost }));
      }
      return new Map();
    });
  };

  const linkCostsToEmployee = (employeeId: string, costs: CostData[]) => {
    const totalCost = costs.reduce((sum, cost) => sum + cost.price_with_tax, 0);
    queryClient.setQueryData(['linked-data'], (prevData: Map<string, LinkedCostData> | undefined) => {
      if (prevData) {
        return new Map(prevData.set(`employee-${employeeId}`, { employeeId, costs, totalCost }));
      }
      return new Map();
    });
  };

  const linkCostsToVehicle = (vehicleId: string, costs: CostData[]) => {
    const totalCost = costs.reduce((sum, cost) => sum + cost.price_with_tax, 0);
    queryClient.setQueryData(['linked-data'], (prevData: Map<string, LinkedCostData> | undefined) => {
      if (prevData) {
        return new Map(prevData.set(`vehicle-${vehicleId}`, { vehicleId, costs, totalCost }));
      }
      return new Map();
    });
  };

  const getLinkedCosts = (id: string): LinkedCostData | undefined => {
    return queryClient.getQueryData(['linked-data'])?.get(id) || queryClient.getQueryData(['linked-data'])?.get(`employee-${id}`) || queryClient.getQueryData(['linked-data'])?.get(`vehicle-${id}`);
  };

  const calculateJobCost = (materialCosts: number, laborHours: number, fuelConsumption: number) => {
    const laborCost = getCostByName('Crew Leader')?.price_with_tax || 29.50;
    const fuelCost = getCostByName('Diesel Fuel')?.price_with_tax || 4.13;
    
    const totalLaborCost = laborHours * laborCost;
    const totalFuelCost = fuelConsumption * fuelCost;
    const totalCost = materialCosts + totalLaborCost + totalFuelCost;

    return {
      materialCosts,
      laborCost: totalLaborCost,
      fuelCost: totalFuelCost,
      totalCost,
      breakdown: {
        laborHours,
        laborRate: laborCost,
        fuelGallons: fuelConsumption,
        fuelRate: fuelCost
      }
    };
  };

  return {
    costData,
    isLoading,
    error,
    getCostByType,
    getCostByName,
    linkCostsToJob,
    linkCostsToEmployee,
    linkCostsToVehicle,
    getLinkedCosts,
    calculateJobCost
  };
};

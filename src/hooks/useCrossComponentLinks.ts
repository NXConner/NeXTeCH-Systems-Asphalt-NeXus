
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export interface ComponentLink {
  type: 'vehicle' | 'driver' | 'job' | 'maintenance' | 'estimate' | 'invoice';
  id: string;
  context?: Record<string, any>;
}

export const useCrossComponentLinks = () => {
  const navigate = useNavigate();

  const navigateToComponent = useCallback((link: ComponentLink) => {
    const { type, id, context } = link;
    
    const routes = {
      vehicle: `/fleet?selected=${id}`,
      driver: `/fleet?tab=management&driver=${id}`,
      job: `/jobs?selected=${id}`,
      maintenance: `/maintenance?selected=${id}`,
      estimate: `/estimates?selected=${id}`,
      invoice: `/invoices?selected=${id}`
    };

    const basePath = routes[type];
    if (!basePath) {
      console.warn(`Unknown component type: ${type}`);
      return;
    }

    // Add context parameters if provided
    let fullPath = basePath;
    if (context) {
      const contextParams = new URLSearchParams();
      Object.entries(context).forEach(([key, value]) => {
        contextParams.append(key, String(value));
      });
      const separator = basePath.includes('?') ? '&' : '?';
      fullPath = `${basePath}${separator}${contextParams.toString()}`;
    }

    navigate(fullPath);
  }, [navigate]);

  const linkToVehicle = useCallback((vehicleId: string, context?: Record<string, any>) => {
    navigateToComponent({ type: 'vehicle', id: vehicleId, context });
  }, [navigateToComponent]);

  const linkToDriver = useCallback((driverId: string, context?: Record<string, any>) => {
    navigateToComponent({ type: 'driver', id: driverId, context });
  }, [navigateToComponent]);

  const linkToJob = useCallback((jobId: string, context?: Record<string, any>) => {
    navigateToComponent({ type: 'job', id: jobId, context });
  }, [navigateToComponent]);

  const linkToMaintenance = useCallback((maintenanceId: string, context?: Record<string, any>) => {
    navigateToComponent({ type: 'maintenance', id: maintenanceId, context });
  }, [navigateToComponent]);

  const linkToEstimate = useCallback((estimateId: string, context?: Record<string, any>) => {
    navigateToComponent({ type: 'estimate', id: estimateId, context });
  }, [navigateToComponent]);

  const linkToInvoice = useCallback((invoiceId: string, context?: Record<string, any>) => {
    navigateToComponent({ type: 'invoice', id: invoiceId, context });
  }, [navigateToComponent]);

  return {
    navigateToComponent,
    linkToVehicle,
    linkToDriver,
    linkToJob,
    linkToMaintenance,
    linkToEstimate,
    linkToInvoice
  };
};

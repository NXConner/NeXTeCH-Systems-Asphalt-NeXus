import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type VehicleDocument = Database['public']['Tables']['vehicle_documents']['Row'];
type VehicleDocumentInsert = Database['public']['Tables']['vehicle_documents']['Insert'];
type VehicleDocumentUpdate = Database['public']['Tables']['vehicle_documents']['Update'];

export const useVehicleDocuments = (vehicleId: string) => {
  const queryClient = useQueryClient();

  // Vehicle Documents
  const { data: documents = [], isLoading, error } = useQuery({
    queryKey: ['vehicle-documents', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_documents')
        .select('*')
        .eq('vehicle_id', vehicleId);
      if (error) throw error;
      return data as VehicleDocument[];
    }
  });

  // Add Document
  const addDocument = useMutation({
    mutationFn: async (document: VehicleDocumentInsert) => {
      const { data, error } = await supabase
        .from('vehicle_documents')
        .insert(document)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicle-documents', vehicleId] })
  });

  // Update Document
  const updateDocument = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: VehicleDocumentUpdate }) => {
      const { data, error } = await supabase
        .from('vehicle_documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicle-documents', vehicleId] })
  });

  // Get Expiring Documents
  const getExpiringDocuments = (daysThreshold: number = 30) => {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);
    
    return documents.filter(doc => {
      if (!doc.expiry_date) return false;
      const expiryDate = new Date(doc.expiry_date);
      return expiryDate <= thresholdDate && expiryDate >= now;
    });
  };

  // Get Expired Documents
  const getExpiredDocuments = () => {
    const now = new Date();
    return documents.filter(doc => {
      if (!doc.expiry_date) return false;
      const expiryDate = new Date(doc.expiry_date);
      return expiryDate < now;
    });
  };

  return {
    documents,
    isLoading,
    error,
    addDocument,
    updateDocument,
    getExpiringDocuments,
    getExpiredDocuments
  };
}; 
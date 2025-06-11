import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type VehiclePhoto = Database['public']['Tables']['vehicle_photos']['Row'];
type VehiclePhotoInsert = Database['public']['Tables']['vehicle_photos']['Insert'];
type VehiclePhotoUpdate = Database['public']['Tables']['vehicle_photos']['Update'];

export const useVehiclePhotos = (vehicleId: string) => {
  const queryClient = useQueryClient();

  // Vehicle Photos
  const { data: photos = [], isLoading, error } = useQuery({
    queryKey: ['vehicle-photos', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_photos')
        .select('*')
        .eq('vehicle_id', vehicleId);
      if (error) throw error;
      return data as VehiclePhoto[];
    }
  });

  // Add Photo
  const addPhoto = useMutation({
    mutationFn: async (photo: VehiclePhotoInsert) => {
      const { data, error } = await supabase
        .from('vehicle_photos')
        .insert(photo)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicle-photos', vehicleId] })
  });

  // Update Photo
  const updatePhoto = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: VehiclePhotoUpdate }) => {
      const { data, error } = await supabase
        .from('vehicle_photos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicle-photos', vehicleId] })
  });

  // Delete Photo
  const deletePhoto = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vehicle_photos')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicle-photos', vehicleId] })
  });

  // Get Photos by Type
  const getPhotosByType = (type: string) => {
    return photos.filter(photo => photo.photo_type === type);
  };

  return {
    photos,
    isLoading,
    error,
    addPhoto,
    updatePhoto,
    deletePhoto,
    getPhotosByType
  };
}; 
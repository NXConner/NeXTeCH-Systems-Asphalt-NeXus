import { getSupabaseClient } from '@/integrations/supabase/client';
import { logger } from '@/services/logger';
import { cache } from '@/services/cache';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const CACHE_KEY = 'active_geofences';

export interface Geofence {
  id: string;
  geojson: any;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_active?: boolean;
}

export const getGeofences = async (retryCount = 0): Promise<Geofence[]> => {
  try {
    // Check cache first
    const cachedGeofences = cache.get(CACHE_KEY);
    if (cachedGeofences) {
      return cachedGeofences;
    }

    const supabase = getSupabaseClient();
    const response = await supabase
      .from('geofences')
      .select('*')
      .eq('is_active', true)
      .throwOnError();

    if (!response.data) {
      throw new Error('No data returned from Supabase');
    }

    // Cache the results
    cache.set(CACHE_KEY, response.data, CACHE_TTL);
    return response.data;
  } catch (error: any) {
    logger.error('Error fetching geofences:', error);
    
    // Handle specific error cases
    if (error.code === '42P01') {
      logger.warn('Geofences table not found, returning empty array');
      return [];
    }
    
    // Retry on network errors
    if ((error instanceof TypeError || error.message?.includes('network')) && retryCount < MAX_RETRIES) {
      logger.info(`Retrying geofence fetch (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      return getGeofences(retryCount + 1);
    }
    
    return [];
  }
};

export const createGeofence = async (geojson: any): Promise<Geofence | null> => {
  try {
    const supabase = getSupabaseClient();
    const response = await supabase
      .from('geofences')
      .insert([{ geojson, is_active: true }])
      .select()
      .single()
      .throwOnError();

    // Invalidate cache on successful creation
    cache.delete(CACHE_KEY);
    return response.data;
  } catch (error: any) {
    logger.error('Error creating geofence:', error);
    if (error.code === '42P01') {
      logger.warn('Geofences table not found, cannot create geofence');
      return null;
    }
    return null;
  }
};

export const updateGeofence = async (id: string, geojson: any): Promise<Geofence | null> => {
  try {
    const supabase = getSupabaseClient();
    const response = await supabase
      .from('geofences')
      .update({ geojson })
      .eq('id', id)
      .select()
      .single()
      .throwOnError();

    // Invalidate cache on successful update
    cache.delete(CACHE_KEY);
    return response.data;
  } catch (error: any) {
    logger.error('Error updating geofence:', error);
    if (error.code === '42P01') {
      logger.warn('Geofences table not found, cannot update geofence');
      return null;
    }
    return null;
  }
};

export const deleteGeofence = async (id: string): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient();
    await supabase
      .from('geofences')
      .delete()
      .eq('id', id)
      .throwOnError();

    // Invalidate cache on successful deletion
    cache.delete(CACHE_KEY);
    return true;
  } catch (error: any) {
    logger.error('Error deleting geofence:', error);
    if (error.code === '42P01') {
      logger.warn('Geofences table not found, cannot delete geofence');
      return false;
    }
    return false;
  }
};

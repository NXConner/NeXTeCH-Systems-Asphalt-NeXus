import { getSupabaseClient } from '@/integrations/supabase/client';
import { logger } from '@/services/logger';
import { cache } from '@/services/cache';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const ACTIVE_LAYERS_CACHE_KEY = 'active_layers';
const ALL_LAYERS_CACHE_KEY = 'all_layers';

export interface Layer {
  id: string;
  name: string;
  description?: string;
  type: string;
  data: any;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_active: boolean;
  metadata?: any;
}

export const getLayers = async (activeOnly = true, retryCount = 0): Promise<Layer[]> => {
  try {
    // Check cache first
    const cacheKey = activeOnly ? ACTIVE_LAYERS_CACHE_KEY : ALL_LAYERS_CACHE_KEY;
    const cachedLayers = cache.get(cacheKey);
    if (cachedLayers) {
      return cachedLayers;
    }

    const supabase = getSupabaseClient();
    let query = supabase.from('layers').select('*');
    
    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const response = await query.throwOnError();

    if (!response.data) {
      throw new Error('No data returned from Supabase');
    }

    // Cache the results
    cache.set(cacheKey, response.data, CACHE_TTL);
    return response.data;
  } catch (error: any) {
    logger.error('Error fetching layers:', error);
    
    // Handle specific error cases
    if (error.code === '42P01') {
      logger.warn('Layers table not found, returning empty array');
      return [];
    }
    
    // Retry on network errors
    if ((error instanceof TypeError || error.message?.includes('network')) && retryCount < MAX_RETRIES) {
      logger.info(`Retrying layers fetch (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      return getLayers(activeOnly, retryCount + 1);
    }
    
    return [];
  }
};

export const createLayer = async (layer: Omit<Layer, 'id' | 'created_at' | 'updated_at'>): Promise<Layer | null> => {
  try {
    const supabase = getSupabaseClient();
    const response = await supabase
      .from('layers')
      .insert([layer])
      .select()
      .single()
      .throwOnError();

    // Invalidate both caches
    cache.delete(ACTIVE_LAYERS_CACHE_KEY);
    cache.delete(ALL_LAYERS_CACHE_KEY);
    return response.data;
  } catch (error: any) {
    logger.error('Error creating layer:', error);
    if (error.code === '42P01') {
      logger.warn('Layers table not found, cannot create layer');
      return null;
    }
    return null;
  }
};

export const updateLayer = async (id: string, updates: Partial<Layer>): Promise<Layer | null> => {
  try {
    const supabase = getSupabaseClient();
    const response = await supabase
      .from('layers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
      .throwOnError();

    // Invalidate both caches
    cache.delete(ACTIVE_LAYERS_CACHE_KEY);
    cache.delete(ALL_LAYERS_CACHE_KEY);
    return response.data;
  } catch (error: any) {
    logger.error('Error updating layer:', error);
    if (error.code === '42P01') {
      logger.warn('Layers table not found, cannot update layer');
      return null;
    }
    return null;
  }
};

export const deleteLayer = async (id: string): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient();
    await supabase
      .from('layers')
      .delete()
      .eq('id', id)
      .throwOnError();

    // Invalidate both caches
    cache.delete(ACTIVE_LAYERS_CACHE_KEY);
    cache.delete(ALL_LAYERS_CACHE_KEY);
    return true;
  } catch (error: any) {
    logger.error('Error deleting layer:', error);
    if (error.code === '42P01') {
      logger.warn('Layers table not found, cannot delete layer');
      return false;
    }
    return false;
  }
}; 
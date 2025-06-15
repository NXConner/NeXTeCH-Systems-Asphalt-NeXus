// DO NOT create another Supabase client anywhere else. Always import from this file.
// Refactored for environment-based configuration.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { logger } from '@/services/logger';
import { cache } from '@/services/cache';

// Get environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Get the current origin for redirects
const getRedirectUrl = (path: string) => {
  const origin = window.location.origin;
  return `${origin}${path}`;
};

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  logger.error('Missing Supabase configuration', {
    hasUrl: !!SUPABASE_URL,
    hasKey: !!SUPABASE_ANON_KEY
  });
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

// Create a single Supabase client instance
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storageKey: 'asphalt-nexus-auth',
        debug: false
      },
      global: {
        headers: {
          'x-application-name': 'asphalt-nexus'
        }
      },
      realtime: {
        params: {
          eventsPerSecond: 1
        },
        retryAfterError: true,
        reconnectAfterError: true,
        timeout: 30000
      },
      db: {
        schema: 'public'
      }
    });

    // Add response interceptor
    const { fetch: originalFetch } = supabaseInstance;
    supabaseInstance.fetch = async (...args) => {
      try {
        const response = await originalFetch.apply(supabaseInstance, args);
        return response;
      } catch (error: any) {
        logger.error('Supabase fetch error:', error);
        if (error.message?.includes('text is not a function')) {
          // Handle the specific error case
          return new Response(JSON.stringify({ data: [], error: null }));
        }
        throw error;
      }
    };

    // Handle auth state changes
    supabaseInstance.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        logger.info('Auth state changed', { event, userId: session?.user?.id });
      }
    });
  }
  return supabaseInstance;
};

export const supabase = getSupabaseClient();

// Enhanced error handling for auth operations
export const auth = {
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        logger.error('Sign in failed', { error, email });
        throw error;
      }
      return data;
    } catch (error) {
      logger.error('Sign in failed', { error, email });
      throw error;
    }
  },

  signInWithMagicLink: async (email: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: getRedirectUrl('/auth/callback')
        }
      });
      if (error) {
        logger.error('Magic link sign in failed', { error, email });
        throw error;
      }
      return data;
    } catch (error) {
      logger.error('Magic link sign in failed', { error, email });
      throw error;
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getRedirectUrl('/auth/callback'),
          data: {
            email_confirmed: false
          }
        }
      });
      if (error) {
        logger.error('Sign up failed', { error, email });
        throw error;
      }
      return data;
    } catch (error) {
      logger.error('Sign up failed', { error, email });
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        logger.error('Sign out failed', { error });
        throw error;
      }
    } catch (error) {
      logger.error('Sign out failed', { error });
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getRedirectUrl('/auth/reset-password')
      });
      if (error) {
        logger.error('Password reset failed', { error, email });
        throw error;
      }
    } catch (error) {
      logger.error('Password reset failed', { error, email });
      throw error;
    }
  },

  updatePassword: async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        logger.error('Password update failed', { error });
        throw error;
      }
    } catch (error) {
      logger.error('Password update failed', { error });
      throw error;
    }
  },

  updateProfile: async (data: { [key: string]: any }) => {
    try {
      const { error } = await supabase.auth.updateUser({ data });
      if (error) {
        logger.error('Profile update failed', { error, data });
        throw error;
      }
    } catch (error) {
      logger.error('Profile update failed', { error, data });
      throw error;
    }
  },

  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        logger.error('Failed to get session', { error });
        throw error;
      }
      return session;
    } catch (error) {
      logger.error('Failed to get session', { error });
      throw error;
    }
  },

  getUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        logger.error('Failed to get user', { error });
        throw error;
      }
      return user;
    } catch (error) {
      logger.error('Failed to get user', { error });
      throw error;
    }
  }
};

// Enhanced database operations
export const db = {
  from: (table: string) => supabase.from(table),
  
  rpc: (fn: string, params?: any) => supabase.rpc(fn, params),
  
  storage: {
    from: (bucket: string) => supabase.storage.from(bucket),
    
    upload: async (bucket: string, path: string, file: File) => {
      try {
        const { error } = await supabase.storage.from(bucket).upload(path, file);
        if (error) throw error;
        return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
      } catch (error) {
        logger.error('File upload failed', { error, bucket, path });
        throw error;
      }
    }
  }
};

// Add error handling middleware
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    cache.clear('auth');
  }
});

// Add request interceptor for logging and caching
const originalFetch = supabase.rest.fetch;
if (originalFetch) {
  supabase.rest.fetch = async (url, options) => {
    const startTime = Date.now();
    const cacheKey = `supabase_${options?.method}_${url}`;

    // Check cache for GET requests
    if (options?.method === 'GET') {
      const cachedResponse = cache.get(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    try {
      const response = await originalFetch(url, options);
      const duration = Date.now() - startTime;
      
      // Only log slow requests or errors
      if (duration > 1000 || !response.ok) {
        logger.debug('Supabase request', {
          url,
          method: options?.method,
          duration,
          status: response.status,
        });
      }

      // Cache successful GET responses for longer
      if (options?.method === 'GET' && response.ok) {
        const clonedResponse = response.clone();
        const data = await clonedResponse.json();
        cache.set(cacheKey, data, 15 * 60 * 1000); // Cache for 15 minutes
      }
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error('Supabase request failed', {
        url,
        method: options?.method,
        duration,
        error,
      });
      
      throw error;
    }
  };
}

// Add response interceptor for error handling
if (supabase.rest.onResponse) {
  supabase.rest.onResponse = (response: Response) => {
    if (!response.ok) {
      logger.error('Supabase API error', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
    }
    return response;
  };
}

// Export a type-safe query builder with caching
export const queryBuilder = {
  from: (table: string) => {
    return supabase.from(table);
  },
  rpc: (fn: string, params?: any) => {
    return supabase.rpc(fn, params);
  },
  cached: {
    from: (table: string, ttl = 5 * 60 * 1000) => {
      const query = supabase.from(table);
      const originalSelect = query.select;
      query.select = (...args) => {
        const cacheKey = `query_${table}_${JSON.stringify(args)}`;
        const cached = cache.get(cacheKey);
        if (cached) {
          return Promise.resolve({ data: cached, error: null });
        }
        return originalSelect.apply(query, args).then(({ data, error }) => {
          if (!error && data) {
            cache.set(cacheKey, data, ttl);
          }
          return { data, error };
        });
      };
      return query;
    },
  },
};

// Export a type-safe storage client with optimized image handling
export const storage = {
  from: (bucket: string) => {
    return supabase.storage.from(bucket);
  },
  getImageUrl: (path: string, options?: { width?: number; height?: number; quality?: number }) => {
    const url = supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
    if (!options) return url;
    
    const params = new URLSearchParams();
    if (options.width) params.append('width', options.width.toString());
    if (options.height) params.append('height', options.height.toString());
    if (options.quality) params.append('quality', options.quality.toString());
    
    return `${url}?${params.toString()}`;
  },
};
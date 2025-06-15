export const config = {
  api: {
    url: import.meta.env.VITE_API_URL,
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    pwa: import.meta.env.VITE_ENABLE_PWA === 'true',
    maps: import.meta.env.VITE_ENABLE_MAPS === 'true',
    realTime: import.meta.env.VITE_ENABLE_REAL_TIME === 'true',
  },
  services: {
    googleMaps: {
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    },
    stripe: {
      publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
    },
    emailjs: {
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    },
  },
  isDevelopment: import.meta.env.NODE_ENV === 'development',
  isProduction: import.meta.env.NODE_ENV === 'production',
} as const;

export type Config = typeof config; 
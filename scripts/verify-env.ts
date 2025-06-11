import { logger } from '@/services/logger';

const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
] as const;

function verifyEnv() {
  const missingVars = requiredEnvVars.filter(
    (envVar) => !import.meta.env[envVar]
  );

  if (missingVars.length > 0) {
    logger.error('Missing required environment variables:', {
      missing: missingVars
    });
    process.exit(1);
  }

  logger.info('Environment variables verified successfully');
}

verifyEnv(); 
// Setup demo user script
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { logger } from './src/services/logger.js';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const DEMO_EMAIL = 'admin@asphaltpro.com';
const DEMO_PASSWORD = 'admin123'; // Updated password

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  logger.error('Missing required environment variables', { 
    SUPABASE_URL: !!SUPABASE_URL, 
    SUPABASE_ANON_KEY: !!SUPABASE_ANON_KEY 
  });
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupDemoUser() {
  try {
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });

    if (existingUser) {
      logger.info('Demo user already exists');
      return;
    }

    // Create new user
    const { data, error } = await supabase.auth.signUp({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });

    if (error) {
      throw error;
    }

    logger.info('Demo user created successfully', { email: DEMO_EMAIL });
    logger.info('Demo credentials:', { email: DEMO_EMAIL, password: DEMO_PASSWORD });

  } catch (error) {
    logger.error('Failed to create demo user', { error });
    process.exit(1);
  }
}

setupDemoUser(); 
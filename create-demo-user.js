// Automate creation of demo admin user in Supabase Auth
// Usage: node create-demo-user.js

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import { createClient } from '@supabase/supabase-js';
import { logger } from './src/services/logger.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEMO_EMAIL = process.env.DEMO_EMAIL || 'demo@asphaltpro.com';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  logger.error('Missing required environment variables', { 
    SUPABASE_URL: !!SUPABASE_URL, 
    SERVICE_ROLE_KEY: !!SERVICE_ROLE_KEY 
  });
  process.exit(1);
}

if (!DEMO_PASSWORD) {
  logger.error('DEMO_PASSWORD must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createDemoUser() {
  try {
    // 1) Check if user exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({ 
      email: DEMO_EMAIL, 
      limit: 1 
    });
    
    if (listError) {
      logger.error('Error fetching users', { error: listError.message });
      process.exit(1);
    }
    
    if (users.length > 0) {
      logger.info('Demo user already exists', { email: DEMO_EMAIL });
      return;
    }

    // 2) Create the auth user
    const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true
    });
    
    if (createError || !user) {
      logger.error('Error creating user', { 
        error: createError?.message || 'Unknown error' 
      });
      process.exit(1);
    }
    
    logger.info('Demo user created', { email: user.email });

    // 3) Upsert their profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        email: DEMO_EMAIL, 
        username: 'Demo User' 
      });
      
    if (profileError) {
      logger.error('Error upserting profile', { error: profileError.message });
      process.exit(1);
    }
    
    logger.info('Demo profile seeded', { email: DEMO_EMAIL });
  } catch (error) {
    logger.error('Unexpected error in createDemoUser', { error });
    process.exit(1);
  }
}

createDemoUser().catch(error => {
  logger.error('Unhandled error in createDemoUser', { error });
  process.exit(1);
}); 
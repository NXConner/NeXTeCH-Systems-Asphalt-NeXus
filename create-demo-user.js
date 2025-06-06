// Automate creation of demo admin user in Supabase Auth
// Usage: node create-demo-user.js

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function createDemoUser() {
  const email = 'admin@asphaltpro.com';
  const password = 'admin123';

  // 1) Check if user exists
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({ email, limit: 1 });
  if (listError) {
    console.error('Error fetching users:', listError.message);
    process.exit(1);
  }
  if (users.length > 0) {
    console.log('Demo user already exists.');
    return;
  }

  // 2) Create the auth user
  const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });
  if (createError || !user) {
    console.error('Error creating user:', createError?.message || 'Unknown');
    process.exit(1);
  }
  console.log('Demo user created:', user.email);

  // 3) Upsert their profile record
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: user.id, email, username: 'Administrator' });
  if (profileError) {
    console.error('Error upserting profile:', profileError.message);
    process.exit(1);
  }
  console.log('Demo profile seeded for:', email);
}

createDemoUser(); 
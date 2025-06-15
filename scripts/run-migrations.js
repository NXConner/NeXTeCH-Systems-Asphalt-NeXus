const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the Supabase project ID from the config
const configPath = path.resolve(__dirname, '../supabase/config.toml');
const config = fs.readFileSync(configPath, 'utf-8');
const projectId = config.match(/project_id = "([^"]+)"/)[1];

// Get the access token from environment
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
if (!accessToken) {
  console.error('SUPABASE_ACCESS_TOKEN environment variable is required');
  process.exit(1);
}

// Run migrations
try {
  console.log('Running Supabase migrations...');
  execSync('supabase db push', {
    env: {
      ...process.env,
      SUPABASE_ACCESS_TOKEN: accessToken
    },
    stdio: 'inherit'
  });
  console.log('Migrations completed successfully!');
} catch (error) {
  console.error('Failed to run migrations:', error.message);
  process.exit(1);
} 
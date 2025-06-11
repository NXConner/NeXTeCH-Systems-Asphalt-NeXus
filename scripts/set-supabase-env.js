const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.error('.env file not found!');
  process.exit(1);
}

const env = fs.readFileSync(envPath, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .filter(line => !line.startsWith('#'));

const args = env.map(line => {
  const [key, ...rest] = line.split('=');
  const value = rest.join('=').replace(/"/g, '\\"');
  return `${key}="${value}"`;
}).join(' ');

try {
  execSync(`supabase secrets set ${args}`, { stdio: 'inherit' });
  console.log('Supabase secrets set!');
} catch (err) {
  console.error('Failed to set Supabase secrets:', err.message);
  process.exit(1);
}
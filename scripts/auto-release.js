const { execSync } = require('child_process');
try {
  execSync('npx semantic-release', { stdio: 'inherit' });
  console.log('Release automation complete!');
} catch (err) {
  console.error('Release automation failed:', err.message);
  process.exit(1);
} 
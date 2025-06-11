const { execSync } = require('child_process');
try {
  execSync('npx i18next-scanner', { stdio: 'inherit' });
  console.log('i18n scan complete!');
} catch (err) {
  console.error('i18n scan failed:', err.message);
  process.exit(1);
} 
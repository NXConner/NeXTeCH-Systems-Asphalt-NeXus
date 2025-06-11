const { execSync } = require('child_process');
try {
  execSync('npx lhci autorun', { stdio: 'inherit' });
  console.log('Lighthouse CI complete!');
} catch (err) {
  console.error('Lighthouse CI failed:', err.message);
  process.exit(1);
} 
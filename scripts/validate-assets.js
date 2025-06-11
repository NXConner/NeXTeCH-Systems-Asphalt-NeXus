const fs = require('fs');
const path = require('path');

const assetDir = path.resolve(__dirname, '../public/assets');
const maxSize = 500 * 1024; // 500KB

function checkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      checkDir(fullPath);
    } else {
      const size = fs.statSync(fullPath).size;
      if (size > maxSize) {
        console.warn(`Large asset: ${fullPath} (${(size/1024).toFixed(1)} KB)`);
      }
    }
  });
}

checkDir(assetDir);
console.log('Asset validation complete.'); 
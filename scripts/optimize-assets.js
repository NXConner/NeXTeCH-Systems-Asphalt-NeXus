const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const path = require('path');

(async () => {
  // Optimize images
  await imagemin(['public/assets/**/*.{jpg,png}'], {
    destination: 'public/assets-optimized',
    plugins: [
      imageminMozjpeg({ quality: 75 }),
      imageminPngquant({ quality: [0.6, 0.8] })
    ]
  });
  console.log('Images optimized!');

  // Purge unused CSS
  const purgeCSSResult = await new PurgeCSS().purge({
    content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
    css: ['./src/index.css'],
  });
  fs.writeFileSync('./src/index.purged.css', purgeCSSResult[0].css);
  console.log('Unused CSS purged!');
})(); 
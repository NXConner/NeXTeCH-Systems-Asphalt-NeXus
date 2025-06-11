const puppeteer = require('puppeteer');
const AxePuppeteer = require('@axe-core/puppeteer').default;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:4173'); // Adjust to your local preview URL
  const results = await new AxePuppeteer(page).analyze();
  console.log(JSON.stringify(results.violations, null, 2));
  await browser.close();
})(); 
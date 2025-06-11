const fetch = require('node-fetch');
const webhookUrl = process.env.SLACK_WEBHOOK_URL;
const message = process.argv[2] || 'Deployment complete!';

fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: message }),
})
  .then(res => res.text())
  .then(console.log)
  .catch(console.error); 
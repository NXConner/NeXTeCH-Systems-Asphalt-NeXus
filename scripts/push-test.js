const fetch = require('node-fetch');
require('dotenv').config();

const { SUPABASE_FUNCTION_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

fetch(`${SUPABASE_FUNCTION_URL}/send_web_push`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Test Notification',
    body: 'This is a test from automation!',
    data: { foo: 'bar' }
  }),
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error); 
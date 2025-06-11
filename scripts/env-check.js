const required = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'WEB_PUSH_VAPID_PUBLIC_KEY',
  'WEB_PUSH_VAPID_PRIVATE_KEY',
  'WEB_PUSH_CONTACT_EMAIL',
  'FCM_SERVER_KEY'
];
const missing = required.filter(key => !process.env[key]);
if (missing.length) {
  console.error('Missing env vars:', missing.join(', '));
  process.exit(1);
}
console.log('All required env vars are set!'); 
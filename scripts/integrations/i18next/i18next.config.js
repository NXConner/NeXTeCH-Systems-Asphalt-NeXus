module.exports = {
  input: ['src/**/*.{js,jsx,ts,tsx}'],
  output: './public/locales',
  locales: ['en', 'es', 'fr'],
  defaultLocale: 'en',
  sort: true,
  createOldCatalogs: false,
}; 
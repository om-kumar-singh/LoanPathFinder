/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'primary-teal': '#41A67E',
        'deep-blue': '#05339C',
        'royal-blue': '#1055C9',
        'highlight-yellow': '#E5C95F',
        'light-gray': '#F9FAFB',
        // Legacy colors for backward compatibility during transition
        'dashboard-bg': '#F9FAFB',
        'card-accent': '#41A67E',
        'primary-text': '#05339C',
        'button-highlight': '#41A67E',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


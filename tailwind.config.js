/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF8F5',   // warm white
        ink: '#232323',     // charcoal text
        stone: '#6F6B66',   // secondary text
        sand: '#E9E1D6',    // soft beige
        mist: '#D9D6D1',    // soft grey
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

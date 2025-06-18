/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#b3ddf3', // Chicago flag blue
        accent: '#222',
        background: '#fff',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        night: '#1b130f', // deep brown
        mist: '#f3e7da', // warm mist
        orchid: '#b36b2c', // clay/sienna
        mint: '#d9a441', // amber accent
        slate: '#2a1c16', // dark clay
      },
      boxShadow: {
        soft: '0 14px 40px -10px rgba(0,0,0,0.45)',
      },
      backgroundImage: {
        glow:
          'radial-gradient(circle at 20% 50%, rgba(179, 107, 44, 0.25), transparent 32%), radial-gradient(circle at 82% 35%, rgba(217, 164, 65, 0.25), transparent 32%)',
      },
    },
  },
  plugins: [],
};


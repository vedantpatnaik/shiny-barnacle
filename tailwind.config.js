/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        night: '#0B1021',
        mist: '#E7ECF4',
        orchid: '#8F7CF9',
        mint: '#6FF0C4',
        slate: '#1B243A',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(0,0,0,0.18)',
      },
      backgroundImage: {
        glow: 'radial-gradient(circle at 20% 20%, rgba(143,124,249,0.35), transparent 30%), radial-gradient(circle at 80% 0%, rgba(111,240,196,0.35), transparent 25%), linear-gradient(135deg, #0B1021 0%, #11182C 40%, #0C1429 100%)',
      },
    },
  },
  plugins: [],
};


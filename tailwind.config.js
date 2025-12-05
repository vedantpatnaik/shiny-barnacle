/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        night: '#0F172A', // slate-900
        mist: '#F1F5F9',
        orchid: '#A855F7', // purple-500
        mint: '#38BDF8', // sky-400 (replacing mint with sky blue)
        slate: '#1E293B', // slate-800
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        glow: 'radial-gradient(circle at 15% 50%, rgba(168, 85, 247, 0.15), transparent 25%), radial-gradient(circle at 85% 30%, rgba(56, 189, 248, 0.15), transparent 25%)',
      },
    },
  },
  plugins: [],
};


import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FEFCF9',
          100: '#FDF8F3',
          200: '#FAF0E4',
          300: '#F5E6D0',
          400: '#EDD5B3',
          500: '#E5C89C',
        },
        gold: {
          300: '#D4A94E',
          400: '#C4943A',
          500: '#B8860B',
          600: '#9A7209',
          700: '#7C5C07',
        },
        charcoal: {
          400: '#6B6B6B',
          500: '#4A4A4A',
          600: '#3A3A3A',
          700: '#2A2A2A',
          800: '#1A1A1A',
          900: '#0F0F0F',
        },
      },
      fontFamily: {
        sora: ['Sora', 'system-ui', 'sans-serif'],
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        bebas: ['Bebas Neue', 'Impact', 'sans-serif'],
      },
      fontSize: {
        'hero-marquee': ['clamp(5rem, 10vw, 11rem)', { lineHeight: '1', letterSpacing: '0.02em' }],
        'section-heading': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1' }],
        'section-label': ['0.8rem', { lineHeight: '1.5', letterSpacing: '0.15em' }],
      },
      animation: {
        'marquee-left': 'marquee-left 40s linear infinite',
        'marquee-right': 'marquee-right 40s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out forwards',
      },
      keyframes: {
        'marquee-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

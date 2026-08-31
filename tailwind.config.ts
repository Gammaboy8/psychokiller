import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0a0b0d',
          900: '#0f1114',
          850: '#14171b',
          800: '#1a1e24',
          700: '#232830',
          600: '#2e343d',
          500: '#3a4048',
        },
        crimson: {
          200: '#ffb3b3',
          300: '#ff8080',
          400: '#ff4d4d',
          500: '#e03a3a',
          600: '#c22626',
          700: '#9b1b1b',
        },
        muted: '#8b95a1',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['"Segoe UI"', 'ui-sans-serif', 'system-ui', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
        glow: '0 0 24px rgba(224,58,58,0.15)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drift: {
          '0%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-24px) translateX(12px) rotate(8deg)' },
          '100%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.15', transform: 'scale(0.8)' },
          '50%': { opacity: '0.7', transform: 'scale(1.2)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out',
        drift: 'drift 18s ease-in-out infinite',
        twinkle: 'twinkle 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;

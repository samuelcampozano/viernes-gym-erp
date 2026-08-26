import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B0F17',
        surface: {
          50: '#1B2236',
          100: '#161F33',
          200: '#111726',
          300: '#0E131F',
          400: '#0B0F17',
        },
        stark: {
          orange: {
            DEFAULT: '#FF5500',
            50: '#FFF2EB',
            100: '#FFE1D1',
            200: '#FFC0A3',
            300: '#FF9E75',
            400: '#FF7747',
            500: '#FF5500',
            600: '#E64A00',
            700: '#B83B00',
            800: '#8A2C00',
            900: '#5C1D00',
          },
          amber: '#FFAA00',
          cyan: '#00E5FF',
          red: '#FF3366',
          emerald: '#00E676',
        },
        border: {
          subtle: '#1F293D',
          glow: 'rgba(255, 85, 0, 0.3)',
        },
      },
      boxShadow: {
        'stark-glow': '0 0 25px -5px rgba(255, 85, 0, 0.35)',
        'stark-glow-sm': '0 0 15px -3px rgba(255, 85, 0, 0.25)',
        'hud-cyan': '0 0 20px -3px rgba(0, 229, 255, 0.3)',
        'hud-emerald': '0 0 20px -3px rgba(0, 230, 118, 0.3)',
        'hud-red': '0 0 20px -3px rgba(255, 51, 102, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-pulse': 'radarPulse 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'wave-bar': 'waveBar 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        radarPulse: {
          '0%': { transform: 'scale(0.95)', opacity: '1', boxShadow: '0 0 0 0 rgba(255, 85, 0, 0.7)' },
          '70%': { transform: 'scale(1.15)', opacity: '0.8', boxShadow: '0 0 0 16px rgba(255, 85, 0, 0)' },
          '100%': { transform: 'scale(0.95)', opacity: '1', boxShadow: '0 0 0 0 rgba(255, 85, 0, 0)' },
        },
        waveBar: {
          '0%': { height: '15%' },
          '100%': { height: '100%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

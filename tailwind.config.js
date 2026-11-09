/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Aegis Custom Developer Palette
        aegis: {
          bg: '#090E19',         // Main background
          sidebar: '#0D1422',    // Sidebar background
          card: '#111B2B',       // Card background
          'card-hover': '#162338',
          border: '#202C40',     // Default border
          'border-light': '#2D3E5B',
          teal: '#18C6A3',       // Primary accent
          'teal-dark': '#139e82',
          'teal-glow': 'rgba(24, 198, 163, 0.15)',
          indigo: '#7C8CFF',     // Secondary accent
          'indigo-dark': '#6171ea',
          'indigo-glow': 'rgba(124, 140, 255, 0.15)',
          muted: '#94A3B8',      // Muted blue-gray text
          subtle: '#64748B',     // Dim / icon color
          text: '#F8FAFC',       // Primary white text
          'text-dim': '#CBD5E1', // Secondary text
        },
        // OS Status semantic colors
        status: {
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          sky: '#38BDF8',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        'glow-teal': '0 0 20px -5px rgba(24, 198, 163, 0.25)',
        'glow-indigo': '0 0 20px -5px rgba(124, 140, 255, 0.25)',
        'card-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(32, 44, 64, 0.8)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};

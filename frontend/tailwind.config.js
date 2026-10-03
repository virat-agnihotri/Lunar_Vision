/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#162235',
          100: '#101A2A',
          200: '#0B1220',
          300: '#1e3a8a',
          400: '#2563eb',
          500: '#3b82f6',
          600: '#06b6d4',
          700: '#0891b2',
          800: '#0e7490',
          900: '#0B1220',
        },
        surface: {
          bg: '#0B1220',
          card: '#101A2A',
          cardLight: '#162235',
          border: 'rgba(255, 255, 255, 0.1)',
          borderDark: 'rgba(255, 255, 255, 0.2)',
          muted: 'rgba(255, 255, 255, 0.05)',
        },
        charcoal: {
          900: '#F8FAFC', // Actually white for dark theme text
          700: '#CBD5E1', // Secondary text
          500: '#94A3B8', // Muted text
          400: '#64748B', // Subdued text
        },
        accent: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          success: '#10b981',
          error: '#ef4444'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
      },
      letterSpacing: {
        widest: '.25em',
        ultra: '.35em',
      }
    },
  },
  plugins: [],
}



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
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8', // Deep blue primary
          800: '#1e40af', // Deep indigo
          900: '#1e3a8a',
        },
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
        },
        lunarAmber: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        surface: {
          bg: '#F8FAFC',       // Clean off-white
          tinted: '#F1F5F9',   // Pale cool blue-grey
          subtleBlue: '#F0F4F8',
          card: '#FFFFFF',     // Pure white card
          border: '#E2E8F0',   // Subtle neutral border
          borderDark: '#CBD5E1',
        },
        charcoal: {
          900: '#0F172A', // Main dark text
          700: '#334155', // Secondary text
          500: '#64748B', // Muted text
          400: '#94A3B8', // Subdued text
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        widest: '.25em',
        ultra: '.35em',
      }


    },
  },
  plugins: [],
}



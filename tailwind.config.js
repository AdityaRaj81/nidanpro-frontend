/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#16A34A',
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#16A34A',
          600: '#15803D',
        },
        background: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2E8F0',
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
        },
        error: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      fontSize: {
        'h1': '28px',
        'h2': '22px',
        'h3': '18px',
        'body': '16px',
        'small': '12px',
      },
    },
  },
  plugins: [],
}
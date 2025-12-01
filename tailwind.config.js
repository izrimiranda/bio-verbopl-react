/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          dark: '#383f51',
          DEFAULT: '#383f51',
          light: '#4b5266',
        },
        secondary: {
          dark: '#2c3340',
          DEFAULT: '#1e2329',
        },
        beige: {
          DEFAULT: '#bca488',
          light: '#d4b496',
          pale: '#c7a687'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'shine': 'shine 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shine: {
          '0%': { left: '-100%' },
          '20%, 100%': { left: '100%' }
        }
      }
    },
  },
  plugins: [],
}

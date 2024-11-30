/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      animation: {
        parpadeoInput: 'parpadeoInput 1s infinite',
        sacudirInput : 'sacudirInput 1s ease'
      },
      keyframes: {
        parpadeoInput: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: 'red' },
        },
        sacudirInput: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-5px)' },
        }
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}


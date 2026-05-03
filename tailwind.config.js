/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#391A65',
        background: '#E8E5ED',
        'text-dark': '#2D1B50',
        accent: '#CF96D5',
        'border-light': '#C5BFD0',
        'text-muted': '#7A6E8A',
        white: '#FFFFFF',
        error: '#C0392B',
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins_400Regular', 'sans-serif'],
        medium: ['Poppins_500Medium', 'sans-serif'],
        semibold: ['Poppins_600SemiBold', 'sans-serif'],
        bold: ['Poppins_700Bold', 'sans-serif'],
        montserrat: ['Montserrat_400Regular', 'sans-serif'],
        'montserrat-medium': ['Montserrat_500Medium', 'sans-serif'],
        'montserrat-semibold': ['Montserrat_600SemiBold', 'sans-serif'],
        'montserrat-bold': ['Montserrat_700Bold', 'sans-serif'],
        'montserrat-extrabold': ['Montserrat_800ExtraBold', 'sans-serif'],
      },
      colors: {
        primary: "#391A65",
        background: "#E8E5ED",
        "text-dark": "#2D1B50",
        accent: "#CF96D5",
        "border-light": "#C5BFD0",
        "text-muted": "#7A6E8A",
        white: "#FFFFFF",
        error: "#C0392B",
      },
    },
  },
  plugins: [],
};

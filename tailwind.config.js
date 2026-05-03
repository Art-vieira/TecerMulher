/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#4C1D95',    // Deep Violet
        secondary: '#8B5CF6',  // Soft Violet
        accent: '#EC4899',     // Pink/Magenta Accent
        background: '#F5F3FF', // Very Light Lavender
        surface: '#FFFFFF',    // Card background
        'text-dark': '#1F2937',// Neutral Cool Dark
        'text-muted': '#6B7280',// Neutral Cool Gray
        'border-light': '#E5E7EB',
        white: '#FFFFFF',
        error: '#EF4444',
      }
    },
  },
  plugins: [],
}
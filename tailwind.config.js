/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
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
        // ── Cores principais ──────────────────────────────────
        primary: "#391A65",
        "primary-deep": "#2D1B50",
        background: "#E8E5ED",
        accent: "#CF96D5",
        // ── Superfícies ──────────────────────────────────────
        surface: "#F2F0F5",        // Fundo principal das telas (corpo)
        "surface-muted": "#E0DCE8",  // Fundos suaves, separadores
        "surface-card": "#EDE9F5",   // Placeholders de imagem nos cards
        "surface-sheet": "#F8F8F8",  // Cards de conteúdo (blocos de aula)
        "surface-divider": "#F0EDF5", // Linhas divisórias
        // ── Textos ───────────────────────────────────────────
        "text-dark": "#2D1B50",
        "text-muted": "#7A6E8A",
        "text-subtle": "#6B5E80",    // Textos secundários e placeholders
        "text-placeholder": "#A39BB0", // Ícones e hints suaves
        // ── Bordas ───────────────────────────────────────────
        "border-light": "#C5BFD0",
        "border-active": "#CAC4D0",  // Bordas de card ativo (aula)
        // ── Modo Admin ───────────────────────────────────────
        "admin-dark": "#1A1A1A",     // Fundo/texto modo admin
        "admin-border": "#3C3C3C",   // Bordas dos inputs do formulário admin
        // ── Utilitários ──────────────────────────────────────
        white: "#FFFFFF",
        error: "#C0392B",
      },
    },
  },
  plugins: [],
};

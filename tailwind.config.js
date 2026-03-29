/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        dark: "var(--color-dark)",
      },
      borderRadius: {
        DEFAULT: "5px",
      },
    },
  },
  plugins: [],
}


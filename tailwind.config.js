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
        background: "#ebe5e0",
        accent: "#b4a69b",
        dark: "#3d3630"
      },
      borderRadius: {
        DEFAULT: "5px",
      },
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Esto le dice a Tailwind que escanee archivos .js, .ts, .jsx y .tsx dentro de src/
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
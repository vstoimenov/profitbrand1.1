/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      /* Credit demo („Финора“) palette and fonts — used only under src/pages/credit */
      colors: {
        credit: {
          pine: "#0f3d2e",
          pine2: "#175c45",
          mint: "#38c98c",
          mist: "#eef4f1",
          ink: "#12261e",
          soft: "#5b7268",
          line: "#d6e3dc",
        },
      },
      fontFamily: {
        "cr-head": ["Geologica", "system-ui", "sans-serif"],
        "cr-body": ['"Golos Text"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        danger: "#FF7A7A",
        custom: {
          50: "#FFFFFF",
          100: "#EFEFEF",
          200: "#747474",
          300: "#303030",
        },
      },
      maxWidth: {
        "8xl": "1920px",
      },
      gridTemplateRows: {
        "[auto,auto,1fr]": "auto auto 1fr",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "bg-desktop": "url('/dbg.svg')",
        "bg-mobile": "url('/mbg.svg')",
      },
      dropShadow: {
        "3xl": "7px 7px 2px rgba(0, 0, 0, 0.3)",
        "4xl": "10px 10px 2px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

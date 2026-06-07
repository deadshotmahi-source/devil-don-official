import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#06142E",
        ocean: "#075BFF",
        azure: "#16A3FF",
        ice: "#F7FBFF"
      },
      boxShadow: {
        glow: "0 0 40px rgba(7,91,255,.28)",
        panel: "0 24px 80px rgba(6,20,46,.12)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;

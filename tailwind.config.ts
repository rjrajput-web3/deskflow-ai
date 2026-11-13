import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: { 950: "#0B1220", 900: "#111A2E", 800: "#1B2742", 700: "#2A3A5C" },
        brand: { 50: "#ECFDF5", 100: "#D1FAE5", 500: "#10B981", 600: "#059669", 700: "#047857" },
        accent: { 500: "#7C5CFF", 600: "#6A4AE0" },
      },
    },
  },
  plugins: [],
};
export default config;

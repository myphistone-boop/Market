import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        delta: {
          // Thème carbone : accent chrome/argent (remplace le rouge).
          red: "#d3d8de", // accent chrome (conservé sous ce nom)
          redDark: "#9aa0a8",
          chrome: "#d3d8de",
          steel: "#8b929b",
          bg: "#08090a",
          surface: "#101216",
          surface2: "#181b20",
          line: "#2b2f36",
          muted: "#868c95",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        app: "460px",
      },
      boxShadow: {
        sheet: "0 -20px 60px rgba(0,0,0,0.6)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.4s infinite",
      },
    },
  },
  plugins: [],
};

export default config;

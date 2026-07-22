import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        delta: {
          red: "#E50914",
          redDark: "#B00610",
          bg: "#000000",
          surface: "#141414",
          surface2: "#1f1f1f",
          muted: "#8a8a8a",
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

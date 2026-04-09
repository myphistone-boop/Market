import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neural: {
          bg: "#0a0e1a",
          panel: "#0d1225",
          border: "#1a2444",
          accent: "#4fc3f7",
          glow: "#2196f3",
          text: "#c8d6e5",
          muted: "#5a6a8a",
        },
      },
      boxShadow: {
        neural: "0 0 20px rgba(33, 150, 243, 0.15)",
        "neural-strong": "0 0 40px rgba(33, 150, 243, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;

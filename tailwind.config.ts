import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pixa: {
          black: "#030303",
          obsidian: "#050505",
          white: "#F4F4F4",
          silver: "#D8D8D8",
          muted: "#6B6B6B",
          secondary: "#A7A7A7",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "Geist",
          "Satoshi",
          "Space Grotesk",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        silver: "0 0 64px rgba(216, 216, 216, 0.12)",
        insetSilver: "inset 0 1px 0 rgba(255,255,255,0.18)",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

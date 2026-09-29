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
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#176B4D", // Primary Bangladesh Emerald Green
          800: "#11523B",
          900: "#0b3828",
          950: "#052016",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#F4B544", // Bangladesh Warm Gold / Amber
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        payment: {
          bkash: "#D12053",
          nagad: "#F7941D",
          rocket: "#8C3494",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-hind-siliguri)", "sans-serif"],
        bengali: ["var(--font-hind-siliguri)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

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
        // Primary — Deep Navy (trust, premium, Bangladeshi authority)
        navy: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#1e3a5f",
          700: "#162d4a",   // PRIMARY NAVY
          800: "#0f2039",
          900: "#091528",
          950: "#040d1a",
        },
        // Accent — Vibrant Saffron/Amber (energy, warmth, Bangladesh sun)
        saffron: {
          50:  "#fff8ed",
          100: "#ffefd4",
          200: "#ffd9a8",
          300: "#ffbb6b",
          400: "#ff9a3c",
          500: "#f97316",   // PRIMARY SAFFRON
          600: "#ea6900",
          700: "#c25400",
          800: "#9a4200",
          900: "#7c3700",
          950: "#431900",
        },
        // Neutral Cream (warmth, organic, natural)
        cream: {
          50:  "#fdfaf5",
          100: "#faf4e8",
          200: "#f5e8cf",
          300: "#ecd8ae",
          400: "#e0c17f",
          500: "#d4aa56",
          600: "#b8900f",
          700: "#966f0a",
          800: "#6f5008",
          900: "#4d3705",
        },
        // Herbal Green (natural, organic, health)
        herbal: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",   // HERBAL ACCENT
          800: "#166534",
          900: "#14532d",
        },
        // Keep payment colors
        payment: {
          bkash:  "#D12053",
          nagad:  "#F7941D",
          rocket: "#8C3494",
        },
        // Legacy brand alias (keeps older code working)
        brand: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052016",
        },
        gold: {
          50:  "#fff8ed",
          100: "#ffefd4",
          200: "#ffd9a8",
          300: "#ffbb6b",
          400: "#ff9a3c",
          500: "#f97316",
          600: "#ea6900",
          700: "#c25400",
          800: "#9a4200",
          900: "#7c3700",
        },
      },
      fontFamily: {
        sans: ["var(--font-hind-siliguri)", "system-ui", "-apple-system", "sans-serif"],
        body: ["var(--font-hind-siliguri)", "system-ui", "-apple-system", "sans-serif"],
        bengali: ["var(--font-hind-siliguri)", "system-ui", "-apple-system", "sans-serif"],
        heading: ["var(--font-anek-bangla)", "var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-anek-bangla)", "var(--font-poppins)", "system-ui", "sans-serif"],
        english: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-navy":    "0 0 30px 0 rgba(22, 45, 74, 0.25)",
        "glow-saffron": "0 0 30px 0 rgba(249, 115, 22, 0.35)",
        "card":         "0 2px 16px 0 rgba(22, 45, 74, 0.08), 0 1px 4px 0 rgba(22,45,74,0.04)",
        "card-hover":   "0 8px 40px 0 rgba(22, 45, 74, 0.16), 0 2px 8px 0 rgba(22,45,74,0.08)",
      },
      backgroundImage: {
        "hero-gradient":   "linear-gradient(135deg, #091528 0%, #0f2039 40%, #1a3a1a 100%)",
        "card-gradient":   "linear-gradient(145deg, #fdfaf5 0%, #f5e8cf 100%)",
        "saffron-gradient":"linear-gradient(135deg, #ff9a3c 0%, #f97316 50%, #ea6900 100%)",
        "navy-gradient":   "linear-gradient(135deg, #162d4a 0%, #091528 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%":      { transform: "translateY(-10px) rotate(0.5deg)" },
        },
        "float-delayed": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%":      { transform: "translateY(8px) rotate(-0.3deg)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%":      { opacity: "0.8", transform: "scale(1.08)" },
        },
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float:         "float 5s ease-in-out infinite",
        "float-delayed": "float-delayed 6s ease-in-out infinite",
        shimmer:       "shimmer 2.5s infinite",
        "pulse-glow":  "pulse-glow 4s ease-in-out infinite",
        "slide-up":    "slide-up 0.5s ease-out",
        "fade-in":     "fade-in 0.4s ease-out",
        marquee:       "marquee 25s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

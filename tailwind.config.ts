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
        background: "#0A0A0A",
        surface: "#111111",
        "surface-alt": "#0D0D0D",
        border: "#222222",
        "border-subtle": "#1A1A1A",
        "text-primary": "#F5F5F5",
        "text-muted": "#888888",
        gold: "#C9A84C",
        "gold-light": "#E8C96A",
        "gold-dark": "#A07830",
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond"],
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;

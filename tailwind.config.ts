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
        soil: {
          DEFAULT: "#172B29",
          soft: "#1F3633",
          muted: "#2A4541",
        },
        sand: {
          DEFAULT: "#F3F1E8",
          dim: "#E8E5DB",
          bright: "#F8F6EF",
        },
        canopy: {
          DEFAULT: "#315B52",
          deep: "#274942",
        },
        moss: {
          DEFAULT: "#52756D",
          light: "#6E8F87",
        },
        lichen: {
          DEFAULT: "#C9C7BC",
        },
        water: {
          DEFAULT: "#667F86",
          light: "#849AA0",
        },
        signal: {
          DEFAULT: "#B08A52",
        },
        ink: {
          DEFAULT: "#14201F",
          muted: "#4A5A57",
          faint: "#7A8682",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 2px rgba(23, 43, 41, 0.05), 0 14px 36px rgba(23, 43, 41, 0.08)",
        soft: "0 1px 2px rgba(23, 43, 41, 0.05)",
        map: "0 0 0 1px rgba(23, 43, 41, 0.1), 0 18px 48px rgba(23, 43, 41, 0.1)",
        lift: "0 8px 24px rgba(23, 43, 41, 0.12)",
      },
      letterSpacing: {
        label: "0.14em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "rule-in": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.65s ease-out both",
        "rule-in": "rule-in 0.8s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;

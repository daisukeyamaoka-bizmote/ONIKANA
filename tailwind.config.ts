import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ONIKANA カラーパレット
        navy: {
          DEFAULT: "#1F4E79",
          50: "#EAF1F8",
          100: "#D5E3F1",
          200: "#A8C5E0",
          500: "#1F4E79",
          700: "#163958",
          900: "#0E2438",
        },
        aqua: {
          DEFAULT: "#2E86AB",
          50: "#E7F2F7",
          100: "#CFE5EF",
          500: "#2E86AB",
          700: "#1F5D78",
        },
        supplier: {
          DEFAULT: "#ED7D31",
          50: "#FDF1E7",
          100: "#FBE2D0",
          500: "#ED7D31",
          700: "#B85A1A",
        },
        success: "#00703C",
        danger: "#C00000",
        bg: "#F8F9FA",
      },
      fontFamily: {
        sans: [
          "Inter",
          "Noto Sans JP",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Segoe UI",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)",
        "card-hover":
          "0 4px 12px -2px rgba(31,78,121,0.12), 0 2px 4px -2px rgba(31,78,121,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

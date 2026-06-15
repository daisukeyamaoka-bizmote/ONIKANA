import type { Config } from "tailwindcss";

// モノクロ3色パレット
// - ink (黒)  : テキスト、プライマリボタン、強調
// - paper (白): 背景、コントラスト
// - mist (灰) : セカンダリ、ボーダー、ミュート
// 既存クラス名(navy / aqua / supplier / success / danger / bg)は
// 互換のためモノクロにマップしてあります。

const ink = "#0F0F0F";
const paper = "#FFFFFF";
const mist = {
  50: "#FAFAFA",
  100: "#F5F5F5",
  200: "#E5E5E5",
  300: "#D4D4D4",
  400: "#A3A3A3",
  500: "#737373",
  600: "#525252",
  700: "#404040",
  800: "#262626",
  900: "#171717",
};

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink,
        paper,
        mist,
        // 互換エイリアス: 既存コードを壊さないため
        navy: {
          DEFAULT: ink,
          50: mist[50],
          100: mist[100],
          200: mist[200],
          500: ink,
          700: mist[800],
          900: ink,
        },
        aqua: {
          DEFAULT: mist[700],
          50: mist[100],
          100: mist[200],
          500: mist[700],
          700: ink,
        },
        supplier: {
          DEFAULT: ink,
          50: mist[100],
          100: mist[200],
          500: ink,
          700: mist[800],
        },
        success: ink,
        danger: ink,
        bg: mist[50],
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
        card: "0 1px 2px 0 rgba(0,0,0,0.04)",
        "card-hover":
          "0 4px 12px -2px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;

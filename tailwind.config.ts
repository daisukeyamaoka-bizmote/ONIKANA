import type { Config } from "tailwindcss";

// フクワウチ ブランドパレット
// オニカナのコーポレートカラー(鬼の朱・鬼の群青・福の砂色)を
// プロダクトUI用に階調化。基本は3色+墨(ink)+紙(paper)。
//
//   oni-red  (朱)   : 支援先(Giver)・警告・LIKE強
//   oni-blue (群青)  : クライアント・Primary・LIKE弱・成功
//   fuku-sand (砂)   : 背景・アクセント面
//   ink              : 本文文字色(墨)
//   paper            : カード白
//
// 既存クラス(navy / aqua / supplier / success / danger / bg)は
// 互換エイリアスで上記3色にマップしてあります。

const oniRed = "#D8281D";
const oniRedShades = {
  50: "#FBE9E7",
  100: "#F7CFCB",
  200: "#EDA199",
  500: "#D8281D",
  700: "#A21A12",
  900: "#651008",
};

const oniBlue = "#1E4FA3";
const oniBlueShades = {
  50: "#E7EDF7",
  100: "#C3D0EB",
  200: "#A1B5DF",
  500: "#1E4FA3",
  700: "#143874",
  900: "#0A1F45",
};

const fukuSand = "#EBE1C2";
const fukuSandShades = {
  50: "#FAF6E9",
  100: "#F2EAD2",
  200: "#EBE1C2",
  500: "#C9B987",
  700: "#9D8C4F",
};

const ink = "#0A0A0A";
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
        // 新ブランドカラー(明示)
        oni: {
          red: { DEFAULT: oniRed, ...oniRedShades },
          blue: { DEFAULT: oniBlue, ...oniBlueShades },
        },
        fuku: {
          sand: { DEFAULT: fukuSand, ...fukuSandShades },
        },
        ink,
        paper,
        mist,
        // 互換エイリアス: 既存コードがそのまま動くように
        // クライアント側 / Primary action → 群青(blue)
        navy: {
          DEFAULT: oniBlue,
          50: oniBlueShades[50],
          100: oniBlueShades[100],
          200: oniBlueShades[200],
          500: oniBlueShades[500],
          700: oniBlueShades[700],
          900: oniBlueShades[900],
        },
        // セカンダリも青系
        aqua: {
          DEFAULT: "#3A6FBC",
          50: oniBlueShades[50],
          100: oniBlueShades[100],
          500: "#3A6FBC",
          700: oniBlue,
        },
        // 支援先(Giver)アイデンティティ → 朱(red)
        supplier: {
          DEFAULT: oniRed,
          50: oniRedShades[50],
          100: oniRedShades[100],
          500: oniRedShades[500],
          700: oniRedShades[700],
        },
        success: oniBlue,
        danger: oniRed,
        // ページ全体の背景は薄い砂色
        bg: fukuSandShades[50],
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
        // 見出し用の明朝体(システムフォントのみ・外部読込なし)
        serif: [
          '"Shippori Mincho"',
          '"Hiragino Mincho ProN"',
          '"Yu Mincho"',
          '"Noto Serif JP"',
          "serif",
        ],
      },
      boxShadow: {
        // 編集デザイン方針: 影は基本使わない。hover時のみ極薄
        card: "none",
        "card-hover": "0 2px 8px -2px rgba(10,10,10,0.10)",
      },
    },
  },
  plugins: [],
};

export default config;

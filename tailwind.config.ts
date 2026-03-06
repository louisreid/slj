import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        border: "#E5E7EB",
        surface: {
          DEFAULT: "#111111",
          muted: "#181818",
          subtle: "#202020",
        },
        ink: {
          DEFAULT: "#FFFFFF",
          muted: "rgba(255,255,255,0.75)",
          faint: "rgba(255,255,255,0.5)",
        },
      },
    },
  },
  plugins: [],
};

export default config;

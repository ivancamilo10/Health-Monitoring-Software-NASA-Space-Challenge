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
        // Paleta Liquid Glass Cosmic (Inspirada en Orbital Health)
        cosmic: {
          950: "#08090d", // Fondo raíz
          900: "#0c0d12", // Superficie de cabina
          850: "#111218", // Fondo de tarjetas glass
          800: "#181822", // Superficie elevada
          border: "#282635", // Borde sutil
          borderHover: "#554477", // Borde al pasar cursor
        },
        violet: {
          brand: "#9975ff",
          brandLight: "#c0a9ff",
          brandDark: "#643bca",
          brandGlow: "rgba(153, 117, 255, 0.35)",
        },
        cyan: {
          brand: "#66d8d1",
          brandLight: "#8de8e2",
          brandDark: "#3da69f",
        },
        // Estados médicos con tonos suaves y amigables
        status: {
          nominal: "#72d0b3",
          nominalBg: "rgba(114, 208, 179, 0.12)",
          caution: "#eac184",
          cautionBg: "rgba(234, 193, 132, 0.14)",
          warning: "#f97316",
          warningBg: "rgba(249, 115, 22, 0.14)",
          critical: "#f87171",
          criticalBg: "rgba(248, 113, 113, 0.18)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "Poppins",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "monospace",
        ],
      },
      borderRadius: {
        "xl": "12px",
        "2xl": "16px",
        "3xl": "22px",
      },
      boxShadow: {
        "glass": "0 8px 32px rgba(0, 0, 0, 0.45)",
        "glass-hover": "0 12px 40px rgba(153, 117, 255, 0.22)",
        "glow-violet": "0 0 25px rgba(153, 117, 255, 0.45)",
        "glow-cyan": "0 0 25px rgba(102, 216, 209, 0.4)",
      },
    },
  },
  plugins: [],
};
export default config;

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
        // ---------------------------------------------------------------------
        // PALETA OFICIAL NASA SPACE CHALLENGE (ESPACIO PROFUNDO & BIO-TELEMETRÍA)
        // Zona reservada para ajustes del DISEÑADOR GRÁFICO
        // ---------------------------------------------------------------------
        space: {
          void: "#03070D",     // Fondo absoluto del espacio exterior
          surface: "#0A111E",  // Fondo de paneles y tarjetas de control
          panel: "#0F1A2E",    // Paneles elevados / consolas de radar
          border: "#1E2D4A",   // Bordes técnicos sutiles
        },
        telemetry: {
          cyan: "#00E5FF",     // Telemetría nominal activa (SpO2, O2)
          electric: "#38BDF8", // Indicadores de radiofrecuencia y reloj
        },
        flight: {
          nominal: "#10B981",  // Verde: Todos los sistemas en límites seguros
          caution: "#F59E0B",  // Amarillo/Ámbar: Fatiga o elevación metabólica leve
          warning: "#F97316",  // Naranja: Falla secundaria de soporte vital
          emergency: "#EF4444",// Rojo: Descompresión, hipoxia crítica o tormenta solar
        },
        nasa: {
          blue: "#0B3D91",     // Azul oficial NASA Meatball
          red: "#FC3D21",      // Rojo vectorial NASA
        },
      },
      fontFamily: {
        flight: ["Courier New", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;

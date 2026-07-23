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
        centryx: {
          /* Fondos oscuros — Dashboard & SOC Control */
          navy: "#050A14",
          "navy-mid": "#0A1525",
          "navy-card": "#0D1B2E",
          "navy-sidebar": "#101D42",
          /* Acentos — Acciones & Telemetría */
          teal: "#2DD4BF",
          "teal-dark": "#14B8A6",
          blue: "#3B82F6",
          /* Estados de Dispositivo en Tiempo Real */
          green: "#10B981",        // Online / Normal
          warning: "#F97316",      // Alerta / Fuera de perfil
          danger: "#EF4444",       // Bloqueado / Emergencia
          gold: "#FACC15",         // Índice de Foco Excelente
          purple: "#8B5CF6",       // Categorías de Apps
          /* Bordes Glassmorphism */
          "border-dark": "rgba(255,255,255,0.08)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        centryx: "12px",
        "centryx-lg": "16px",
      },
      boxShadow: {
        "centryx-card": "0 0 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        "centryx-glow": "0 0 40px rgba(45,212,191,0.15)",
        "centryx-danger": "0 0 40px rgba(239,68,68,0.2)",
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(16,185,129,0.5)" },
          "50%": { boxShadow: "0 0 0 6px rgba(16,185,129,0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

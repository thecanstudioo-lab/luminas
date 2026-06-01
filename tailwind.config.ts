import type { Config } from "tailwindcss";

/**
 * LUMINAS — Design System (de luminas-design-system/colors_and_type.css)
 * Editorial, ultra-minimalista, ESTRICTAMENTE MONOCROMÁTICO.
 * Mundo cálido sand-and-espresso. Los únicos colores cromáticos —signal (salvia)
 * y busy (arcilla)— se usan EXCLUSIVAMENTE para estados de disponibilidad. Nunca decorativos.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ink — espresso cálido
        ink: {
          900: "#2C261E", // texto primario, CTA
          800: "#3A332A", // superficies café profundo
          700: "#4A4136", // café cálido — ancla del footer
          600: "#6A5D4E", // taupe — secundario oscuro
        },
        // Stone — grises arena cálidos
        stone: {
          500: "#8A7D6C",
          400: "#A89A86",
          300: "#C8BBA6",
          200: "#E4DBCB", // bordes / divisores
          100: "#F0E9DC",
        },
        // Paper — superficies cálidas claras
        cream: "#F4EEE4",     // fondo de página — arena cálida
        paper: "#FCFAF5",     // tarjetas / superficies elevadas
        "paper-dim": "#EBE3D4", // banda alterna — arena profunda (booking)
        // Funcionales — SOLO estado/disponibilidad
        signal: "#647B57",        // disponible / activo — salvia
        "signal-dim": "#E7EAD9",
        busy: "#B07A4B",          // alta demanda — arcilla
        "busy-dim": "#F2E7D6",
        "on-ink": "#FCFAF5",      // texto sobre superficies oscuras
        "on-ink-2": "#BCB1A0",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-archivo)", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["clamp(3.5rem, 8vw, 7.5rem)", { lineHeight: "1.0", letterSpacing: "-0.015em" }],
        h1: ["clamp(2.5rem, 5vw, 4.25rem)", { lineHeight: "1.04", letterSpacing: "-0.015em" }],
        h2: ["clamp(1.9rem, 3.2vw, 2.75rem)", { lineHeight: "1.08", letterSpacing: "-0.015em" }],
        h3: ["clamp(1.35rem, 2vw, 1.75rem)", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        lead: ["clamp(1.05rem, 1.4vw, 1.35rem)", { lineHeight: "1.5" }],
        overline: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.18em" }],
      },
      letterSpacing: {
        tightest: "-0.03em",
        snug: "-0.015em",
        wide018: "0.18em",
      },
      maxWidth: {
        container: "1280px",
      },
      borderRadius: {
        none: "0px",
        xs: "2px",
        sm: "4px",
        pill: "999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(14,14,13,0.04)",
        md: "0 12px 32px -12px rgba(14,14,13,0.18)",
        lg: "0 28px 64px -24px rgba(14,14,13,0.28)",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.22, 1, 0.36, 1)",
        inout: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      transitionDuration: {
        fast: "140ms",
        DEFAULT: "240ms",
        slow: "520ms",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.5" },
          "100%": { transform: "scale(2.6)", opacity: "0" },
        },
        // Fade sutil del numeral cuando cambia la cifra en vivo (sin rebote).
        count: {
          "0%": { opacity: "0", transform: "translateY(2px)" },
          "100%": { opacity: "1", transform: "none" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2s var(--tw-ease, cubic-bezier(0.22,1,0.36,1)) infinite",
        count: "count 240ms cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;

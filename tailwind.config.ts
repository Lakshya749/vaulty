import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#090A0F",
        elevated: "#0F1118",
        surface: "rgba(255, 255, 255, 0.03)",
        "surface-hover": "rgba(255, 255, 255, 0.05)",
        "border-subtle": "rgba(255, 255, 255, 0.08)",
        "glow-violet": "rgba(139, 92, 246, 0.45)",
        "glow-pink": "rgba(236, 72, 153, 0.40)",
        violet: {
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
        },
        fuchsia: {
          500: "#D946EF",
        },
        pink: {
          500: "#EC4899",
        },
        emerald: {
          400: "#34D399",
        },
        acid: "#4ADE80",
        amber: {
          400: "#FBBF24",
        },
        red: {
          400: "#F87171",
        },
        text: {
          primary: "#F5F5FA",
          secondary: "#A1A3B5",
          muted: "#6B6D80",
        },
      },
      borderRadius: {
        card: "28px",
        modal: "24px",
        input: "14px",
      },
      boxShadow: {
        card: "0 8px 40px rgba(0, 0, 0, 0.45)",
        "glow-violet": "0 0 32px rgba(139, 92, 246, 0.35)",
        "glow-pink": "0 0 32px rgba(236, 72, 153, 0.30)",
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(135deg, #7C3AED 0%, #C026D3 55%, #EC4899 100%)",
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        colombia: {
          yellow: "#FCD116",
          blue: "#003893",
          red: "#CE1126",
          "yellow-light": "#FDE768",
          "yellow-dark": "#E0B800",
          "blue-light": "#1A5CC8",
          "blue-dark": "#002766",
          "red-light": "#E8384F",
          "red-dark": "#A80D1E",
        },
        surface: {
          DEFAULT: "#F8F9FA",
          dark: "#1E1E2E",
        },
        text: {
          primary: "#1A1A2E",
          secondary: "#6B7280",
          "primary-dark": "#F1F1F1",
          "secondary-dark": "#9CA3AF",
        },
      },
      animation: {
        "spin-slow": "spin 2s linear infinite",
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "flip-in": "flipIn 0.6s ease-in-out",
        "flip-out": "flipOut 0.6s ease-in-out",
        "pulse-gentle": "pulseGentle 2s ease-in-out infinite",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-top": "env(safe-area-inset-top)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        flipIn: {
          "0%": { transform: "rotateY(90deg)", opacity: "0" },
          "100%": { transform: "rotateY(0deg)", opacity: "1" },
        },
        flipOut: {
          "0%": { transform: "rotateY(0deg)", opacity: "1" },
          "100%": { transform: "rotateY(90deg)", opacity: "0" },
        },
        pulseGentle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

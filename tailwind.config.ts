import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563eb",
          green: "#16a34a",
          ink: "#0f172a",
          mist: "#f8fafc",
          line: "#dbe4ee"
        }
      },
      boxShadow: {
        card: "0 18px 50px -24px rgba(15, 23, 42, 0.24)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        appear: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0px)" }
        },
        pulseRing: {
          "0%": { transform: "scale(0.92)", opacity: "0.55" },
          "100%": { transform: "scale(1.18)", opacity: "0" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        appear: "appear 0.7s ease forwards",
        pulseRing: "pulseRing 2.8s ease-out infinite"
      },
      backgroundImage: {
        hero:
          "radial-gradient(circle at top left, rgba(37, 99, 235, 0.14), transparent 28%), radial-gradient(circle at bottom right, rgba(22, 163, 74, 0.14), transparent 24%)"
      }
    }
  },
  plugins: []
};

export default config;

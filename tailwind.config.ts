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
        brand: {
          navy: "#111827",
          blue: "#2563eb",
          soft: "#f8fafc"
        }
      },
      boxShadow: {
        premium: "0 24px 80px rgba(15, 23, 42, 0.12)"
      }
    },
  },
  plugins: [],
};
export default config;

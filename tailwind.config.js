/** @type {import('tailwindcss').Config} */
import aspectRatio from "@tailwindcss/aspect-ratio";
import typography from "@tailwindcss/typography";

const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./index.html", "./src/**/*.ts"],
  darkMode: "selector",
  plugins: [typography, aspectRatio],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1280px",
      "2xl": "1536px",
    },
    colors: {
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
      },
      indigo: {
        400: '#818cf8',
        500: '#6366f1',
        600: '#4f46e5',
        900: '#312e81',
      },
      emerald: {
        500: '#10b981',
        600: '#059669',
      },
      rose: {
        500: '#f43f5e',
        600: '#e11d48',
      }
    },
    transitionProperty: {
      'height': 'height',
      'spacing': 'margin, padding',
    }
  },
};

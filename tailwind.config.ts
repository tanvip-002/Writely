import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        parchment: {
          50: "#FAF7F2",
          100: "#F4EFE6",
          200: "#E9DFD0",
          300: "#DBCDB7",
          400: "#C4B296",
          500: "#A89476",
          600: "#8B775C",
          700: "#6F5D46",
          800: "#534433",
          900: "#382D22",
        },
        ink: {
          50: "#F6F7F9",
          100: "#ECEEF2",
          200: "#D5D9E2",
          300: "#ADB5C7",
          400: "#7C8BA6",
          500: "#566785",
          600: "#41506B",
          700: "#323E53",
          800: "#222B3A",
          900: "#131923",
          950: "#0B0F17",
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "68ch",
            color: "inherit",
            p: {
              lineHeight: "1.8",
              marginBottom: "1.4em",
            },
            h1: {
              fontFamily: "var(--font-serif)",
              fontWeight: "700",
              letterSpacing: "-0.02em",
            },
            h2: {
              fontFamily: "var(--font-serif)",
              fontWeight: "600",
              letterSpacing: "-0.015em",
            },
            h3: {
              fontFamily: "var(--font-serif)",
              fontWeight: "600",
            },
            blockquote: {
              fontStyle: "italic",
              borderLeftColor: "hsl(var(--primary))",
              opacity: "0.9",
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};
export default config;

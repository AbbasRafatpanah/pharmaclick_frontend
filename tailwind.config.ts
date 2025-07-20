import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-vazirmatn)", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "0.4" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-25px)" },
        },
        scaleUp: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce-slow 3s ease-in-out infinite",
        "scale-up": "scaleUp 0.3s ease-out forwards",
        "slide-down": "slideDown 0.3s ease-out forwards",
        "slide-right": "slideRight 0.3s ease-out forwards",
        "fade-in": "fadeIn 0.3s ease-out forwards",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: 'var(--tw-prose-body)',
            '[dir="rtl"] &': {
              h1: {
                fontWeight: '800',
              },
              'h1, h2, h3, h4': {
                fontWeight: '700',
                marginTop: '1.5em',
                marginBottom: '0.5em',
              },
              p: {
                marginTop: '1.25em',
                marginBottom: '1.25em',
              },
              img: {
                marginTop: '2em',
                marginBottom: '2em',
              },
              blockquote: {
                fontWeight: '500',
                fontStyle: 'normal',
                borderRightWidth: '0.25rem',
                borderLeftWidth: '0',
                borderColor: 'var(--tw-prose-quote-borders)',
                paddingRight: '1em',
                paddingLeft: '0',
              },
              hr: {
                marginTop: '3em',
                marginBottom: '3em',
              },
              ul: {
                paddingRight: '1.625em',
                paddingLeft: '0',
              },
              ol: {
                paddingRight: '1.625em',
                paddingLeft: '0',
              },
              'ul > li': {
                paddingRight: '0.375em',
                paddingLeft: '0',
              },
              'ol > li': {
                paddingRight: '0.375em',
                paddingLeft: '0',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};

export default config; 
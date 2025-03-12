/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
        // Style guide colors
        greyscale: {
          0: "#020202",
          1: "#0E0E0E",
          2: "#202020",
          3: "#343434",
          4: "#4A4A4A",
          5: "#606060",
          6: "#777777",
          7: "#909090",
          8: "#A9A9A9",
          9: "#C3C3C3",
          10: "#DDDDDD",
          11: "#F8F8F8",
        },
        blue: {
          4: "#2020E0", // Estimated value
          5: "#3737F2", // Primary Blue
          6: "#4C53FF", // Accent Color
          7: "#6D77FF", // Accent Color
          8: "#8E96FF", // Estimated value
          9: "#AFB5FF", // Estimated value
        },
        violet: {
          4: "#6020A0", // Estimated value
          5: "#7834BB", // Main Color
          6: "#914BDC", // Main Color
          7: "#A96AF3", // Main Color
          8: "#C189FF", // Estimated value
          9: "#D8A8FF", // Estimated value
        },
        vermilion: {
          4: "#D03020", // Estimated value
          5: "#E03C30", // Estimated value
          6: "#F04535", // Estimated value
          7: "#F34E3F", // Brand Color
          8: "#FF7867", // Supporting
          9: "#FFA293", // Supporting
          10: "#FFCCC3", // Estimated value
          11: "#FFE6E2", // Estimated value
        },
        green: {
          5: "#266F58", // Primary Shade
          6: "#3C886F", // Primary Shade
          7: "#5AA088", // Accent Shade
        },
        teal: {
          5: "#0080A0", // Estimated value
          6: "#0090B4", // Estimated value
          7: "#00A0C8", // Primary Teal
          8: "#4DB8DA", // Secondary Teal
        },
        // Brand colors (legacy - maintained for compatibility)
        brand: {
          primary: "#3737F2", // Blue-5
          secondary: "#F5F7FA",
          accent: "#F34E3F", // Vermilion-7
          success: "#3C886F", // Green-6
          warning: "#FFAB00",
          error: "#F34E3F", // Vermilion-7
          text: "#172B4D",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'h1': '32px',
        'h2': '24px',
        'h3': '20px',
        'body': ['14px', '1.5'],
        'body-lg': ['16px', '1.5'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in-up": {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        "fade-out-down": {
          from: { opacity: 1, transform: 'translateY(0)' },
          to: { opacity: 0, transform: 'translateY(10px)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.3s ease-out",
        "fade-out-down": "fade-out-down 0.3s ease-out",
      },
    },
  },
  plugins: [
    // Using proper ES modules import
    tailwindcssAnimate
  ],
}

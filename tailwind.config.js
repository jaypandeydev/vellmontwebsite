/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
    './src/invitation-manager/**/*.{js,jsx}', 
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
        'pastel-blue': {
          light: '#E0E7FF', // Lightest for backgrounds
          DEFAULT: '#C7D2FE', // Main pastel blue
          dark: '#A5B4FC',   // Darker shade for accents/text
          extralight: '#F0F3FF', // Even lighter for input backgrounds
        },
        'pastel-pink': {
          light: '#FCE7F3',
          DEFAULT: '#FBCFE8',
          dark: '#F9A8D4',
        },
        'pastel-green': {
          light: '#D1FAE5',
          DEFAULT: '#A7F3D0',
          dark: '#6EE7B7',
        },
        'pastel-purple': {
          light: '#EDE9FE',
          DEFAULT: '#DDD6FE',
          dark: '#C4B5FD',
        },
        'pastel-yellow': {
          light: '#FEF9C3',
          DEFAULT: '#FEF08A',
          dark: '#FDE047',
        },
        'pastel-purple-dark': '#581c87', // For main headings in IM
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 15px 5px rgba(128, 0, 128, 0.4)" },
          "50%": { boxShadow: "0 0 25px 10px rgba(128, 0, 128, 0.7)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "floating": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s infinite ease-in-out",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
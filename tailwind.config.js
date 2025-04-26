/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
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
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-5px)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        "fade": {
          "0%": { opacity: 1 },
          "50%": { opacity: 0.3 },
          "100%": { opacity: 1 },
        },
        "reveal": {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "flip": {
          "0%": { transform: "perspective(400px) rotateY(0)" },
          "100%": { transform: "perspective(400px) rotateY(360deg)" },
        },
        "slide-right": {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(20px)' },
        },
        "shimmer": {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        "morph": {
          '0%': { 
            borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%',
            transform: 'rotate(0deg) scale(1)' 
          },
          '25%': { 
            borderRadius: '40% 60% 50% 50%/40% 50% 50% 60%',
            transform: 'rotate(1deg) scale(1.01)'
          },
          '50%': { 
            borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%',
            transform: 'rotate(2deg) scale(1.02)'
          },
          '75%': { 
            borderRadius: '50% 50% 40% 60%/60% 40% 60% 40%',
            transform: 'rotate(1deg) scale(1.01)'
          },
          '100%': { 
            borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%',
            transform: 'rotate(0deg) scale(1)'
          },
        },
        "morph-subtle": {
          '0%': { 
            borderRadius: '55% 45% 40% 60%/55% 40% 60% 45%',
            transform: 'rotate(0deg)' 
          },
          '50%': { 
            borderRadius: '45% 55% 60% 40%/50% 55% 45% 55%',
            transform: 'rotate(1deg)'
          },
          '100%': { 
            borderRadius: '55% 45% 40% 60%/55% 40% 60% 45%',
            transform: 'rotate(0deg)'
          },
        },
        "morph-medium": {
          '0%': { 
            borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%',
            transform: 'rotate(0deg) scale(1)' 
          },
          '33%': { 
            borderRadius: '30% 70% 70% 30%/30% 70% 30% 70%',
            transform: 'rotate(2deg) scale(1.02)'
          },
          '66%': { 
            borderRadius: '70% 30% 30% 70%/70% 30% 70% 30%',
            transform: 'rotate(-2deg) scale(1.02)'
          },
          '100%': { 
            borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%',
            transform: 'rotate(0deg) scale(1)'
          },
        },
        "morph-strong": {
          '0%': { 
            borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%',
            transform: 'rotate(0deg) scale(1)'
          },
          '20%': { 
            borderRadius: '20% 80% 30% 70%/30% 50% 70% 70%',
            transform: 'rotate(3deg) scale(1.03)'
          },
          '40%': { 
            borderRadius: '80% 20% 70% 30%/40% 30% 70% 60%',
            transform: 'rotate(-3deg) scale(1.03)'
          },
          '60%': { 
            borderRadius: '30% 70% 80% 20%/60% 80% 20% 40%',
            transform: 'rotate(3deg) scale(1.03)'
          },
          '80%': { 
            borderRadius: '70% 30% 20% 80%/70% 20% 80% 30%',
            transform: 'rotate(-3deg) scale(1.03)'
          },
          '100%': { 
            borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%',
            transform: 'rotate(0deg) scale(1)'
          },
        },
        "wave": {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(10deg)' },
          '75%': { transform: 'rotate(-10deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        "spotlight": {
          '0%': { transform: 'translate(0%, 0%) scale(1)', opacity: 0.5 },
          '33%': { transform: 'translate(2%, -2%) scale(1.05)', opacity: 0.7 },
          '66%': { transform: 'translate(-2%, 2%) scale(0.95)', opacity: 0.6 },
          '100%': { transform: 'translate(0%, 0%) scale(1)', opacity: 0.5 },
        },
        "spotlight-alt": {
          '0%': { transform: 'translate(0%, 0%) scale(1)', opacity: 0.5 },
          '33%': { transform: 'translate(-2%, 2%) scale(1.05)', opacity: 0.7 },
          '66%': { transform: 'translate(2%, -2%) scale(0.95)', opacity: 0.6 },
          '100%': { transform: 'translate(0%, 0%) scale(1)', opacity: 0.5 },
        },
        "ripple": {
          "0%": { transform: "scale(0)", opacity: 1 },
          "100%": { transform: "scale(4)", opacity: 0 }
        },
        "float-smooth": {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
          "100%": { transform: "translateY(0px)" }
        },
        "glow": {
          "0%": { boxShadow: "0 0 5px rgba(147, 51, 234, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(147, 51, 234, 0.8)" },
          "100%": { boxShadow: "0 0 5px rgba(147, 51, 234, 0.5)" }
        },
        "typewriter": {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        "glitch": {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" }
        },
        "swing": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(5deg)" },
          "75%": { transform: "rotate(-5deg)" }
        },
        "spiral": {
          "from": { transform: "rotate(0deg) scale(0)" },
          "to": { transform: "rotate(360deg) scale(1)" }
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "elastic": {
          "0%": { transform: "scale(1)" },
          "25%": { transform: "scale(0.95)" },
          "50%": { transform: "scale(1.1)" },
          "75%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" }
        },
        "jello": {
          "0%, 100%": { transform: "skewX(0) skewY(0)" },
          "25%": { transform: "skewX(15deg) skewY(15deg)" },
          "75%": { transform: "skewX(-15deg) skewY(-15deg)" }
        },
        "vibrate": {
          "0%, 100%": { transform: "translate(0)" },
          "25%": { transform: "translate(-1px)" },
          "75%": { transform: "translate(1px)" }
        },
        "pop": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" }
        },
        "magnetic": {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(var(--mx, 0), var(--my, 0))" }
        },
        "tilt": {
          "0%": { transform: "perspective(1000px) rotateX(0) rotateY(0)" },
          "100%": { transform: "perspective(1000px) rotateX(var(--rotateX, 0)) rotateY(var(--rotateY, 0))" }
        },
        "color-shift": {
          "0%": { filter: "hue-rotate(0deg)" },
          "100%": { filter: "hue-rotate(360deg)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "blob": "blob 7s infinite",
        "bounce": "bounce 1s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin-slow 6s linear infinite",
        "fade": "fade 2s ease-in-out infinite",
        "reveal": "reveal 0.8s ease-out forwards",
        "flip": "flip 1s ease-in-out",
        "slide": "slide 1s ease-in-out infinite",
        "slide-right": "slide-right 3s ease-in-out infinite",
        "shimmer": "shimmer 8s ease-in-out infinite",
        "morph": "morph 10s ease-in-out infinite",
        "morph-subtle": "morph-subtle 10s ease-in-out infinite",
        "morph-medium": "morph-medium 8s ease-in-out infinite",
        "morph-strong": "morph-strong 6s ease-in-out infinite",
        "wave": "wave 1.5s ease-in-out infinite",
        "spotlight": "spotlight 15s ease-in-out infinite",
        "spotlight-alt": "spotlight-alt 15s ease-in-out infinite",
        "typewriter": "typewriter 2s steps(40, end) forwards",
        "glitch": "glitch 0.5s ease-in-out infinite",
        "swing": "swing 2s ease-in-out infinite",
        "spiral": "spiral 1s ease-in-out",
        "elastic": "elastic 1s ease-in-out",
        "jello": "jello 1s ease-in-out infinite",
        "vibrate": "vibrate 0.3s linear infinite",
        "ripple": "ripple 3s linear infinite",
        "pop": "pop 2s ease-in-out infinite",
        "bounce-slow": "bounce-slow 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "magnetic": "magnetic 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "tilt": "tilt 0.2s ease-out",
        "color-shift": "color-shift 3s linear infinite"
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: '500',
            },
            strong: {
              color: 'inherit',
            },
            code: {
              color: 'inherit',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    require("@tailwindcss/typography")
  ],
} 
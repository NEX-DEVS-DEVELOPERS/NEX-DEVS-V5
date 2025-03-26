import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        marquee2: 'marquee2 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        'marquee2-reverse': 'marquee2-reverse 25s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'scale': 'scale 0.3s ease-in-out',
        'slide-in': 'slide-in 0.6s ease-out',
        'slide-out': 'slide-out 0.6s ease-out',
        'slide-from-right': 'slide-from-right 20s linear infinite',
        'slide-from-left': 'slide-from-left 20s linear infinite',
        'text-slide': 'text-slide 1s cubic-bezier(0.4, 0, 0.2, 1)',
        'infinite-slide': 'infinite-slide 25s linear infinite',
        'infinite-slide-reverse': 'infinite-slide-reverse 25s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'marquee2-reverse': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scale: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        'slide-from-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'slide-from-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'text-slide': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '50%': { transform: 'translateY(-10%)', opacity: '0.5' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'infinite-slide': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'infinite-slide-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

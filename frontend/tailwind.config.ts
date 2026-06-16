/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b', // darker, cleaner slate
        card: 'rgba(24, 24, 27, 0.7)', // subtle dark gray for glass
        cardHover: 'rgba(39, 39, 42, 0.8)',
        border: 'rgba(255, 255, 255, 0.08)',
        primary: '#3b82f6', // Apple-like blue
        primaryGlow: 'rgba(59, 130, 246, 0.3)',
        secondary: '#8b5cf6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        converted: '#8b5cf6',
        textPrimary: '#f8fafc',
        textMuted: '#a1a1aa', // softer muted
        whatsapp: '#25D366',
        email: '#3b82f6',
        webchat: '#06b6d4',
        push: '#f97316'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.15), transparent 50%)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(100%)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}

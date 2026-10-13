/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--rgb-primary) / <alpha-value>)',
        'primary-hover': 'rgb(var(--rgb-primary-hover) / <alpha-value>)',
        secondary: 'rgb(var(--rgb-secondary) / <alpha-value>)',
        accent: 'rgb(var(--rgb-accent) / <alpha-value>)',
        background: 'rgb(var(--rgb-background) / <alpha-value>)',
        surface: 'rgb(var(--rgb-surface) / <alpha-value>)',
        'text-primary': 'rgb(var(--rgb-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--rgb-text-secondary) / <alpha-value>)',
        border: 'rgb(var(--rgb-border) / <alpha-value>)',
        success: 'rgb(var(--rgb-success) / <alpha-value>)',
        warning: 'rgb(var(--rgb-warning) / <alpha-value>)',
        error: 'rgb(var(--rgb-error) / <alpha-value>)',
        info: 'rgb(var(--rgb-info) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};

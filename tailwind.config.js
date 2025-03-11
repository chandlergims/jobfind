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
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          active: 'var(--sidebar-active)',
          accent: 'var(--sidebar-accent)',
          border: 'var(--sidebar-border)',
        },
        brand: {
          600: 'var(--brand-600)',
        },
      },
      height: {
        'svh': '100svh',
      },
      minHeight: {
        'svh': '100svh',
      },
    },
  },
  plugins: [],
}

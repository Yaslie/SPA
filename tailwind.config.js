/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        country: {
          primary: '#0f766e',
          secondary: '#2563eb',
          accent: '#f59e0b',
          neutral: '#172554',
          'base-100': '#f8fafc',
          'base-200': '#e2e8f0',
          'base-300': '#cbd5e1',
          info: '#0284c7',
          success: '#16a34a',
          warning: '#d97706',
          error: '#dc2626',
        },
      },
      'light',
      'dark',
    ],
  },
};

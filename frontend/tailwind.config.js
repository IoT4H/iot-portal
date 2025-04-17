/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        base: {
          '100': '#000000',
          '200': '#1f1f22',
          '300': '#34363c',
          'content': '#f0f8ff',
        },
        neutral: {
          'DEFAULT': '#1f1f22',
          'content': '#f0f8ff',
        },
        primary: {
          DEFAULT: '#f97316',
          content: '#ffffff',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--base-100': theme('colors.base.100'),
          '--base-200': theme('colors.base.200'),
          '--base-300': theme('colors.base.300'),
          '--base-content': theme('colors.base.content'),
          '--neutral': theme('colors.neutral.DEFAULT'),
          '--neutral-content': theme('colors.neutral.content'),
          '--primary': theme('colors.primary.DEFAULT'),
          '--primary-content': theme('colors.primary.content'),
        },
      });
    }),
  ],
}

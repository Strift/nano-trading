const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      red: colors.red,
      green: colors.green,
      gray: {
        lighter: '#F4F7FA',
        light: '#E5E5E5',
        DEFAULT: '#C4C4C4',
        dark: '#5F6E85'
      },
      brand: '#b300de'
    },
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
}

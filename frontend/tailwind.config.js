/** @type {import('tailwindcss').Config} */

import typography from "@tailwindcss/typography";

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cimb: {
          red: '#C1272D',
          dark: '#A01D22',
          light: '#F9E6E7',
        },
      },
    },
  },
  plugins: [typography],
}
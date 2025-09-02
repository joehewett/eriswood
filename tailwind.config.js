import { fontFamily } from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        handwritten: ['Caveat', 'cursive', ...fontFamily.serif],
        pixel: ['Press Start 2P', 'monospace'],
      },
    },
  },
}

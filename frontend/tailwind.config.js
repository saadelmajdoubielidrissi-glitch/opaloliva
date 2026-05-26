/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4a5c3a',
        'primary-dark': '#3a482d',
        accent: '#c8853a',
        'accent-dark': '#b07430',
        bg: '#f7f3ec',
        'bg-alt': '#efe8d8',
        dark: '#1a2214',
        'dark-alt': '#232c1c',
        cream: '#f0e6d2',
        muted: '#6b6b6b',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Lato', 'system-ui', 'sans-serif'],
        accent: ['Cormorant Garamond', 'Georgia', 'serif'],
        hand: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
}

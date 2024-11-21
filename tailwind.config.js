/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this based on your file structure
  ],
  darkMode: 'class', // Enable dark mode using a class
  theme: {
    extend: {
      colors: {
        // Add custom colors for dark mode or extend existing colors
        primary: '#0c9b6b',
        secondary: '#2c3e50',
        accent: '#f39d12a9',
        background: {
          light: '#3ce6ad33',
          dark: '#474747',
        },
        text: {
          light: '#000000',
          dark: '#FAFFFD',
        },
      },
    },
  },
  plugins: [],
}
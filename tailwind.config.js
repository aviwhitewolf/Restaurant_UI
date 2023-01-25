module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontFamily: {
      display: ['Pally', 'Comic Sans MS', 'sans-serif'],
      body: ['Pally', 'Comic Sans MS', 'sans-serif'],
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    
  ],
}
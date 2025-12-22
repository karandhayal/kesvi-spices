/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PAROSA BRAND PALETTE
        'parosa-dark': '#4A3728',    // Deep Grain Brown (Primary Text & Buttons)
        'parosa-accent': '#C59D5F',  // Mustard Gold (Badges & Highlights)
        'parosa-bg': '#FFFDF5',      // Warm Cream (Main Background)
        'parosa-red': '#B22222',     // Jodhpuri Chili Red (Spices/Alerts)
        'parosa-muted': '#F4F1EA',   // Soft Stone (Secondary Backgrounds)
      },
      fontFamily: {
        // Elegant Serif for Headings
        serif: ['Playfair Display', 'serif'],
        // Clean Sans-Serif for Body text
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        // High-end brand spacing
        'ultra-wide': '0.3em',
        'loose': '0.1em',
      },
      animation: {
        'fadeIn': 'fadeIn 1s ease-in forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
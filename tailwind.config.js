/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import aspectRatio from '@tailwindcss/aspect-ratio';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      colors: {
        primary: '#3BAA7F',       
        primaryLight: '#CFEBDD',   
        accent: '#F9B572',         
        background: '#EAF7F0',     
        surface: '#FFFFFF',
        textPrimary: '#1B1B1B',
        textSecondary: '#4B5563',
      },
      borderRadius: {
        card: '16px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '6px 6px 0 0 rgba(0,0,0,0.15)',
        brutal: '6px 6px 0 0 rgba(0,0,0,0.8)',
        brutalSm: '4px 4px 0 0 rgba(0,0,0,0.6)'
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [forms, typography, aspectRatio],
}

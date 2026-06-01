export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pulpe:   { DEFAULT: '#FFA43A', light: '#FFB85C', dark: '#E8891A' },
        solara:  { DEFAULT: '#FFC065', light: '#FFD08A', dark: '#E8A040' },
        zephir:  { DEFAULT: '#FEE4B8', light: '#FFF3DC', dark: '#F5CC88' },
        mistral: { DEFAULT: '#A3DFF1', light: '#C4ECFA', dark: '#72C8E5' },
        oxford:  { DEFAULT: '#0B0829', light: '#1A1640', dark: '#050418' },
        // aliases pour compatibilité
        orange: { DEFAULT: '#FFA43A', light: '#FFB85C', dark: '#E8891A' },
        amande: { DEFAULT: '#FEE4B8', light: '#FFF3DC', dark: '#F5CC88' },
        bleu:   { DEFAULT: '#A3DFF1', light: '#C4ECFA', dark: '#72C8E5' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    }
  },
  plugins: [],
}

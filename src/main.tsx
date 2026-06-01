import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

// Appliquer preset + thème sauvegardés avant le premier rendu
const savedPreset = localStorage.getItem('accesiste_preset');
if (savedPreset) document.documentElement.setAttribute('data-preset', savedPreset);
const savedTheme = localStorage.getItem('accesiste_theme');
if (savedTheme === 'Sombre') document.documentElement.setAttribute('data-theme', 'sombre');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

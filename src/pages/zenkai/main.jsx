import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/red-hat-display'
import '@fontsource-variable/red-hat-mono'
import './theme.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

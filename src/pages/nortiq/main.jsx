import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/radio-canada-big'
import '@fontsource-variable/radio-canada'
import './theme.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

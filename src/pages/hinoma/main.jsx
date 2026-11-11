import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/hanken-grotesk'
import '@fontsource/shippori-mincho/400.css'
import '@fontsource/shippori-mincho/500.css'
import '@fontsource/zen-kaku-gothic-new/400.css'
import './theme.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

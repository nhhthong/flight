import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/cormorant'
import '@fontsource-variable/instrument-sans'
import './theme.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// The Japanese face is ~200 kB of @font-face rules: fetched after first paint, never render-blocking.
const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 200))
idle(() => import('../../shared/fonts-mincho.js'))

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/hanken-grotesk'
import './theme.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// The Japanese faces ship as ~400 kB of @font-face rules. Loading them after first paint keeps
// that out of the render-blocking stylesheet; the browser still fetches only the glyph ranges it needs.
const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 200))
idle(() => import('./fonts-ja.js'))

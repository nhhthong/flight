# Five companies, five interfaces

A GitHub Pages site with five landing pages for five invented companies. Each page has its own typography, colour, layout and motion.

| Page | Company | Design |
| --- | --- | --- |
| `/nortiq/` | Software outsourcing | Swiss poster grid, a live rate calculator |
| `/orvo/` | Smartphones | Scroll-driven scenes: a turning phone, a 10x zoom, a sideways tour |
| `/gravon/` | Industrial robots | A blueprint sheet with a robot arm that moves on scroll |
| `/hinoma/` | Ceramics (English and Japanese) | three.js pottery: glaze a jar, throw and fire a bowl on scroll |
| `/sootfox/` | Game studio | Draggable die-cut stickers and a playable round |

Every company, person, product and figure is fictional. The contact forms are simulations and send nothing.

## Stack

React 19, Vite, Tailwind CSS 4, Motion, three.js with React Three Fiber. Fonts are self-hosted through Fontsource.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

The build is a multi-page static site in `dist/`, with relative asset paths so it works under any base path.

## Deploy

`.github/workflows/deploy.yml` builds and publishes `dist/` on every push. In the repository settings, set **Pages → Source** to **GitHub Actions**.

## Structure

```
index.html            home page
<company>/index.html  one entry per company
src/pages/<company>/  App.jsx, theme.css, main.jsx
src/shared/           shared hooks, site switcher, base styles
```

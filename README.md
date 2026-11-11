<h1 align="center">Five companies, five interfaces</h1>

<p align="center">
  Five landing pages for five invented companies.<br />
  Each one has its own typography, colour, layout and way of moving.
</p>

<p align="center">
  <a href="https://github.com/nhhthong/flight/actions/workflows/deploy.yml"><img alt="Deploy" src="https://github.com/nhhthong/flight/actions/workflows/deploy.yml/badge.svg" /></a>
  <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
  <img alt="React 19" src="https://img.shields.io/badge/React-19-149eca.svg" />
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind-4-38bdf8.svg" />
  <img alt="three.js" src="https://img.shields.io/badge/three.js-r187-000000.svg" />
</p>

<p align="center">
  <a href="https://nhhthong.github.io/flight/"><strong>Live demo</strong></a>
</p>

<p align="center">
  <img src="docs/screenshots/hub-hero.jpg" alt="Home page listing the five sites" width="860" />
</p>

## The five sites

Every company, person, product and figure is fictional. The contact forms are simulations and send nothing.

### Nortiq: software outsourcing

A Swiss poster grid. Type is the picture, flat colour fields carry the sections, and a live calculator prices a team as you move a slider.

<p>
  <img src="docs/screenshots/nortiq-hero.jpg" alt="Nortiq hero" width="49%" />
  <img src="docs/screenshots/nortiq-scene.jpg" alt="Nortiq rate calculator" width="49%" />
</p>

### Orvo: smartphones

Scroll-driven scenes. A phone built from CSS turns from back to front, a camera zooms from 0.6x to 10x onto a lighthouse, and the spec cards tour sideways.

<p>
  <img src="docs/screenshots/orvo-hero.jpg" alt="Orvo hero" width="49%" />
  <img src="docs/screenshots/orvo-scene.jpg" alt="Orvo camera zoom scene" width="49%" />
</p>

### Gravon: industrial robots

A blueprint sheet. A six-axis arm is drawn with forward kinematics and moves between three jobs as you scroll. A payback calculator and an install-day timeline follow.

<p>
  <img src="docs/screenshots/gravon-hero.jpg" alt="Gravon hero" width="49%" />
  <img src="docs/screenshots/gravon-scene.jpg" alt="Gravon pinned robot scene" width="49%" />
</p>

### Hinoma: ceramics, in English and Japanese

Pottery rendered with three.js. Change the glaze of a jar, pick pieces from a shelf, and follow one bowl through wedging, throwing, glazing and firing as the page scrolls. A toggle switches the whole page between English and Japanese.

<p>
  <img src="docs/screenshots/hinoma-hero.jpg" alt="Hinoma hero" width="49%" />
  <img src="docs/screenshots/hinoma-scene.jpg" alt="Hinoma firing scene" width="49%" />
</p>

### Sootfox: game studio

Die-cut stickers you can drag, a playable round of the studio's game, and a crew shown as a party of adventurers.

<p>
  <img src="docs/screenshots/sootfox-hero.jpg" alt="Sootfox hero" width="49%" />
  <img src="docs/screenshots/sootfox-scene.jpg" alt="Sootfox playable round" width="49%" />
</p>

## Stack

- [React](https://react.dev) 19 and [Vite](https://vitejs.dev) in multi-page mode
- [Tailwind CSS](https://tailwindcss.com) 4
- [Motion](https://motion.dev) for scroll and layout animation
- [three.js](https://threejs.org) with [React Three Fiber](https://r3f.docs.pmnd.rs) for the Hinoma scenes
- Self-hosted fonts through [Fontsource](https://fontsource.org)

## Getting started

Requires Node 20 or newer.

```bash
npm install
npm run dev
```

Build and preview the production site:

```bash
npm run build
npm run preview
```

The build is a static site in `dist/`. Asset paths are relative, so it works under any base path.

## Project structure

```
index.html              Home page
<company>/index.html    One HTML entry per company
src/pages/<company>/    App.jsx, theme.css, main.jsx
src/pages/hinoma/       Also scene.jsx, the three.js scenes
src/shared/             Shared hooks, site switcher and base styles
docs/screenshots/       Images used in this README
```

Each company is its own Vite entry with its own stylesheet and fonts, so no page pays for another page's code.

## Deployment

`.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages on every push. Before the first run, set **Settings → Pages → Source** to **GitHub Actions**.

## Accessibility

- Every control is reachable by keyboard and shows a visible focus ring.
- Animations respect `prefers-reduced-motion`.
- Contact forms use visible labels and announce their result.

## License

[MIT](LICENSE)

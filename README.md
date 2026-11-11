<h1 align="center">Nine companies, nine interfaces</h1>

<p align="center">
  Nine landing pages for nine invented companies.<br />
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
  <img src="docs/screenshots/hub-hero.jpg" alt="Home page listing the nine sites" width="860" />
</p>

## The nine sites

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

### Corsara: supercars

Full-bleed photographs and wide type on black. A stock list you can filter by maker, the makers' published figures for each model, and a loan calculator that reprices as you move the sliders.

<p>
  <img src="docs/screenshots/corsara-hero.jpg" alt="Corsara hero" width="49%" />
  <img src="docs/screenshots/corsara-scene.jpg" alt="Corsara finance calculator" width="49%" />
</p>

### Shiosai: Japanese restaurant

An eight-seat counter in Kanazawa. A menu that changes with the season you pick, vertical Japanese script, a sideways strip of dishes, and a booking form where you choose seats at the counter.

<p>
  <img src="docs/screenshots/shiosai-hero.jpg" alt="Shiosai hero" width="49%" />
  <img src="docs/screenshots/shiosai-scene.jpg" alt="Shiosai menu" width="49%" />
</p>

### Sekitei: karesansui gardens

Dry stone gardens, designed, built and kept. Stone, gravel and a lot of empty space, a patch of gravel you can rake with the pointer, and an estimator that sizes a garden.

<p>
  <img src="docs/screenshots/sekitei-hero.jpg" alt="Sekitei hero" width="49%" />
  <img src="docs/screenshots/sekitei-scene.jpg" alt="Sekitei, the three materials" width="49%" />
</p>

### Zenkai: radio-controlled cars

The first screen is a three.js yard. Press Take the wheel and drive the car with W A S D, the arrow keys or the on-screen pad: knock cones over, slide on the handbrake, collect the green cells. Each of the three models has its own speed and grip.

<p>
  <img src="docs/screenshots/zenkai-hero.jpg" alt="Zenkai hero" width="49%" />
  <img src="docs/screenshots/zenkai-scene.jpg" alt="Zenkai, driving the car" width="49%" />
</p>

## Stack

- [React](https://react.dev) 19 and [Vite](https://vitejs.dev) in multi-page mode
- [Tailwind CSS](https://tailwindcss.com) 4
- [Motion](https://motion.dev) for scroll and layout animation
- [three.js](https://threejs.org) with [React Three Fiber](https://r3f.docs.pmnd.rs) for the Hinoma scenes and the Zenkai yard
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
src/pages/zenkai/       Also scene.jsx, the drivable yard
src/shared/             Shared hooks, site switcher, Photo component and base styles
src/shared/photos/      One manifest per site: sizes, placeholder colour, credits
public/photos/          The photographs, as AVIF and WebP in three widths
scripts/photos.py       Fetches and resizes the photographs
docs/screenshots/       Images used in this README
```

Each company is its own Vite entry with its own stylesheet and fonts, so no page pays for another page's code.

## Loading fast

- three.js is never in a page's first bundle. Hinoma and Zenkai load their scenes as a separate chunk after the text has painted, and a canvas only renders while it is on screen.
- The Japanese typefaces are loaded after first paint, so their `@font-face` rules do not block rendering.
- Photographs are AVIF with a WebP fallback at 480, 960 and 1600 px. A typical 1600 px AVIF is about 100 kB; the gravel gardens compress worst and reach 400 kB. Every photo reserves its box and shows its average colour until it arrives, and all but the first screen load lazily.

## Photographs

The photographs come from [Wikimedia Commons](https://commons.wikimedia.org) under CC0, CC BY and CC BY-SA licences. Each page lists its photographers in the footer under Photo credits. They show real cars, food and gardens, not the invented companies. Orvo, Gravon and Sootfox are drawn in code on purpose and use no photographs.

`scripts/photos.src.json` lists every file with its author and licence. To add or change one, edit that list and run:

```bash
python3 scripts/photos.py
```

It needs Python 3 with Pillow 11 or newer.

## Deployment

`.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages on every push. Before the first run, set **Settings → Pages → Source** to **GitHub Actions**.

## Accessibility

- Every control is reachable by keyboard and shows a visible focus ring.
- Animations respect `prefers-reduced-motion`.
- Contact forms use visible labels and announce their result.

## License

[MIT](LICENSE)

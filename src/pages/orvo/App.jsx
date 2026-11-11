import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'motion/react'
import { SiteSwitcher, useMockForm } from '../../shared/ui.jsx'

const COLOURS = [
  { id: 'basalt', name: 'Basalt', a: '#3b3f47', b: '#191b1f', edge: '#4a4e57', line: 'Bead-blasted glass that hides fingerprints.' },
  { id: 'moss', name: 'Moss', a: '#6f7d68', b: '#3b4739', edge: '#7f8c78', line: 'A grey green taken from lichen on wet stone.' },
  { id: 'dune', name: 'Dune', a: '#e0cdb2', b: '#b89b78', edge: '#e9dac4', line: 'Warm sand, with a frame one shade lighter.' },
  { id: 'glacier', name: 'Glacier', a: '#e6eef3', b: '#b4c5d1', edge: '#f1f6f9', line: 'Near white with a cold blue in the shadows.' },
]

/* ------------------------------------------------------------- the phone */

function PhoneBack({ c }) {
  return (
    <div className="face absolute inset-0 overflow-hidden rounded-[13%/6%]" style={{ background: `linear-gradient(155deg, ${c.a}, ${c.b})`, transform: 'rotateY(180deg) translateZ(5px)', boxShadow: `inset 0 0 0 2px ${c.edge}` }}>
      <div className="absolute left-[9%] top-[4.5%] aspect-square w-[54%] rounded-full" style={{ background: `radial-gradient(circle at 35% 30%, ${c.edge}, ${c.b} 75%)`, boxShadow: 'inset 0 0 0 2px rgb(255 255 255 / .12), 0 6px 14px rgb(0 0 0 / .35)' }}>
        {[
          ['18%', '14%', '34%'],
          ['50%', '50%', '34%'],
          ['14%', '54%', '30%'],
        ].map(([l, t, w], i) => (
          <span key={i} className="absolute aspect-square rounded-full" style={{ left: l, top: t, width: w, background: 'radial-gradient(circle at 40% 35%, #3b4a66 0, #0b0f18 45%, #020305 70%)', boxShadow: '0 0 0 3px #0a0c10, 0 0 0 4px rgb(255 255 255 / .18)' }}>
            <i className="absolute left-[30%] top-[24%] h-[14%] w-[14%] rounded-full bg-white/50" />
          </span>
        ))}
        <span className="absolute left-[62%] top-[20%] h-[9%] w-[9%] rounded-full bg-[#f3e7c4]" />
      </div>
      <span className="absolute bottom-[7%] left-1/2 -translate-x-1/2 text-[0.8em] font-medium tracking-[0.02em] opacity-55" style={{ color: c.id === 'basalt' || c.id === 'moss' ? '#fff' : '#1b1d22' }}>
        orvo
      </span>
    </div>
  )
}

function PhoneFront({ c, children }) {
  return (
    <div className="face absolute inset-0 rounded-[13%/6%] bg-black" style={{ transform: 'translateZ(5px)', boxShadow: `0 0 0 2px ${c.edge}` }}>
      <div className="absolute inset-[1.6%] overflow-hidden rounded-[11.5%/5.4%] bg-[#0b1230]">
        {children ?? <HomeScreen />}
        <span className="absolute left-1/2 top-[1.6%] h-[2.2%] w-[5%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  )
}

function HomeScreen() {
  return (
    <div className="absolute inset-0 flex flex-col text-white" style={{ background: 'linear-gradient(190deg, #0d1638 0%, #1c3a78 46%, #6fb4e6 100%)' }}>
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute bottom-0 h-[38%] w-full">
        <path d="M0 60V34l14-12 12 9 16-20 14 15 12-7 14 13 18-16v44z" fill="#0b1433" opacity=".75" />
        <path d="M0 60V44l18-9 16 8 20-13 20 12 26-10v28z" fill="#070d24" />
      </svg>
      <p className="mt-[16%] text-center text-[0.72em] font-medium opacity-80">Tuesday 14 October</p>
      <p className="text-center text-[4em] font-light leading-none" style={{ fontStretch: '125%' }}>
        21:08
      </p>
      <div className="relative mx-[7%] mt-auto mb-[8%] bg-white/12 p-[5%] text-[0.62em] leading-snug backdrop-blur-sm">
        <p className="font-medium">Battery 84%</p>
        <p className="opacity-75">About 1 day 9 hours left</p>
      </div>
    </div>
  )
}

/** A CSS-built handset with a front, a back and two edges. `w` is its width in px or any CSS length. */
function Phone({ colour = COLOURS[0], w = 300, rotateY, rotateZ, children, className = '' }) {
  const width = typeof w === 'number' ? `${w}px` : w
  return (
    <div className={className} style={{ perspective: '1800px', width, fontSize: `calc(${width} / 18)` }}>
      <motion.div className="p3d relative aspect-[9/19.4] w-full" style={{ rotateY, rotateZ }}>
        <PhoneFront c={colour}>{children}</PhoneFront>
        <PhoneBack c={colour} />
        <span className="absolute inset-y-[5%] left-0 w-[10px]" style={{ background: colour.edge, transform: 'translateX(-5px) rotateY(90deg)' }} />
        <span className="absolute inset-y-[5%] right-0 w-[10px]" style={{ background: colour.edge, transform: 'translateX(5px) rotateY(90deg)' }} />
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------- nav */

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5 text-[1.25rem] font-medium" style={{ fontStretch: '125%' }} aria-label="Orvo, home">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="11" cy="11" r="3" fill="var(--color-azure)" />
      </svg>
      orvo
    </a>
  )
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-paper/90">
      <div className="wrap flex h-16 items-center justify-between">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-8 text-[15px] font-medium text-ink-2 md:flex">
          {[['#camera', 'Camera'], ['#battery', 'Battery'], ['#colours', 'Colours'], ['#compare', 'Compare'], ['#makers', 'Makers']].map(([h, l]) => (
            <a key={h} href={h} className="underline-offset-[6px] decoration-azure hover:underline">
              {l}
            </a>
          ))}
        </nav>
        <a href="#order" className="btn !min-h-[42px] !px-4 text-[15px]">
          Pre-order the N9
        </a>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ hero */

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -90])
  const rz = useTransform(scrollYProgress, [0, 1], [-7, 4])
  const ry = useTransform(scrollYProgress, [0, 1], [-24, 10])
  return (
    <section id="top" ref={ref} className="relative overflow-hidden">
      <div className="wrap grid min-h-[100svh] items-center gap-10 pb-10 pt-24 md:grid-cols-12 md:gap-6 md:pt-16">
        <motion.div className="md:col-span-7" initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <h1 className="h text-[clamp(2.6rem,6.2vw,5.6rem)]">Orvo N9, a phone with a 5x periscope camera</h1>
          <p className="mt-7 max-w-[40ch] text-[1.15rem] text-ink-2">A 6.7-inch 144 Hz display and a battery that fills in 31 minutes. From €549, shipping 14 November.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#order" className="btn">
              Pre-order the N9
            </a>
            <a href="#compare" className="btn btn-2">
              Compare the models
            </a>
          </div>
        </motion.div>
        <motion.div className="flex justify-center md:col-span-5" style={{ y }} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
          <Phone w="min(62vw, 38svh, 330px)" rotateY={ry} rotateZ={rz} />
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------- scene 1: a turn */

function Chapter({ p, range, children, className = '' }) {
  const [a, b] = range
  // the first chapter starts visible and the last one stays; offsets must stay inside 0..1
  const stops = a <= 0 ? [0, b - 0.07, b] : b >= 1 ? [a, a + 0.07, 1] : [a, a + 0.07, b - 0.07, b]
  const o = a <= 0 ? [1, 1, 0] : b >= 1 ? [0, 1, 1] : [0, 1, 1, 0]
  const ys = a <= 0 ? [0, 0, -28] : b >= 1 ? [28, 0, 0] : [28, 0, 0, -28]
  const opacity = useTransform(p, stops, o)
  const y = useTransform(p, stops, ys)
  return (
    <motion.div style={{ opacity, y }} className={`absolute ${className}`}>
      {children}
    </motion.div>
  )
}

function Turn() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  const ry = useTransform(p, [0, 0.3, 0.48, 0.64, 1], [204, 162, 52, 34, 0])
  const rz = useTransform(p, [0, 0.5, 1], [8, -4, 0])
  const scale = useTransform(p, [0, 0.5, 0.85, 1], [0.92, 1, 1.12, 1.12])
  const meter = useTransform(scrollYProgress, [0, 1], [0, 1])
  return (
    <section ref={ref} className="relative h-[380vh]" aria-label="The N9 from back to front">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="wrap relative h-full">
          <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:left-[50%]" style={{ scale }}>
            <Phone w="min(56vw, 36svh, 310px)" rotateY={ry} rotateZ={rz} />
          </motion.div>

          <Chapter p={scrollYProgress} range={[0, 0.34]} className="inset-x-0 top-[12svh] md:inset-x-auto md:left-0 md:top-1/2 md:w-[30%] md:-translate-y-1/2">
            <h2 className="h text-[clamp(1.9rem,3.6vw,3.2rem)]">A back of matte glass</h2>
            <p className="mt-4 max-w-[30ch] text-ink-2">Three lenses share one disc, set flush enough that the phone lies flat on a table.</p>
          </Chapter>
          <Chapter p={scrollYProgress} range={[0, 0.34]} className="inset-x-0 bottom-[9svh] md:inset-x-auto md:bottom-auto md:right-0 md:top-1/2 md:w-[22%] md:-translate-y-1/2">
            <p className="fig text-[clamp(3rem,6vw,5.4rem)]">182 g</p>
            <p className="label mt-2">with the battery in</p>
          </Chapter>

          <Chapter p={scrollYProgress} range={[0.34, 0.66]} className="inset-x-0 top-[12svh] md:inset-x-auto md:left-0 md:top-1/2 md:w-[30%] md:-translate-y-1/2">
            <h2 className="h text-[clamp(1.9rem,3.6vw,3.2rem)]">An aluminium frame, 7.6 mm thin</h2>
            <p className="mt-4 max-w-[30ch] text-ink-2">Milled from one block of recycled aluminium, then sealed to IP68.</p>
          </Chapter>
          <Chapter p={scrollYProgress} range={[0.34, 0.66]} className="inset-x-0 bottom-[9svh] md:inset-x-auto md:bottom-auto md:right-0 md:top-1/2 md:w-[22%] md:-translate-y-1/2">
            <p className="fig text-[clamp(3rem,6vw,5.4rem)]">7.6 mm</p>
            <p className="label mt-2">at its thickest point</p>
          </Chapter>

          <Chapter p={scrollYProgress} range={[0.66, 1]} className="inset-x-0 top-[12svh] md:inset-x-auto md:left-0 md:top-1/2 md:w-[30%] md:-translate-y-1/2">
            <h2 className="h text-[clamp(1.9rem,3.6vw,3.2rem)]">A display you can read at noon</h2>
            <p className="mt-4 max-w-[30ch] text-ink-2">6.7 inches of OLED at 144 Hz, with a border of 1.1 mm on every side.</p>
          </Chapter>
          <Chapter p={scrollYProgress} range={[0.66, 1]} className="inset-x-0 bottom-[9svh] md:inset-x-auto md:bottom-auto md:right-0 md:top-1/2 md:w-[22%] md:-translate-y-1/2">
            <p className="fig text-[clamp(3rem,6vw,5.4rem)]">4,500</p>
            <p className="label mt-2">nits at peak brightness</p>
          </Chapter>

          <div className="absolute inset-x-0 bottom-6 h-[2px] bg-rule-2" aria-hidden="true">
            <motion.div className="h-full origin-left bg-azure" style={{ scaleX: meter }} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------- scene 2: a zoom */

const STARS = Array.from({ length: 70 }, (_, i) => {
  const r = (n) => {
    const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453
    return x - Math.floor(x)
  }
  return { x: r(1) * 800, y: r(2) * 250, s: 0.4 + r(3) * 1.1, d: r(4) * 4 }
})

function NightHarbour() {
  return (
    <svg viewBox="0 0 800 500" className="absolute inset-0 h-full w-full" role="img" aria-label="A harbour at night with a lighthouse on the far headland">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050a1c" />
          <stop offset=".62" stopColor="#12244f" />
          <stop offset="1" stopColor="#2c4c86" />
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a3266" />
          <stop offset="1" stopColor="#060b1e" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#sky)" />
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#dfe9ff" style={{ animation: `twinkle ${3 + s.d}s ease-in-out ${s.d}s infinite` }} />
      ))}
      <circle cx="150" cy="96" r="30" fill="#e9f0ff" />
      <circle cx="140" cy="88" r="6" fill="#cfdaf2" />
      <circle cx="162" cy="106" r="4" fill="#cfdaf2" />
      <path d="M0 300l70-52 60 30 90-72 80 60 70-38 90 50 80-44 120 62 140-40v84H0z" fill="#16295a" />
      <path d="M0 330l120-36 110 22 130-40 150 34 90-22 200 32v40H0z" fill="#0d1c44" />
      <rect y="338" width="800" height="162" fill="url(#sea)" />
      {[352, 366, 384, 406, 432, 462].map((y, i) => (
        <path key={y} d={`M${40 + i * 30} ${y}h${120 - i * 8}M${300 + i * 22} ${y + 4}h${90 + i * 10}M${560 - i * 12} ${y + 2}h${140 - i * 6}`} stroke="#6f93d6" strokeWidth=".8" opacity={0.35 - i * 0.04} />
      ))}
      {/* the far headland and its lighthouse: the detail the zoom lands on */}
      <path d="M560 338c10-18 26-30 44-34 12-3 30-2 44 6 16 9 28 20 34 28z" fill="#081230" />
      <g>
        <path d="M615.2 304l1.6-44h6.4l1.6 44z" fill="#e7ecf7" />
        <path d="M616.5 270h6.9l.3 8h-7.5zM616 290h8l.3 8h-8.6z" fill="#c7402f" />
        <rect x="616.2" y="252" width="7.6" height="8" fill="#0b1535" stroke="#e7ecf7" strokeWidth=".6" />
        <rect x="617.6" y="253.6" width="4.8" height="5" fill="#ffe9a8" />
        <path d="M615 252h10l-5-5z" fill="#c7402f" />
        <rect x="615" y="260" width="10" height=".9" fill="#e7ecf7" />
        {/* things only the 10x lens shows */}
        <rect x="619.2" y="299.4" width="1.6" height="3" fill="#0b1535" />
        <path d="M627.6 303.9v-2.2M627 302.2h1.2" stroke="#e7ecf7" strokeWidth=".28" />
        <circle cx="627.6" cy="301.3" r=".42" fill="#e7ecf7" />
        <path d="M626.9 301.9l-.8-.9" stroke="#e7ecf7" strokeWidth=".24" />
        <path d="M630.4 303.9c0-.5.3-.9.8-.9s.8.4.8.9zM630.5 303.1l-.1-.5.4.3M631.9 303.1l.1-.5-.4.3" fill="#e7ecf7" />
        <text x="604" y="302.6" fontSize="1.5" fill="#9fb6e6" fontFamily="var(--font-sans)">
          hello from 2 km
        </text>
      </g>
      <path d="M0 500V430l60-22 70 14 60-10 40 22v66z" fill="#03060f" />
    </svg>
  )
}

function Zoom() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useTransform(scrollYProgress, [0.08, 0.9], [0, 1], { clamp: true })
  const scale = useTransform(p, (v) => Math.pow(16.67, v))
  const [z, setZ] = useState(0.6)
  useMotionValueEvent(scale, 'change', (s) => setZ(Math.round(s * 6) / 10))
  const lens = z < 1 ? 0 : z < 5 ? 1 : 2
  const LENSES = [
    ['0.6x', 'Ultra-wide', '14 mm, f/2.2, 50 MP'],
    ['1x', 'Main', '24 mm, f/1.7, 50 MP'],
    ['5x', 'Periscope', '120 mm, f/2.8, 64 MP'],
  ]
  return (
    <section id="camera" ref={ref} className="relative h-[420vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-paper-2">
        <div className="wrap grid h-full grid-rows-[auto_minmax(0,1fr)_auto] gap-5 pb-6 pt-20 md:grid-cols-12 md:grid-rows-1 md:items-center md:gap-6 md:pt-16">
          <div className="md:col-span-4">
            <h2 className="h text-[clamp(1.9rem,3.6vw,3.2rem)]">Three lenses, from 0.6x to 10x</h2>
            <p className="mt-4 hidden max-w-[32ch] text-ink-2 md:block">Keep scrolling. The frame closes in on the lighthouse 2 km across the bay, and the lens changes as it goes.</p>
            <ul className="mt-6 hidden md:block">
              {LENSES.map(([x, n, spec], i) => (
                <li key={x} className={`flex items-baseline gap-4 border-t border-rule py-3 transition-colors duration-200 last:border-b ${lens === i ? 'text-ink' : 'text-muted'}`}>
                  <span className="w-12 font-medium tabular-nums">{x}</span>
                  <span className="font-medium">{n}</span>
                  <span className="ml-auto text-[0.875rem]">{spec}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex min-h-0 items-center md:col-span-8">
            <div className="relative mx-auto aspect-[8/5] max-h-full w-full overflow-hidden bg-black">
              <motion.div className="absolute inset-0" style={{ scale, transformOrigin: '79.5% 59.6%' }}>
                <NightHarbour />
              </motion.div>
              {/* viewfinder marks */}
              <div className="pointer-events-none absolute inset-4 md:inset-6" aria-hidden="true">
                {['left-0 top-0 border-l border-t', 'right-0 top-0 border-r border-t', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((c) => (
                  <i key={c} className={`absolute h-6 w-6 border-ink/80 ${c}`} />
                ))}
              </div>
              <p className="fig absolute left-6 top-6 text-[clamp(2.4rem,5vw,4.4rem)] md:left-10 md:top-10" aria-live="off">
                {z.toFixed(1)}x
              </p>
              <div className="absolute inset-x-6 bottom-6 flex items-center gap-2 md:inset-x-10 md:bottom-9">
                {LENSES.map(([x], i) => (
                  <span key={x} className={`grid h-10 min-w-12 place-items-center px-3 text-[0.875rem] font-medium tabular-nums transition-colors duration-200 ${lens === i ? 'bg-ink text-azure-ink' : 'bg-paper/70 text-ink'}`}>
                    {x}
                  </span>
                ))}
                <span className="ml-auto text-[0.875rem] font-medium text-ink-2">{LENSES[lens][1]} lens</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- battery */

function Battery() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'center 45%'] })
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 22 })
  const [pct, setPct] = useState(0)
  useMotionValueEvent(p, 'change', (v) => setPct(Math.max(0, Math.min(100, Math.round(v * 100)))))
  const mins = Math.round((pct / 100) * 31)
  return (
    <section id="battery" ref={ref} className="wrap py-28 md:py-44">
      <div className="grid gap-10 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5">
          <h2 className="h text-[clamp(2.2rem,4.6vw,4rem)]">A 5,600 mAh battery, full in 31 minutes</h2>
          <p className="mt-6 max-w-[38ch] text-ink-2">The 100 W charger is in the box. Two cells charge in parallel, so neither one runs hot.</p>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <div className="flex items-end justify-between">
            <p className="fig text-[clamp(5rem,13vw,11rem)]">{pct}%</p>
            <p className="pb-3 text-right text-[1.15rem] font-medium tabular-nums text-ink-2">
              {mins} min
              <span className="label block">on the 100 W charger</span>
            </p>
          </div>
          <div className="mt-6 h-[2px] bg-rule-2">
            <motion.div className="h-full origin-left bg-azure" style={{ scaleX: p }} />
          </div>
          <dl className="mt-10">
            {[
              ['A day of use', '1 day 14 hours on one charge'],
              ['Video playback', '27 hours'],
              ['After 1,600 charge cycles', '80% of capacity left'],
              ['Wireless charging', '50 W'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-t border-rule py-3.5 last:border-b">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------- scene 3: sideways inside */

const INSIDE = [
  ['3 nm', 'Helio X4 chip', 'Eight cores built on a 3 nm process. It opens the camera in 0.4 seconds from a locked screen.'],
  ['16 GB', 'Memory', 'Enough to keep 40 apps open in the background without reloading them.'],
  ['4,100 mm²', 'Vapour chamber', 'A copper chamber the size of a playing card moves heat away from the chip.'],
  ['IP68', 'Sealing', 'Survives 1.5 m of fresh water for 30 minutes, and a day at the beach.'],
  ['7 years', 'Software updates', 'System and security updates until October 2033, stated on the box.'],
]

function Inside() {
  const ref = useRef(null)
  const track = useRef(null)
  const [dist, setDist] = useState(0)
  useLayoutEffect(() => {
    const measure = () => track.current && setDist(Math.max(0, track.current.scrollWidth - track.current.parentElement.clientWidth))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -dist])
  return (
    <section ref={ref} className="relative h-[340vh]" aria-label="Inside the N9">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden bg-paper-2">
        <div className="wrap">
          <h2 className="h text-[clamp(1.9rem,3.6vw,3.2rem)]">Five parts inside the N9</h2>
        </div>
        <div className="wrap mt-10 md:mt-14">
          <motion.ol ref={track} className="flex w-max gap-4 md:gap-6" style={{ x }}>
            {INSIDE.map(([fig, name, text], i) => (
              <li key={name} className="flex h-[min(52svh,440px)] w-[78vw] flex-col justify-between bg-paper-3 p-7 md:w-[min(40vw,520px)] md:p-9">
                <p className="flex items-baseline justify-between">
                  <span className="text-[1.15rem] font-medium">{name}</span>
                  <span className="label tabular-nums">
                    {i + 1} of {INSIDE.length}
                  </span>
                </p>
                <div>
                  <p className="fig text-[clamp(3.2rem,6.4vw,5.6rem)]">{fig}</p>
                  <p className="mt-5 max-w-[34ch] text-ink-2">{text}</p>
                </div>
              </li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- colours */

function Colours() {
  const [sel, setSel] = useState(0)
  const c = COLOURS[sel]
  const ry = useSpring(180, { stiffness: 80, damping: 16 })
  useEffect(() => {
    ry.set(180 + (sel % 2 ? 14 : -14))
  }, [sel, ry])
  return (
    <section id="colours" className="wrap py-28 md:py-44">
      <div className="grid items-center gap-12 md:grid-cols-12 md:gap-6">
        <div className="flex justify-center md:col-span-5 md:col-start-2">
          <Phone colour={c} w="min(58vw, 300px)" rotateY={ry} />
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <h2 className="h text-[clamp(2.2rem,4.6vw,4rem)]">Four colours of matte glass</h2>
          <p className="fig mt-10 text-[clamp(2.6rem,5vw,4.4rem)]">{c.name}</p>
          <p className="mt-3 text-ink-2">{c.line}</p>
          <div role="radiogroup" aria-label="Colour" className="mt-9 flex gap-3">
            {COLOURS.map((x, i) => (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={sel === i}
                aria-label={x.name}
                onClick={() => setSel(i)}
                className={`h-14 w-14 transition-transform duration-150 active:scale-95 ${sel === i ? 'outline outline-2 outline-offset-4 outline-ink' : 'hover:-translate-y-0.5'}`}
                style={{ background: `linear-gradient(155deg, ${x.a}, ${x.b})` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- compare */

const MODELS = [
  { name: 'N9 Lite', price: 349, rows: ['6.5 inches, 120 Hz', 'Main and ultra-wide', '5,000 mAh, 45 W', '8 GB', '189 g'] },
  { name: 'N9', price: 549, rows: ['6.7 inches, 144 Hz', 'Main, ultra-wide, 5x periscope', '5,600 mAh, 100 W', '16 GB', '182 g'] },
  { name: 'N9 Pro', price: 749, rows: ['6.8 inches, 144 Hz, LTPO', 'Main with 1-inch sensor, ultra-wide, 5x periscope', '5,800 mAh, 120 W', '16 GB', '204 g'] },
]
const ROWS = ['Display', 'Cameras', 'Battery and charging', 'Memory', 'Weight']

function Compare() {
  return (
    <section id="compare" className="bg-paper-2">
      <div className="wrap py-28 md:py-40">
        <h2 className="h text-[clamp(2.2rem,4.6vw,4rem)]">Three models, from €349</h2>
        <div className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-[22%]" />
                {MODELS.map((m) => (
                  <th key={m.name} scope="col" className="pb-8 pr-6 align-bottom font-normal">
                    <span className="block text-[1.15rem] font-medium">{m.name}</span>
                    <span className="fig mt-3 block text-[clamp(2.4rem,4.4vw,3.8rem)]">€{m.price}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={r} className="border-t border-rule">
                  <th scope="row" className="label py-4 pr-6 align-top">
                    {r}
                  </th>
                  {MODELS.map((m) => (
                    <td key={m.name} className={`max-w-[26ch] py-4 pr-6 align-top ${m.name === 'N9' ? 'text-ink' : 'text-ink-2'}`}>
                      {m.rows[i]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- makers */

const MAKERS = [
  ['14,212', 'test photographs of soup', 'Mirela Okonjo tunes the colour of the camera. She shot one bowl of soup under every light in the building until steam stopped turning grey.'],
  ['63', 'frame prototypes', 'Henrik Saldaña led the frame. Prototype 41 was the thinnest and bent in a back pocket, so the N9 uses number 63.'],
  ['2,000', 'drops from 1.2 m', 'Yuki Marchetti runs the drop lab. A phone passes when the screen still works after 2,000 falls onto steel.'],
  ['11', 'night shifts in a row', 'Dawit Lindgren wrote the charging curve. He slept beside the test rack for 11 nights to watch the cells cool.'],
]

function Makers() {
  return (
    <section id="makers" className="wrap py-28 md:py-44">
      <div className="grid gap-8 md:grid-cols-12 md:gap-6">
        <h2 className="h text-[clamp(2.2rem,4.6vw,4rem)] md:col-span-6">Four people who built the N9</h2>
        <p className="max-w-[40ch] text-ink-2 md:col-span-4 md:col-start-8 md:self-end">312 people work at Orvo in Rotterdam. These four each own one number on the spec sheet.</p>
      </div>
      <ol className="mt-16 md:mt-24">
        {MAKERS.map(([fig, unit, text]) => (
          <li key={fig} className="group grid gap-x-6 gap-y-3 border-t border-rule py-9 transition-colors duration-200 last:border-b hover:bg-paper-2 md:grid-cols-12 md:py-12">
            <p className="fig text-[clamp(3.4rem,8vw,7rem)] md:col-span-5">{fig}</p>
            <p className="self-end text-[1.15rem] font-medium md:col-span-3">{unit}</p>
            <p className="max-w-[44ch] self-end text-ink-2 md:col-span-4">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ----------------------------------------------------------------- order */

function Seg({ label, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} type="button" aria-pressed={value === o} onClick={() => onChange(o)} className={`min-h-[46px] px-4 font-medium transition-colors duration-150 ${value === o ? 'bg-ink text-azure-ink' : 'text-ink shadow-[inset_0_0_0_1px_var(--color-rule-2)] hover:bg-paper-3'}`}>
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function Order() {
  const f = useMockForm()
  const [model, setModel] = useState('N9')
  const [storage, setStorage] = useState('256 GB')
  const [colour, setColour] = useState('Basalt')
  const price = MODELS.find((m) => m.name === model).price + (storage === '512 GB' ? 80 : 0)
  return (
    <section id="order" className="bg-paper-2">
      <div className="wrap grid gap-14 py-28 md:grid-cols-12 md:gap-6 md:py-40">
        <div className="md:col-span-5">
          <h2 className="h text-[clamp(2.4rem,5.4vw,4.8rem)]">Pre-order the N9</h2>
          <p className="mt-6 max-w-[36ch] text-ink-2">Orders placed before 14 November ship on the day and come with the 100 W charger and a case.</p>
          <p className="fig mt-14 text-[clamp(4rem,9vw,8rem)]">€{price}</p>
          <p className="label mt-3">
            {model}, {storage}, {colour}
          </p>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          {f.state === 'sent' ? (
            <div role="status" className="bg-paper-3 p-8 md:p-10">
              <p className="h text-[clamp(1.8rem,3vw,2.6rem)]">Pre-order ON-{f.ticket} is saved</p>
              <p className="mt-4 max-w-[42ch] text-ink-2">This checkout is a simulation. No order was placed, no payment was taken and nothing left your browser.</p>
              <button type="button" onClick={f.reset} className="btn btn-2 mt-8">
                Change the order
              </button>
            </div>
          ) : (
            <form onSubmit={f.onSubmit} className="space-y-8">
              <Seg label="Model" options={MODELS.map((m) => m.name)} value={model} onChange={setModel} />
              <Seg label="Storage" options={['256 GB', '512 GB']} value={storage} onChange={setStorage} />
              <Seg label="Colour" options={COLOURS.map((c) => c.name)} value={colour} onChange={setColour} />
              <label className="label block">
                Email for the shipping notice
                <input required type="email" name="email" autoComplete="email" placeholder="you@mail.com" className="mt-2 block h-[50px] w-full bg-paper px-4 text-[1rem] font-normal text-ink shadow-[inset_0_0_0_1px_var(--color-muted)] placeholder:text-muted/70 focus:outline-2 focus:outline-offset-2 focus:outline-azure" />
              </label>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <button type="submit" disabled={f.state === 'sending'} className="btn disabled:opacity-70">
                  {f.state === 'sending' ? 'Saving the order' : `Pre-order for €${price}`}
                </button>
                <p className="label">A simulated checkout. No data is sent.</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="wrap pb-28 pt-16">
      <div className="flex flex-wrap items-start justify-between gap-10">
        <div>
          <Logo />
          <p className="mt-5 max-w-[30ch] text-ink-2">Phones designed in Rotterdam since 2017.</p>
        </div>
        <ul className="grid grid-cols-2 gap-x-14 gap-y-2 font-medium">
          {[['#camera', 'Camera'], ['#battery', 'Battery'], ['#colours', 'Colours'], ['#compare', 'Compare'], ['#makers', 'Makers'], ['#order', 'Pre-order']].map(([h, l]) => (
            <li key={h}>
              <a href={h} className="underline-offset-[6px] decoration-azure hover:underline">
                {l}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="label mt-16 max-w-[70ch]">© 2026 Orvo. Orvo, the N9, its people and every figure on this page are fictional and exist to demonstrate a design.</p>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Turn />
        <Zoom />
        <Battery />
        <Inside />
        <Colours />
        <Compare />
        <Makers />
        <Order />
      </main>
      <Footer />
      <SiteSwitcher current="orvo" dark />
    </>
  )
}

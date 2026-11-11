import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Reveal, SiteSwitcher, useMockForm, Photo, PhotoCredits } from '../../shared/ui.jsx'
import PHOTOS from '../../shared/photos/sekitei.json'

function Mark({ className = '' }) {
  return (
    <a href="#top" className={`flex items-center gap-3 ${className}`} aria-label="Sekitei, top of page">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
        <circle cx="15" cy="15" r="13.5" />
        <path d="M5 19c3-2 6-2 10 0s7 2 10 0M7 23c3-1.6 5-1.6 8 0s5 1.6 8 0" />
        <path d="M11 14l2.5-5 3.5 2 2 3z" fill="currentColor" stroke="none" />
      </svg>
      <span className="text-[1.25rem] font-medium tracking-[-0.03em]">sekitei</span>
    </a>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  const links = [['#elements', 'The garden'], ['#work', 'What we do'], ['#rake', 'Rake'], ['#estimate', 'Estimate']]
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-sand/88 backdrop-blur-md">
      <div className="wrap flex h-[68px] items-center justify-between">
        <Mark />
        <nav aria-label="Main" className="hidden items-center gap-9 text-[15px] text-stone-2 md:flex">
          {links.map(([h, l]) => (
            <a key={h} href={h} className="underline-offset-[6px] hover:text-stone hover:underline">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#talk" className="btn !min-h-[42px] !px-4 text-[15px]">
            Talk to us
          </a>
          <button type="button" className="grid h-[42px] w-[42px] place-items-center md:hidden" aria-expanded={open} aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            <svg width="22" height="22" viewBox="0 0 22 22" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d={open ? 'M4 4l14 14M18 4L4 18' : 'M2 8h18M2 14h18'} />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="wrap grid border-t border-rule py-3 md:hidden">
          {links.map(([h, l]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="h py-2.5 text-[1.6rem]">
              {l}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  return (
    <section ref={ref} className="pt-[68px]">
      <div className="wrap grid gap-8 pb-10 pt-[clamp(2.5rem,7vw,6rem)] md:grid-cols-12 md:items-end">
        <Reveal className="md:col-span-8">
          <h1 className="h text-[clamp(2.9rem,8.4vw,8rem)]">A garden of stone, gravel and nothing else</h1>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-4">
          <p className="max-w-[38ch] text-stone-2">Sekitei designs, builds and keeps karesansui: the Japanese dry garden, where raked gravel stands in for water and a few stones for mountains.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#talk" className="btn">
              Plan a garden
            </a>
            <a href="#rake" className="btn btn-line">
              Try the rake
            </a>
          </div>
        </Reveal>
      </div>
      <div className="relative h-[min(78svh,820px)] overflow-hidden">
        <motion.div className="absolute inset-x-0 -top-[8%] h-[116%]" style={reduce ? undefined : { y }}>
          <Photo manifest={PHOTOS} name="hero" alt="A dry garden of raked white gravel with groups of dark stones, seen from a temple veranda" priority sizes="100vw" className="h-full" />
        </motion.div>
        <p className="tate absolute right-[var(--gutter)] top-8 text-[1.5rem] text-white drop-shadow-[0_1px_10px_rgb(0_0_0/0.55)]" lang="ja" aria-hidden="true">
          枯山水
        </p>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- elements */

const ELEMENTS = [
  { k: 'Stone', ja: '石', photo: 'stone', alt: 'Tall dark stones standing in raked gravel', t: 'Set, never placed', d: 'A third of every stone goes below ground, so it looks as if it grew there. We choose each one at the quarry and set it by hand and by eye, in odd numbers.' },
  { k: 'Gravel', ja: '砂', photo: 'gravel', alt: 'Gravel raked into flowing curves round a rock', t: 'Water you can rake', d: 'Crushed Shirakawa-type granite, 8 to 12 mm, heavy enough to hold a line through rain. Straight lines read as still water; rings are ripples round a stone.' },
  { k: 'Moss', ja: '苔', photo: 'moss', alt: 'A stone on an island of moss, ringed by raked gravel', t: 'The only green', d: 'Moss is the island each stone sits on. It wants shade and patience, and gives the garden its one soft edge. Where it will not grow, we say so and use gravel.' },
]

function Elements() {
  return (
    <section id="elements" className="wrap py-[clamp(5rem,11vw,10rem)]">
      <Reveal className="grid gap-6 md:grid-cols-12">
        <p className="mono md:col-span-3">Three materials</p>
        <h2 className="h text-[clamp(2.2rem,5vw,4.4rem)] md:col-span-9">Karesansui means dry mountain water. It is made to be looked at, not walked in.</h2>
      </Reveal>
      <ol className="mt-[clamp(3rem,7vw,6rem)] grid gap-x-8 gap-y-14 md:grid-cols-3">
        {ELEMENTS.map((e, i) => (
          <Reveal as="li" key={e.k} delay={i * 0.08} className={i === 1 ? 'md:mt-20' : i === 2 ? 'md:mt-40' : ''}>
            <div className="relative">
              <Photo manifest={PHOTOS} name={e.photo} alt={e.alt} sizes="(min-width: 768px) 30vw, 92vw" className="aspect-[3/4]" />
              <p className="jp absolute -bottom-7 right-4 text-[4.6rem] leading-none text-white mix-blend-difference" lang="ja" aria-hidden="true">
                {e.ja}
              </p>
            </div>
            <p className="mono mt-6">
              0{i + 1} / {e.k}
            </p>
            <h3 className="h mt-2 text-[1.9rem]">{e.t}</h3>
            <p className="mt-3 max-w-[36ch] text-stone-2">{e.d}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

/* ------------------------------------------------------------------- work */

const WORK = [
  { n: 'Design and build', from: 'from €9,400', d: 'A new garden, from a first walk of the site to the last pass of the rake. Courtyards from 6 m², roofs, lobbies, and whole grounds.', steps: ['Site reading', 'Drawings and a 1:20 model', 'Stone choosing', 'Setting', 'First raking'] },
  { n: 'Restoration', from: 'from €3,200', d: 'An older garden gone to weeds, sunk stones or grey gravel. We lift, wash, regrade and reset, keeping what the first gardener meant.', steps: ['Survey', 'Lift and wash', 'Regrade and drain', 'Reset', 'Re-rake'] },
  { n: 'Keeping', from: '€180 a visit', d: 'A gardener once a month or once a week: leaves out, moss misted, gravel topped up and raked to the pattern you chose, or a new one.', steps: ['Clear', 'Weed by hand', 'Mist the moss', 'Top up', 'Rake'] },
]

function Work() {
  const [i, setI] = useState(0)
  const w = WORK[i]
  return (
    <section id="work" className="bg-stone text-sand">
      <div className="wrap grid gap-12 py-[clamp(5rem,11vw,10rem)] md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal>
            <p className="mono !text-sand/60">What we do</p>
            <h2 className="h mt-3 text-[clamp(2.2rem,5vw,4.4rem)]">Made once, then kept for decades</h2>
          </Reveal>
          <div role="tablist" aria-label="Service" className="mt-10">
            {WORK.map((x, k) => (
              <button key={x.n} type="button" role="tab" aria-selected={k === i} onClick={() => setI(k)} className={`flex min-h-[68px] w-full items-center justify-between gap-4 border-t border-sand/20 text-left transition-opacity last:border-b ${k === i ? '' : 'opacity-50 hover:opacity-80'}`}>
                <span className="h text-[1.7rem]">{x.n}</span>
                <span className="mono !text-sand/70">{x.from}</span>
              </button>
            ))}
          </div>
        </div>
        <div role="tabpanel" className="md:col-span-6 md:col-start-7">
          <Photo manifest={PHOTOS} name={['build', 'restore', 'keep'][i]} alt={['A newly laid dry garden with stones and raked gravel', 'A temple garden of gravel, stones and clipped pines', 'A raked gravel garden kept in clean lines'][i]} sizes="(min-width: 768px) 46vw, 92vw" className="aspect-[3/2]" />
          <p className="mt-7 max-w-[50ch] text-[1.1rem] text-sand/85">{w.d}</p>
          <ol className="mt-7 flex flex-wrap gap-x-2 gap-y-2">
            {w.steps.map((s, k) => (
              <li key={s} className="mono flex items-center gap-2 rounded-full px-3 py-1.5 !text-sand/85 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.22)]">
                <span className="!text-sand/50">{k + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------- rake */

// A patch of gravel you can rake: each stroke lays five parallel grooves, shaded as if lit from the top left.
function RakePad() {
  const ref = useRef(null)
  const last = useRef(null)
  const [dirty, setDirty] = useState(false)

  const paintBase = () => {
    const c = ref.current
    const x = c.getContext('2d')
    const { width: W, height: H } = c
    x.fillStyle = '#d9d5cb'
    x.fillRect(0, 0, W, H)
    // grain
    const n = Math.round((W * H) / 26)
    for (let i = 0; i < n; i++) {
      const v = 150 + Math.random() * 95
      x.fillStyle = `rgba(${v},${v - 3},${v - 12},${0.35 + Math.random() * 0.4})`
      const s = 0.8 + Math.random() * 1.8
      x.fillRect(Math.random() * W, Math.random() * H, s, s)
    }
  }
  const groove = (ax, ay, bx, by) => {
    const c = ref.current
    const x = c.getContext('2d')
    const dpr = c.width / c.clientWidth
    const dx = bx - ax
    const dy = by - ay
    const len = Math.hypot(dx, dy) || 1
    const nx = -dy / len
    const ny = dx / len
    x.lineCap = 'round'
    for (let t = -2; t <= 2; t++) {
      const o = t * 11 * dpr
      const line = (off, style, w) => {
        x.strokeStyle = style
        x.lineWidth = w * dpr
        x.beginPath()
        x.moveTo(ax + nx * o + off, ay + ny * o + off)
        x.lineTo(bx + nx * o + off, by + ny * o + off)
        x.stroke()
      }
      line(0, 'rgba(96,90,78,0.3)', 3.6)
      line(-1.6 * dpr, 'rgba(60,55,46,0.2)', 1.4)
      line(2.4 * dpr, 'rgba(255,253,246,0.7)', 1.8)
    }
  }
  const rings = (cx, cy) => {
    const c = ref.current
    const x = c.getContext('2d')
    const dpr = c.width / c.clientWidth
    for (let r = 26; r <= 70; r += 11) {
      const arc = (off, style, w) => {
        x.strokeStyle = style
        x.lineWidth = w * dpr
        x.beginPath()
        x.arc(cx + off, cy + off, r * dpr, 0, Math.PI * 2)
        x.stroke()
      }
      arc(0, 'rgba(96,90,78,0.3)', 3.6)
      arc(2.2 * dpr, 'rgba(255,253,246,0.7)', 1.8)
    }
  }
  const reset = () => {
    paintBase()
    const c = ref.current
    const dpr = c.width / c.clientWidth
    // start with the gravel combed in long straight lines
    for (let y = 30 * dpr; y < c.height; y += 55 * dpr) groove(0, y, c.width, y)
    setDirty(false)
  }
  useEffect(() => {
    const c = ref.current
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      c.width = Math.round(c.clientWidth * dpr)
      c.height = Math.round(c.clientHeight * dpr)
      reset()
    }
    fit()
    let w = c.clientWidth
    const ro = new ResizeObserver(() => {
      if (Math.abs(c.clientWidth - w) > 2) {
        w = c.clientWidth
        fit()
      }
    })
    ro.observe(c)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pos = (e) => {
    const c = ref.current
    const r = c.getBoundingClientRect()
    const k = c.width / r.width
    return [(e.clientX - r.left) * k, (e.clientY - r.top) * k]
  }
  return (
    <div className="relative">
      <canvas
        ref={ref}
        className="rake block h-[clamp(300px,52vw,560px)] w-full"
        role="img"
        aria-label="A patch of gravel. Drag across it to rake lines; double-click to draw rings."
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          last.current = pos(e)
        }}
        onPointerMove={(e) => {
          if (!last.current) return
          const p = pos(e)
          if (Math.hypot(p[0] - last.current[0], p[1] - last.current[1]) < 6) return
          groove(...last.current, ...p)
          last.current = p
          if (!dirty) setDirty(true)
        }}
        onPointerUp={() => (last.current = null)}
        onPointerCancel={() => (last.current = null)}
        onDoubleClick={(e) => {
          rings(...pos(e))
          setDirty(true)
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
        <button type="button" onClick={reset} className={`btn pointer-events-auto !min-h-[44px] transition-opacity ${dirty ? '' : 'opacity-0'}`} tabIndex={dirty ? 0 : -1}>
          Smooth it over
        </button>
      </div>
    </div>
  )
}

function Rake() {
  return (
    <section id="rake" className="py-[clamp(5rem,11vw,10rem)]">
      <div className="wrap grid gap-6 md:grid-cols-12 md:items-end">
        <Reveal className="md:col-span-7">
          <p className="mono">Try it</p>
          <h2 className="h mt-3 text-[clamp(2.2rem,5vw,4.4rem)]">Raking is the upkeep, and the point</h2>
        </Reveal>
        <Reveal delay={0.08} className="md:col-span-4 md:col-start-9">
          <p className="text-stone-2">Drag across the gravel to pull a five-tooth rake through it. Double-click to ring a stone that is not there yet. Ten quiet minutes a week is all a real one asks.</p>
        </Reveal>
      </div>
      <div className="mt-10">
        <RakePad />
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- estimate */

const SITES = [
  { id: 'court', n: 'Courtyard', base: 5200, per: 640 },
  { id: 'roof', n: 'Roof or terrace', base: 7400, per: 820 },
  { id: 'indoor', n: 'Indoors, lobby', base: 6800, per: 980 },
]

function Estimate({ setBrief }) {
  const [site, setSite] = useState('court')
  const [area, setArea] = useState(18)
  const [stones, setStones] = useState(5)
  const [moss, setMoss] = useState(true)
  const s = SITES.find((x) => x.id === site)
  const total = s.base + s.per * area + stones * 780 + (moss ? area * 95 : 0)
  const weeks = Math.round(3 + area / 9 + stones / 3)
  const eur = (n) => '€' + (Math.round(n / 100) * 100).toLocaleString('en-US')
  return (
    <section id="estimate" className="bg-sand-2">
      <div className="wrap grid gap-12 py-[clamp(5rem,11vw,10rem)] md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal>
            <p className="mono">Estimate</p>
            <h2 className="h mt-3 text-[clamp(2.2rem,5vw,4.4rem)]">What a garden costs</h2>
            <p className="mt-5 max-w-[40ch] text-stone-2">Most of the cost is stone and the days it takes to set it. Size the garden here for a first figure; a visit turns it into a fixed quote.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Photo manifest={PHOTOS} name="basin" alt="A stone water basin with bamboo ladles laid across it" sizes="(min-width: 768px) 38vw, 92vw" className="mt-9 aspect-[4/3]" />
          </Reveal>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <fieldset>
            <legend className="mono">Where</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {SITES.map((x) => (
                <button key={x.id} type="button" aria-pressed={x.id === site} onClick={() => setSite(x.id)} className={`min-h-[48px] rounded-full px-5 transition-colors ${x.id === site ? 'bg-stone text-sand' : 'shadow-[inset_0_0_0_1px_var(--color-stone-2)] hover:bg-sand-3'}`}>
                  {x.n}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="mt-8 grid gap-1">
            <span className="flex items-baseline justify-between">
              <span className="mono">Area</span>
              <span className="h text-[1.6rem] tabular-nums">{area} m²</span>
            </span>
            <input type="range" min="6" max="120" step="2" value={area} onChange={(e) => setArea(+e.target.value)} />
          </label>
          <label className="mt-5 grid gap-1">
            <span className="flex items-baseline justify-between">
              <span className="mono">Stones</span>
              <span className="h text-[1.6rem] tabular-nums">{stones}</span>
            </span>
            <input type="range" min="3" max="15" step="2" value={stones} onChange={(e) => setStones(+e.target.value)} />
            <span className="mono">Always an odd number: three, five, seven.</span>
          </label>
          <label className="mt-6 flex min-h-[52px] cursor-pointer items-center gap-3 border-y border-rule">
            <input type="checkbox" checked={moss} onChange={(e) => setMoss(e.target.checked)} className="h-5 w-5 accent-[#3d5c3a]" />
            <span className="flex-1">Moss islands round the stones</span>
            <span className="mono">needs part shade</span>
          </label>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-5" aria-live="polite">
            <p>
              <span className="mono block">About</span>
              <span className="h text-[clamp(2.8rem,6.4vw,5rem)] tabular-nums">{eur(total)}</span>
            </p>
            <p className="mono text-right">
              Built in about {weeks} weeks
              <br />
              Keeping from €180 a visit
            </p>
          </div>
          <a href="#talk" className="btn mt-7" onClick={() => setBrief(`${s.n}, ${area} m², ${stones} stones${moss ? ', with moss' : ''}. Estimate ${eur(total)}.`)}>
            Send this as a brief
          </a>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- study */

const STUDY = [
  ['ryoanji', 'Ryōan-ji, Kyoto', 'Fifteen stones in five groups. From any seat on the veranda, at least one is hidden.', 'The rock garden of Ryōan-ji with its stones in raked gravel'],
  ['shodenji', 'Shōden-ji, Kyoto', 'No stones at all: clipped azaleas in groups of seven, five and three, with Mount Hiei borrowed over the wall.', 'The dry garden of Shōden-ji with clipped azaleas on raked gravel'],
  ['tofukuji', 'Tōfuku-ji, Kyoto', 'Mirei Shigemori, 1939. Proof that the form could be modern without being loud.', 'Standing stones in raked gravel at Tōfuku-ji'],
]

function Study() {
  return (
    <section className="wrap py-[clamp(5rem,11vw,10rem)]" aria-labelledby="study-h">
      <Reveal className="grid gap-6 md:grid-cols-12">
        <p className="mono md:col-span-3">Where we learned</p>
        <div className="md:col-span-9">
          <h2 id="study-h" className="h text-[clamp(2.2rem,5vw,4.4rem)]">Three gardens we go back to</h2>
          <p className="mt-4 max-w-[52ch] text-stone-2">We did not build these. Monks and masters did, centuries ago, and every garden we make is a note in their margin. We take each new gardener to see them.</p>
        </div>
      </Reveal>
      <ul className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-3">
        {STUDY.map(([p, n, d, alt], i) => (
          <Reveal as="li" key={p} delay={i * 0.08}>
            <Photo manifest={PHOTOS} name={p} alt={alt} sizes="(min-width: 768px) 30vw, 92vw" className="aspect-[4/3]" />
            <h3 className="h mt-5 text-[1.6rem]">{n}</h3>
            <p className="mt-2 text-stone-2">{d}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

/* ------------------------------------------------------------------- talk */

function Talk({ brief, setBrief }) {
  const form = useMockForm()
  return (
    <section id="talk" className="bg-moss-deep text-sand">
      <div className="wrap grid gap-12 py-[clamp(5rem,11vw,10rem)] md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="h text-[clamp(2.4rem,5.6vw,5rem)]">Show us the ground</h2>
          <p className="mt-5 max-w-[40ch] text-sand/80">A first visit is free within 150 km of Rotterdam. We look at light, drainage and what you see from the window, then draw.</p>
          <p className="mono mt-8 !text-sand/60">
            Sekitei Tuinen, Zaagmolenkade 31, Rotterdam
            <br />
            +31 10 000 01 31
          </p>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          {form.state === 'sent' ? (
            <div role="status">
              <p className="mono !text-sand/60">Note {form.ticket}</p>
              <h3 className="h mt-3 text-[2.2rem]">Thank you. We will come and look.</h3>
              <p className="mt-3 text-sand/80">This is a demo page, so nothing was sent. A real note would get a reply with two dates for a visit.</p>
              <button type="button" className="btn mt-7 !bg-sand !text-stone" onClick={form.reset}>
                Write another
              </button>
            </div>
          ) : (
            <form onSubmit={form.onSubmit} className="grid gap-6 [&_.field]:border-sand/40 [&_.field]:text-sand">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="mono !text-sand/60">Name</span>
                  <input className="field" name="name" autoComplete="name" required />
                </label>
                <label className="grid gap-1">
                  <span className="mono !text-sand/60">Email</span>
                  <input className="field" type="email" name="email" autoComplete="email" required />
                </label>
              </div>
              <label className="grid gap-1">
                <span className="mono !text-sand/60">The place, and what you hope for</span>
                <textarea className="field min-h-[130px] resize-y" name="brief" value={brief} onChange={(e) => setBrief(e.target.value)} required />
              </label>
              <button type="submit" className="btn justify-self-start !bg-sand !text-stone" disabled={form.state === 'sending'}>
                {form.state === 'sending' ? 'Sending…' : 'Ask for a visit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="wrap grid gap-8 pb-28 pt-14 md:grid-cols-12">
      <Mark className="md:col-span-4" />
      <div className="mono md:col-span-7 md:col-start-6">
        <p>Sekitei is an invented company. Its address, phone number, prices and services are fictional and the form sends nothing. The photographs show real gardens in Japan and elsewhere, none of them made by Sekitei.</p>
        <PhotoCredits manifest={PHOTOS} className="mt-4" />
      </div>
    </footer>
  )
}

export default function App() {
  const [brief, setBrief] = useState('')
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Elements />
        <Work />
        <Rake />
        <Estimate setBrief={setBrief} />
        <Study />
        <Talk brief={brief} setBrief={setBrief} />
      </main>
      <Footer />
      <SiteSwitcher current="sekitei" />
    </>
  )
}

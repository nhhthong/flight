import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Reveal, SiteSwitcher, useMockForm, Marquee, Photo, PhotoCredits } from '../../shared/ui.jsx'
import { MODELS } from './models.js'
import PHOTOS from '../../shared/photos/zenkai.json'

// three.js arrives as its own chunk once the text is on screen.
const Yard = lazy(() => import('./scene.jsx'))

function Mark() {
  return (
    <a href="#top" className="flex items-center gap-2.5 text-[1.25rem] font-black tracking-[-0.04em]" aria-label="Zenkai RC, top of page">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-hot" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M3 3h10L3 13h10" />
        </svg>
      </span>
      zenkai
    </a>
  )
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-paper/92 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between">
        <Mark />
        <nav aria-label="Main" className="hidden items-center gap-8 text-[15px] font-bold md:flex">
          {[['#drive', 'Drive'], ['#cars', 'Cars'], ['#inside', 'Inside'], ['#yard', 'Track days']].map(([h, l]) => (
            <a key={h} href={h} className="decoration-hot decoration-[3px] underline-offset-[6px] hover:underline">
              {l}
            </a>
          ))}
        </nav>
        <a href="#order" className="btn !min-h-[42px] !px-4 text-[15px]">
          Order a car
        </a>
      </div>
    </header>
  )
}

/* ------------------------------------------------------- the drivable yard */

const KEYMAP = { ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down', ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right', ' ': 'brake' }

function Key({ name, label, input, bump, children, className = '' }) {
  const set = (v) => (e) => {
    e.preventDefault()
    input.current[name] = v
    bump()
  }
  return (
    <button type="button" aria-label={label} data-on={!!input.current[name]} className={`key ${className}`} onPointerDown={set(true)} onPointerUp={set(false)} onPointerLeave={set(false)} onPointerCancel={set(false)} onContextMenu={(e) => e.preventDefault()}>
      {children}
    </button>
  )
}

const Arrow = ({ r = 0 }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${r}deg)` }} aria-hidden="true">
    <path d="M11 18V4M5 10l6-6 6 6" />
  </svg>
)

function Drive({ model, setModel }) {
  const input = useRef({ up: false, down: false, left: false, right: false, brake: false })
  const [active, setActive] = useState(false)
  const [tele, setTele] = useState({ speed: 0, score: 0 })
  const [resetKey, setResetKey] = useState(0)
  const [, force] = useState(0)
  const bump = useCallback(() => force((n) => n + 1), [])
  const box = useRef(null)

  // Keys steer only while you are driving, so the arrows still scroll the page the rest of the time.
  useEffect(() => {
    if (!active) return
    const on = (v) => (e) => {
      const k = KEYMAP[e.key.length === 1 ? e.key.toLowerCase() : e.key]
      if (e.key === 'Escape') return setActive(false)
      if (!k || e.metaKey || e.ctrlKey || e.altKey) return
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return
      e.preventDefault()
      if (input.current[k] !== v) {
        input.current[k] = v
        bump()
      }
    }
    const down = on(true)
    const up = on(false)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      Object.keys(input.current).forEach((k) => (input.current[k] = false))
    }
  }, [active, bump])

  // Hand the keys back when the yard scrolls away.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => !e.isIntersecting && setActive(false), { threshold: 0.2 })
    io.observe(box.current)
    return () => io.disconnect()
  }, [])

  const m = MODELS.find((x) => x.id === model)
  return (
    <section id="drive" className="pt-16">
      <div ref={box} className="relative h-[calc(100svh-4rem)] min-h-[560px] overflow-hidden bg-[#cfd6dc]">
        <Suspense fallback={<div className="absolute inset-0 grid place-items-center mono text-ink-2">Rolling the car out…</div>}>
          <Yard model={m} input={input} active={active} resetKey={resetKey} onTelemetry={setTele} className="absolute inset-0" label={`A ${m.name} radio-controlled car on a tarmac yard with cones`} />
        </Suspense>

        {/* headline, until you take the wheel */}
        <div className={`pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-paper/95 via-paper/70 to-transparent pb-24 pt-20 transition-opacity duration-300 md:pt-12 ${active ? 'opacity-0' : ''}`}>
          <div className="wrap">
            <h1 className="h max-w-[13ch] text-[clamp(2.7rem,7.4vw,6.6rem)]">Drive it before you buy it</h1>
            <p className="mt-4 max-w-[40ch] text-[1.1rem] font-medium text-ink-2">Zenkai builds radio-controlled cars in Hamamatsu. This is the {m.name}, on our yard, with its real gearing and grip. Take it for a lap.</p>
          </div>
        </div>

        {/* readout */}
        <div className="absolute left-[var(--gutter)] top-5 flex gap-2 transition-opacity duration-300" style={{ opacity: active ? 1 : 0 }} aria-live="off">
          <p className="rounded-xl bg-ink/80 px-3.5 py-2 text-paper backdrop-blur">
            <span className="block text-[1.7rem] font-black leading-none tabular-nums">{Math.round(tele.speed)}</span>
            <span className="mono text-[0.68rem] opacity-70">km/h</span>
          </p>
          <p className="rounded-xl bg-ink/80 px-3.5 py-2 text-paper backdrop-blur">
            <span className="block text-[1.7rem] font-black leading-none tabular-nums text-cell">{tele.score}</span>
            <span className="mono text-[0.68rem] opacity-70">cells</span>
          </p>
        </div>

        {/* model picker */}
        <div className="absolute right-[var(--gutter)] top-5 flex gap-1.5 rounded-full bg-ink/80 p-1.5 backdrop-blur" role="group" aria-label="Car to drive">
          {MODELS.map((x) => (
            <button key={x.id} type="button" aria-pressed={x.id === model} onClick={() => setModel(x.id)} className={`flex min-h-[40px] items-center gap-2 rounded-full px-3.5 text-[14px] font-bold transition-colors ${x.id === model ? 'bg-paper text-ink' : 'text-paper hover:bg-white/15'}`}>
              <span className="h-3 w-3 rounded-full ring-1 ring-black/20" style={{ background: x.body }} />
              <span className={x.id === model ? '' : 'hidden sm:inline'}>{x.name}</span>
            </button>
          ))}
        </div>

        {/* start, or the pad */}
        {!active ? (
          <div className="absolute inset-x-0 bottom-20 flex flex-col items-center gap-3 md:bottom-8">
            <button type="button" className="btn btn-hot !min-h-[60px] !px-8 text-[1.15rem] shadow-2xl" onClick={() => setActive(true)}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
                <path d="M4 2l12 7-12 7z" />
              </svg>
              Take the wheel
            </button>
            <p className="mono rounded-full bg-ink/75 px-3 py-1.5 text-paper">It is driving itself for now</p>
          </div>
        ) : (
          <>
            <div className="absolute bottom-[4.75rem] left-[var(--gutter)] flex gap-2">
              <Key name="left" label="Steer left" input={input} bump={bump}><Arrow r={-90} /></Key>
              <Key name="right" label="Steer right" input={input} bump={bump}><Arrow r={90} /></Key>
            </div>
            <div className="absolute bottom-6 right-[var(--gutter)] flex items-end gap-2">
              <Key name="brake" label="Handbrake" input={input} bump={bump} className="!w-[76px] mono !text-[0.7rem]">BRAKE</Key>
              <div className="grid gap-2">
                <Key name="up" label="Accelerate" input={input} bump={bump}><Arrow /></Key>
                <Key name="down" label="Reverse" input={input} bump={bump}><Arrow r={180} /></Key>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-6 mx-auto hidden w-max items-center gap-3 rounded-full bg-ink/80 py-1.5 pl-4 pr-1.5 text-paper backdrop-blur md:flex">
              <p className="mono">W A S D or arrows · Space to slide · collect the green cells</p>
              <button type="button" className="min-h-[36px] rounded-full bg-white/15 px-3 text-[13px] font-bold hover:bg-white/25" onClick={() => setResetKey((n) => n + 1)}>Reset</button>
              <button type="button" className="min-h-[36px] rounded-full bg-paper px-3 text-[13px] font-bold text-ink" onClick={() => setActive(false)}>Stop (Esc)</button>
            </div>
            <button type="button" className="absolute left-1/2 top-5 min-h-[40px] -translate-x-1/2 rounded-full bg-paper px-4 text-[13px] font-bold text-ink shadow-lg md:hidden" onClick={() => setActive(false)}>Stop driving</button>
          </>
        )}
      </div>
      <div className="stripe h-3" aria-hidden="true" />
    </section>
  )
}

/* ------------------------------------------------------------------- cars */

function Cars({ model, setModel }) {
  return (
    <section id="cars" className="wrap py-[clamp(4.5rem,10vw,9rem)]">
      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <Reveal className="md:col-span-7">
          <h2 className="h text-[clamp(2.2rem,5.4vw,4.6rem)]">Three cars, three ways to be quick</h2>
        </Reveal>
        <Reveal delay={0.08} className="md:col-span-4 md:col-start-9">
          <p className="text-ink-2">Each comes built, with a 2.4 GHz radio, a 2S LiPo pack and a charger. Charge it, bind it, drive it. Pick one here and it becomes the car in the yard above.</p>
        </Reveal>
      </div>
      <ul className="mt-12 grid gap-5 lg:grid-cols-3">
        {MODELS.map((m, i) => (
          <Reveal as="li" key={m.id} delay={i * 0.07} className={`flex flex-col overflow-hidden rounded-[28px] border-[1.5px] bg-white transition-colors ${m.id === model ? 'border-ink' : 'border-rule'}`}>
            <Photo manifest={PHOTOS} name={m.photo} alt={`A ${m.cls} radio-controlled car of the kind the ${m.name} is`} sizes="(min-width: 1024px) 31vw, 92vw" className="aspect-[4/3]" />
            <div className="flex flex-1 flex-col p-6">
              <p className="mono text-muted">{m.cls}</p>
              <div className="mt-1 flex items-baseline justify-between gap-4">
                <h3 className="text-[2rem] font-black tracking-[-0.03em]">{m.name}</h3>
                <p className="text-[1.3rem] font-black tabular-nums">€{m.price}</p>
              </div>
              <p className="mt-2 text-ink-2">{m.blurb}</p>
              <dl className="mono mt-5 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 border-t border-rule pt-4">
                <dt className="text-muted">Top speed</dt><dd className="text-right">{m.top} km/h</dd>
                <dt className="text-muted">Drive</dt><dd className="text-right">{m.drive}</dd>
                <dt className="text-muted">Motor</dt><dd className="text-right">{m.motor}</dd>
                <dt className="text-muted">Run time</dt><dd className="text-right">{m.run} min</dd>
              </dl>
              <div className="mt-6 flex gap-2.5">
                <a href="#drive" onClick={() => setModel(m.id)} className="btn flex-1">Drive the {m.name.split(' ')[0]}</a>
                <a href="#order" onClick={() => setModel(m.id)} className="btn btn-hot">Order</a>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

/* ----------------------------------------------------------------- inside */

const PARTS = [
  ['Chassis', '2.5 mm carbon plate, cut in-house. It flexes where we want it to and nowhere else.'],
  ['Shocks', 'Oil-filled aluminium, threaded collars. Change the ride height with your fingers.'],
  ['Radio', '2.4 GHz, three channels, 7 ms latency. Range is about 180 m in the open.'],
  ['Spares', 'Every part is sold on its own for ten years after a model ends. Arms cost €6 a pair.'],
]

function Inside() {
  return (
    <section id="inside" className="bg-ink text-paper">
      <div className="wrap grid gap-10 py-[clamp(4.5rem,10vw,9rem)] md:grid-cols-12 md:items-center">
        <Reveal className="md:col-span-6">
          <Photo manifest={PHOTOS} name="bench" alt="A 1/10 buggy on paving, its shocks and suspension arms showing, with a clear body shell behind it" sizes="(min-width: 768px) 46vw, 92vw" className="aspect-[4/3] rounded-[28px]" />
        </Reveal>
        <div className="md:col-span-5 md:col-start-8">
          <Reveal>
            <h2 className="h text-[clamp(2.1rem,4.6vw,3.9rem)]">Built to be taken apart</h2>
            <p className="mt-4 max-w-[44ch] text-paper/75">You will crash it. That is the hobby. So every Zenkai comes apart with two hex drivers, and every part has a number you can order by.</p>
          </Reveal>
          <dl className="mt-8">
            {PARTS.map(([k, v], i) => (
              <Reveal key={k} delay={i * 0.05} className="grid grid-cols-[7rem_1fr] gap-4 border-t border-white/15 py-4">
                <dt className="mono pt-1 text-hot">{k}</dt>
                <dd className="text-paper/85">{v}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- track days */

const DAYS = [
  ['Sat 12 Jun', 'Open yard', 'Bring any car. Loan cars for beginners.', 'Free'],
  ['Sun 27 Jun', 'Touring cup, round 3', '1/10 touring, stock motors, 5 min heats.', '€12'],
  ['Sat 10 Jul', 'Drift evening', 'Polished concrete, lights off at nine.', '€8'],
  ['Sun 25 Jul', 'Buggy enduro', 'One hour, teams of two, one battery change.', '€15'],
]

function YardDays() {
  return (
    <section id="yard" className="wrap py-[clamp(4.5rem,10vw,9rem)]">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal>
            <h2 className="h text-[clamp(2.1rem,4.6vw,3.9rem)]">The yard is real, and it is open</h2>
            <p className="mt-4 max-w-[42ch] text-ink-2">The track above is drawn from the one behind our workshop: 56 by 36 metres of tarmac, timing loop on the line. Come and drive on it.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Photo manifest={PHOTOS} name="track" alt="A small tarmac track for radio-controlled cars, with painted lines, among pine trees" sizes="(min-width: 768px) 38vw, 92vw" className="mt-8 aspect-[3/2] rounded-[28px]" />
          </Reveal>
        </div>
        <ol className="md:col-span-6 md:col-start-7">
          {DAYS.map(([d, n, t, p], i) => (
            <Reveal as="li" key={d} delay={i * 0.05} className="grid grid-cols-[6.5rem_1fr_auto] items-baseline gap-4 border-t-[1.5px] border-ink py-5 last:border-b-[1.5px]">
              <p className="mono">{d}</p>
              <div>
                <h3 className="text-[1.35rem] font-black tracking-[-0.02em]">{n}</h3>
                <p className="text-ink-2">{t}</p>
              </div>
              <p className="font-black tabular-nums">{p}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ order */

function Order({ model, setModel }) {
  const form = useMockForm()
  const m = MODELS.find((x) => x.id === model)
  const [spare, setSpare] = useState(false)
  const total = m.price + (spare ? 39 : 0)
  return (
    <section id="order" className="bg-hot">
      <div className="wrap grid gap-10 py-[clamp(4.5rem,10vw,8rem)] md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="h text-[clamp(2.3rem,5.4vw,4.6rem)]">Order yours</h2>
          <p className="mt-4 max-w-[38ch] font-medium">Built to order in about nine days, shipped with a tracked courier. Thirty days to send it back, even muddy.</p>
        </div>
        <div className="rounded-[28px] bg-paper p-6 md:col-span-6 md:col-start-7 md:p-8">
          {form.state === 'sent' ? (
            <div role="status">
              <p className="mono text-muted">Order {form.ticket}</p>
              <h3 className="mt-2 text-[1.8rem] font-black tracking-[-0.03em]">Your {m.name} is on the bench</h3>
              <p className="mt-2 text-ink-2">This page is a demo, so nothing was sent or charged. A real order would get an email with a build date here.</p>
              <button type="button" className="btn mt-6" onClick={form.reset}>Start another order</button>
            </div>
          ) : (
            <form onSubmit={form.onSubmit} className="grid gap-5">
              <fieldset>
                <legend className="mono text-muted">Car</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {MODELS.map((x) => (
                    <label key={x.id} className={`flex min-h-[52px] cursor-pointer items-center gap-2.5 rounded-xl border-[1.5px] px-3.5 font-bold ${x.id === model ? 'border-ink bg-white' : 'border-rule'}`}>
                      <input type="radio" name="car" className="sr-only" checked={x.id === model} onChange={() => setModel(x.id)} />
                      <span className="h-3.5 w-3.5 rounded-full ring-1 ring-black/20" style={{ background: x.body }} />
                      {x.name}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl border-[1.5px] border-rule px-3.5">
                <input type="checkbox" checked={spare} onChange={(e) => setSpare(e.target.checked)} className="h-5 w-5 accent-[#16181d]" />
                <span className="flex-1 font-bold">Second battery pack</span>
                <span className="tabular-nums text-ink-2">+ €39</span>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="mono text-muted">Name</span>
                  <input className="field" name="name" autoComplete="name" required />
                </label>
                <label className="grid gap-1.5">
                  <span className="mono text-muted">Email</span>
                  <input className="field" type="email" name="email" autoComplete="email" required />
                </label>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-5">
                <p>
                  <span className="mono block text-muted">Total, shipping included</span>
                  <span className="text-[2rem] font-black leading-tight tabular-nums">€{total}</span>
                </p>
                <button type="submit" className="btn !min-h-[56px] !px-7" disabled={form.state === 'sending'}>
                  {form.state === 'sending' ? 'Placing order…' : `Order the ${m.name}`}
                </button>
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
    <footer className="bg-ink pb-24 pt-14 text-paper">
      <div className="wrap grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-[1.6rem] font-black tracking-[-0.04em]">zenkai</p>
          <p className="mt-2 max-w-[40ch] text-paper/70">Zenkai RC, 4-18 Nakaku Workshop Row, Hamamatsu. Yard open Saturdays and Sundays, 10 to 18.</p>
        </div>
        <div className="text-[0.9rem] text-paper/70 md:col-span-6 md:col-start-7">
          <p>Zenkai is an invented company. The cars, prices, dates and address are fictional, and the order form sends nothing. The photographs show real radio-controlled cars of the same classes, not Zenkai products.</p>
          <PhotoCredits manifest={PHOTOS} className="mt-4" />
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [model, setModel] = useState('kite')
  return (
    <>
      <Nav />
      <main id="top">
        <Drive model={model} setModel={setModel} />
        <Marquee speed={36} className="border-b border-rule py-3">
          {['Built in Hamamatsu', 'Spares for ten years', 'Ready to run', '30 days to return', 'Open yard every weekend'].map((t) => (
            <span key={t} className="mono mx-6 flex items-center gap-6 whitespace-nowrap text-ink-2">
              {t}
              <span className="h-1.5 w-1.5 rounded-full bg-hot" />
            </span>
          ))}
        </Marquee>
        <Cars model={model} setModel={setModel} />
        <Inside />
        <YardDays />
        <Order model={model} setModel={setModel} />
      </main>
      <Footer />
      <SiteSwitcher current="zenkai" />
    </>
  )
}

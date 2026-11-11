import { useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Reveal, RiseText, Counter, SiteSwitcher, useMockForm, Photo, PhotoCredits } from '../../shared/ui.jsx'
import PHOTOS from '../../shared/photos/corsara.json'

const eur = (n) => '€' + Math.round(n).toLocaleString('en-US')

// Figures are the makers' published ones for each model; the years, mileages and prices are invented.
const CARS = [
  { id: 'sf90', make: 'Ferrari', model: 'SF90 Stradale', year: 2022, km: 4200, price: 489000, ps: 1000, sprint: 2.5, top: 340, engine: '4.0 V8 twin-turbo, three e-motors', note: 'Assetto Fiorano pack, one owner, full Ferrari history.' },
  { id: 'svj', make: 'Lamborghini', model: 'Aventador SVJ', year: 2020, km: 7900, price: 545000, ps: 770, sprint: 2.8, top: 350, engine: '6.5 V12, naturally aspirated', note: 'One of 900 coupés. Front lift, telemetry, new Pirellis.' },
  { id: 'p720s', make: 'McLaren', model: '720S', year: 2019, km: 11800, price: 228000, ps: 720, sprint: 2.9, top: 341, engine: '4.0 V8 twin-turbo', note: 'Performance trim, sports exhaust, extended warranty to 2027.' },
  { id: 'gt3rs', make: 'Porsche', model: '911 GT3 RS', year: 2023, km: 2600, price: 312000, ps: 525, sprint: 3.2, top: 296, engine: '4.0 flat-six, naturally aspirated', note: 'Weissach package, ceramic brakes, never on a circuit.' },
  { id: 'huracan', make: 'Lamborghini', model: 'Huracán Tecnica', year: 2023, km: 5100, price: 259000, ps: 640, sprint: 3.2, top: 325, engine: '5.2 V10, naturally aspirated', note: 'Rear-wheel drive, rear-wheel steer, sport seats.' },
  { id: 'pista', make: 'Ferrari', model: '488 Pista', year: 2019, km: 9300, price: 398000, ps: 720, sprint: 2.85, top: 340, engine: '3.9 V8 twin-turbo', note: 'Carbon wheels, racing seats, stripe delete.' },
]

function Mark() {
  return (
    <a href="#top" className="h text-[1.15rem] tracking-[0.02em]" aria-label="Corsara, top of page">
      Corsara
    </a>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  const links = [['#stock', 'Stock'], ['#inspection', 'Inspection'], ['#finance', 'Finance'], ['#visit', 'Visit']]
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-night/85 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between">
        <Mark />
        <nav aria-label="Main" className="hidden items-center gap-9 text-[15px] font-medium text-bone-2 md:flex">
          {links.map(([h, l]) => (
            <a key={h} href={h} className="transition-colors hover:text-flare">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#enquire" className="btn !min-h-[42px] !px-4 text-[15px]">
            Enquire
          </a>
          <button type="button" className="grid h-[42px] w-[42px] place-items-center md:hidden" aria-expanded={open} aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            <svg width="22" height="22" viewBox="0 0 22 22" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d={open ? 'M4 4l14 14M18 4L4 18' : 'M2 7h18M2 15h18'} />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="wrap grid gap-1 border-t border-rule py-3 md:hidden">
          {links.map(([h, l]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="h py-2.5 text-[1.5rem]">
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
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <motion.div className="absolute inset-0" style={reduce ? undefined : { scale, y }}>
        <Photo manifest={PHOTOS} name="hero" alt="A grey Lamborghini Aventador SVJ seen from behind, parked on a city street" priority sizes="100vw" className="h-full" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/45 to-night/30" aria-hidden="true" />
      <div className="wrap relative pb-[clamp(2.5rem,6vw,5rem)] pt-32">
        <h1 className="h max-w-[13ch] text-[clamp(2.7rem,8.6vw,8.4rem)]">
          <RiseText text="Six cars. All of them driven first." />
        </h1>
        <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-end">
          <p className="max-w-[44ch] text-[1.1rem] text-bone-2 md:col-span-5">Corsara is a small, independent dealer on the Monaco harbour. We buy few cars, drive each for a week, and list only the ones we would keep.</p>
          <div className="flex flex-wrap gap-3 md:col-span-7 md:justify-end">
            <a href="#stock" className="btn">
              See the six
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 3v12M3 9l6 6 6-6" />
              </svg>
            </a>
            <a href="#visit" className="btn btn-line">
              Book a viewing
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ stock */

function Spec({ k, v, unit }) {
  return (
    <div className="border-t border-rule pt-3">
      <dt className="label">{k}</dt>
      <dd className="num mt-1 text-[clamp(1.5rem,2.6vw,2.3rem)] leading-none">
        {v}
        <span className="ml-1 text-[0.5em] font-medium text-muted">{unit}</span>
      </dd>
    </div>
  )
}

function Stock({ onPick }) {
  const [make, setMake] = useState('All')
  const makes = useMemo(() => ['All', ...new Set(CARS.map((c) => c.make))], [])
  const list = CARS.filter((c) => make === 'All' || c.make === make)
  return (
    <section id="stock" className="py-[clamp(4.5rem,10vw,9rem)]">
      <div className="wrap flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <h2 className="h text-[clamp(2.2rem,6vw,5.4rem)]">In stock now</h2>
        </Reveal>
        <div role="group" aria-label="Filter by maker" className="flex flex-wrap gap-1.5">
          {makes.map((m) => (
            <button key={m} type="button" aria-pressed={make === m} onClick={() => setMake(m)} className={`min-h-[44px] px-4 text-[15px] font-semibold transition-colors ${make === m ? 'bg-bone text-night' : 'text-bone-2 shadow-[inset_0_0_0_1.5px_var(--color-rule)] hover:bg-night-3'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>
      <ol className="mt-[clamp(2.5rem,5vw,4.5rem)] grid gap-[clamp(4rem,8vw,7.5rem)]">
        {list.map((c, i) => (
          <li key={c.id} className="car wrap grid gap-x-[clamp(1.5rem,4vw,4.5rem)] gap-y-7 md:grid-cols-12 md:items-center">
            <Reveal className={`md:col-span-7 ${i % 2 ? 'md:order-2' : ''}`}>
              <Photo manifest={PHOTOS} name={c.id} alt={`${c.make} ${c.model}`} sizes="(min-width: 768px) 56vw, 92vw" className="car-photo aspect-[16/10]" />
            </Reveal>
            <Reveal delay={0.08} className="md:col-span-5">
              <p className="label">
                {String(i + 1).padStart(2, '0')} / {c.make} / {c.year} / {c.km.toLocaleString('en-US')} km
              </p>
              <h3 className="h mt-3 text-[clamp(2rem,4.2vw,3.7rem)]">{c.model}</h3>
              <p className="mt-4 max-w-[42ch] text-bone-2">{c.note}</p>
              <dl className="mt-7 grid grid-cols-3 gap-x-5">
                <Spec k="Power" v={c.ps} unit="PS" />
                <Spec k="0 to 100" v={c.sprint} unit="s" />
                <Spec k="Top speed" v={c.top} unit="km/h" />
              </dl>
              <p className="mt-4 text-[0.95rem] text-muted">{c.engine}</p>
              <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-5">
                <p className="num text-[1.9rem] leading-none">{eur(c.price)}</p>
                <a href="#enquire" onClick={() => onPick(c.id)} className="btn">
                  Enquire about this car
                </a>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ------------------------------------------------------------- inspection */

const CHECKS = [
  ['Paint', 'Depth read on every panel. A repaint is listed, with the panel named.'],
  ['Drivetrain', 'Compression, clutch wear and gearbox adaption values, printed and filed.'],
  ['History', 'Every service stamp checked with the workshop that made it.'],
  ['Road', 'A week and at least 400 km with one of us, on the Col de Turini and in town.'],
]

function Inspection() {
  return (
    <section id="inspection" className="bg-night-2">
      <div className="wrap grid gap-12 py-[clamp(4.5rem,10vw,9rem)] md:grid-cols-12">
        <div className="md:col-span-6">
          <Reveal>
            <h2 className="h text-[clamp(2.1rem,5vw,4.4rem)]">We turn down four cars in five</h2>
            <p className="mt-5 max-w-[46ch] text-bone-2">A supercar can look perfect and still hide a hard life. So before a car is listed it gets 212 checks and a week on the road. Most do not pass.</p>
          </Reveal>
          <dl className="mt-10 grid grid-cols-3 gap-5">
            {[[212, '', 'checks per car'], [400, '', 'km driven by us'], [21, '%', 'of cars accepted']].map(([n, s, l]) => (
              <div key={l} className="border-t border-rule pt-4">
                <dd className="num text-[clamp(2rem,4.6vw,3.9rem)] leading-none text-flare">
                  <Counter to={n} suffix={s} />
                </dd>
                <dt className="label mt-2">{l}</dt>
              </div>
            ))}
          </dl>
          <Reveal delay={0.1}>
            <Photo manifest={PHOTOS} name="detail" alt="The rear wing and haunches of a silver McLaren 720S" sizes="(min-width: 768px) 46vw, 92vw" className="mt-10 aspect-[16/9]" />
          </Reveal>
        </div>
        <ol className="md:col-span-5 md:col-start-8 md:pt-3">
          {CHECKS.map(([k, v], i) => (
            <Reveal as="li" key={k} delay={i * 0.06} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-rule py-6 last:border-b">
              <p className="num text-muted">0{i + 1}</p>
              <div>
                <h3 className="h text-[1.5rem]">{k}</h3>
                <p className="mt-2 text-bone-2">{v}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- finance */

function Finance({ pick, onPick }) {
  const car = CARS.find((c) => c.id === pick)
  const [dep, setDep] = useState(30)
  const [months, setMonths] = useState(48)
  const rate = 0.059 / 12
  const loan = car.price * (1 - dep / 100)
  const monthly = (loan * rate) / (1 - Math.pow(1 + rate, -months))
  return (
    <section id="finance" className="wrap py-[clamp(4.5rem,10vw,9rem)]">
      <div className="grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <h2 className="h text-[clamp(2.1rem,5vw,4.4rem)]">What it costs a month</h2>
          <p className="mt-5 max-w-[42ch] text-bone-2">A plain loan at 5.9% a year, no balloon at the end. Move the sliders. The figure is a guide, not an offer.</p>
        </Reveal>
        <div className="md:col-span-6 md:col-start-7">
          <label className="grid gap-1">
            <span className="label">Car</span>
            <select className="field" value={pick} onChange={(e) => onPick(e.target.value)}>
              {CARS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.make} {c.model}, {eur(c.price)}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-7 grid gap-1">
            <span className="flex justify-between">
              <span className="label">Deposit</span>
              <span className="num">{dep}% · {eur((car.price * dep) / 100)}</span>
            </span>
            <input type="range" min="10" max="70" step="5" value={dep} onChange={(e) => setDep(+e.target.value)} />
          </label>
          <label className="mt-5 grid gap-1">
            <span className="flex justify-between">
              <span className="label">Term</span>
              <span className="num">{months} months</span>
            </span>
            <input type="range" min="12" max="72" step="12" value={months} onChange={(e) => setMonths(+e.target.value)} />
          </label>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-5 border-t border-rule pt-6" aria-live="polite">
            <p>
              <span className="label block">Monthly</span>
              <span className="num text-[clamp(2.6rem,6vw,4.6rem)] leading-none text-flare">{eur(monthly)}</span>
            </p>
            <p className="text-right text-[0.95rem] text-muted">
              Borrowed {eur(loan)}
              <br />
              Interest in total {eur(monthly * months - loan)}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ visit */

function Visit({ pick, onPick }) {
  const form = useMockForm()
  const car = CARS.find((c) => c.id === pick)
  return (
    <section id="visit" className="bg-bone text-night">
      <div className="wrap grid gap-12 py-[clamp(4.5rem,10vw,9rem)] md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="h text-[clamp(2.1rem,5vw,4.4rem)]">Come and sit in it</h2>
          <p className="mt-5 max-w-[42ch]">The showroom holds six cars and one coffee machine. Viewings are by appointment, one client at a time, and a test drive needs a day's notice.</p>
          <dl className="mt-9 grid gap-5 text-[1.05rem]">
            {[['Where', '14 Quai des Lamparos, Port Hercule, Monaco'], ['When', 'Tuesday to Saturday, 10:00 to 18:30'], ['Phone', '+377 00 00 14 14']].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[5rem_1fr] gap-4 border-t border-night/20 pt-4">
                <dt className="label !text-night/60">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div id="enquire" className="scroll-mt-24 bg-night p-[clamp(1.5rem,3.5vw,3rem)] text-bone md:col-span-6 md:col-start-7">
          {form.state === 'sent' ? (
            <div role="status">
              <p className="label">Reference {form.ticket}</p>
              <h3 className="h mt-3 text-[2rem]">We will hold the {car.model} for you</h3>
              <p className="mt-3 text-bone-2">This is a demo page, so nothing was sent. A real enquiry would get a call from us within a working day.</p>
              <button type="button" className="btn mt-7" onClick={form.reset}>
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={form.onSubmit} className="grid gap-6">
              <h3 className="h text-[1.7rem]">Enquire</h3>
              <label className="grid gap-1">
                <span className="label">Car</span>
                <select className="field" value={pick} onChange={(e) => onPick(e.target.value)}>
                  {CARS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.make} {c.model}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="label">Name</span>
                  <input className="field" name="name" autoComplete="name" required />
                </label>
                <label className="grid gap-1">
                  <span className="label">Phone or email</span>
                  <input className="field" name="contact" required />
                </label>
              </div>
              <fieldset>
                <legend className="label">I would like</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['A viewing', 'A test drive', 'A part-exchange value'].map((t, i) => (
                    <label key={t} className="flex min-h-[46px] cursor-pointer items-center gap-2.5 px-4 shadow-[inset_0_0_0_1.5px_var(--color-rule)] has-[:checked]:bg-bone has-[:checked]:text-night">
                      <input type="radio" name="want" defaultChecked={i === 0} className="sr-only" />
                      {t}
                    </label>
                  ))}
                </div>
              </fieldset>
              <button type="submit" className="btn mt-2" disabled={form.state === 'sending'}>
                {form.state === 'sending' ? 'Sending…' : `Ask about the ${car.model}`}
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
    <footer className="wrap grid gap-8 pb-28 pt-14 text-[0.9rem] text-muted md:grid-cols-12">
      <p className="h text-[1.4rem] text-bone md:col-span-4">Corsara</p>
      <div className="md:col-span-7 md:col-start-6">
        <p>Corsara is an invented dealer. Its address, phone number, stock, mileages and prices are fictional and the form sends nothing. The makers and model names belong to their owners, who have no connection with this page. Each photograph shows a car of that model, not a car for sale.</p>
        <PhotoCredits manifest={PHOTOS} className="mt-4" />
      </div>
    </footer>
  )
}

export default function App() {
  const [pick, setPick] = useState(CARS[0].id)
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Stock onPick={setPick} />
        <Inspection />
        <Finance pick={pick} onPick={setPick} />
        <Visit pick={pick} onPick={setPick} />
      </main>
      <Footer />
      <SiteSwitcher current="corsara" dark />
    </>
  )
}

import { useRef, useState } from 'react'
import { motion, useScroll, useSpring, useMotionValueEvent } from 'motion/react'
import { SiteSwitcher, useMockForm } from '../../shared/ui.jsx'

/* ------------------------------------------------- the arm, as a drawing */

const L = { col: 90, upper: 150, fore: 130, wrist: 42 }
const rad = (d) => (d * Math.PI) / 180

/** Forward kinematics for the side elevation. Angles are absolute, measured from vertical. */
function solve({ t1, t2, t3 }) {
  const s = { x: 0, y: -L.col }
  const e = { x: s.x + L.upper * Math.sin(rad(t1)), y: s.y - L.upper * Math.cos(rad(t1)) }
  const w = { x: e.x + L.fore * Math.sin(rad(t2)), y: e.y - L.fore * Math.cos(rad(t2)) }
  const t = { x: w.x + L.wrist * Math.sin(rad(t3)), y: w.y - L.wrist * Math.cos(rad(t3)) }
  return { s, e, w, t }
}

function Link({ a, b, width }) {
  // an outlined capsule: a fat ink line with a sheet-coloured line inside it
  return (
    <>
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--color-ink)" strokeWidth={width} strokeLinecap="round" />
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--arm-fill, var(--color-paper))" strokeWidth={width - 2.4} strokeLinecap="round" />
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--color-rule-2)" strokeWidth="0.8" strokeDasharray="7 3 1.5 3" />
    </>
  )
}

function Joint({ p, r, tag, tagAt = [14, -12] }) {
  return (
    <g>
      <circle cx={p.x} cy={p.y} r={r} fill="var(--arm-fill, var(--color-paper))" stroke="var(--color-ink)" strokeWidth="1.2" />
      <circle cx={p.x} cy={p.y} r={r * 0.42} fill="none" stroke="var(--color-ink)" strokeWidth="0.8" />
      <path d={`M${p.x - r - 4} ${p.y}h${2 * r + 8}M${p.x} ${p.y - r - 4}v${2 * r + 8}`} stroke="var(--color-rule-2)" strokeWidth="0.7" />
      {tag && (
        <text x={p.x + tagAt[0]} y={p.y + tagAt[1]} fontSize="8" fill="var(--color-muted)" className="num">
          {tag}
        </text>
      )}
    </g>
  )
}

function Arm({ pose, tags = true, tool = 'grip' }) {
  const { s, e, w, t } = solve(pose)
  const base = { x: 0, y: 0 }
  const ang = pose.t3
  return (
    <g>
      {/* floor and base plate */}
      <path d="M-150 0H290" stroke="var(--color-ink)" strokeWidth="1.2" />
      {Array.from({ length: 23 }, (_, i) => (
        <path key={i} d={`M${-150 + i * 20} 0l-8 9`} stroke="var(--color-rule-2)" strokeWidth="0.8" />
      ))}
      <rect x="-44" y="-10" width="88" height="10" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.2" />
      <rect x="-30" y="-52" width="60" height="42" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.2" />
      <path d="M-30 -24h60" stroke="var(--color-rule-2)" strokeWidth="0.8" />
      <Link a={{ x: 0, y: -52 }} b={s} width={34} />
      <Link a={s} b={e} width={30} />
      <Link a={e} b={w} width={24} />
      <Link a={w} b={t} width={16} />
      <Joint p={base.x === 0 ? { x: 0, y: -30 } : base} r={9} tag={tags ? 'J1' : ''} tagAt={[-34, 3]} />
      <Joint p={s} r={17} tag={tags ? 'J2' : ''} tagAt={[-40, -14]} />
      <Joint p={e} r={14} tag={tags ? 'J3' : ''} tagAt={[-8, -22]} />
      <Joint p={w} r={10} tag={tags ? 'J5' : ''} tagAt={[14, -12]} />
      {/* end effector, drawn in the tool frame */}
      <g transform={`translate(${t.x} ${t.y}) rotate(${ang})`}>
        <rect x="-9" y="-8" width="18" height="6" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.1" />
        {tool === 'torch' ? (
          <path d="M-3 -8v-16l3-5 3 5v16" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.1" />
        ) : tool === 'vacuum' ? (
          <path d="M-16 -8h32M-16 -8v-7M16 -8v-7M-20 -15h8M12 -15h8M-2 -8v-7M-6 -15h8" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
        ) : (
          <path d="M-9 -8v-15h3v9M9 -8v-15h-3v9" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
        )}
      </g>
    </g>
  )
}

/** A dimension line between two points on the sheet, value above it. */
function Dim({ x1, x2, y, label, up = true }) {
  const m = (x1 + x2) / 2
  return (
    <g>
      <path d={`M${x1} ${y}H${x2}`} stroke="var(--color-rule)" strokeWidth="0.8" pathLength="1" />
      <path d={`M${x1 - 4} ${y + 4}l8-8M${x2 - 4} ${y + 4}l8-8`} stroke="var(--color-rule)" strokeWidth="0.8" />
      <path d={`M${x1} ${y - 8}v16M${x2} ${y - 8}v16`} stroke="var(--color-rule-2)" strokeWidth="0.7" />
      <text x={m} y={up ? y - 6 : y + 13} textAnchor="middle" fontSize="9" fill="var(--color-ink)" className="num">
        {label}
      </text>
    </g>
  )
}

const POSES = {
  home: { t1: 22, t2: 100, t3: 150, j: [0, 22, 78, 0, 50, 0] },
  pick: { t1: 42, t2: 132, t3: 180, j: [-34, 42, 90, 12, 48, 90] },
  weld: { t1: 14, t2: 84, t3: 118, j: [18, 14, 70, -41, 34, 15] },
  stack: { t1: 4, t2: 72, t3: 180, j: [96, 4, 68, 0, 108, -90] },
}
const lerp = (a, b, k) => a + (b - a) * k
const ease = (k) => k * k * (3 - 2 * k)
function mix(a, b, k) {
  const e = ease(Math.max(0, Math.min(1, k)))
  return { t1: lerp(a.t1, b.t1, e), t2: lerp(a.t2, b.t2, e), t3: lerp(a.t3, b.t3, e), j: a.j.map((v, i) => lerp(v, b.j[i], e)) }
}

/* ------------------------------------------------------------------- nav */

function Mark() {
  return (
    <a href="#top" className="flex items-center gap-3" aria-label="Gravon Robotics, home">
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x=".8" y=".8" width="28.4" height="28.4" />
        <path d="M8 22V12l7-4 7 4M15 8v8l7 4" />
        <circle cx="15" cy="16" r="1.8" fill="currentColor" />
      </svg>
      <span className="h text-[1.25rem]">Gravon</span>
    </a>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule-2 bg-paper">
      <div className="wrap flex h-16 items-center justify-between">
        <Mark />
        <nav aria-label="Main" className="hidden items-center gap-8 text-[15px] font-medium md:flex">
          {[['#tasks', 'Tasks'], ['#range', 'Range'], ['#payback', 'Payback'], ['#install', 'Install day'], ['#crew', 'Field crew']].map(([h, l]) => (
            <a key={h} href={h} className="lnk decoration-transparent hover:decoration-current">
              {l}
            </a>
          ))}
        </nav>
        <a href="#demo" className="btn btn-1 !min-h-[42px] !px-4 text-[15px]">
          Request a demo
        </a>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ hero */

function Hero() {
  return (
    <section id="top" className="wrap grid items-center gap-10 py-12 md:min-h-[calc(100svh-64px)] md:grid-cols-12 md:gap-6 md:py-10">
      <div className="md:col-span-5">
        <h1 className="h text-[clamp(2.3rem,4.7vw,4.2rem)]">Six-axis robot arms for small factories</h1>
        <p className="mt-6 max-w-[38ch] text-[1.1rem] text-ink-2">Gravon arms carry 6 to 20 kg, repeat to ±0.03 mm and are bolted down, taught and running in one shift.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#demo" className="btn btn-1">
            Request a demo
          </a>
          <a href="#range" className="btn">
            See the range
          </a>
        </div>
      </div>
      <figure className="fig sheet-grid md:col-span-7">
        <svg viewBox="-170 -350 480 400" className="draw block h-auto w-full" role="img" aria-label="Side elevation of the Gravon G12 arm with its reach and height dimensioned">
          {/* working envelope */}
          <path d="M-150 -90A280 280 0 0 1 280 -90" fill="none" stroke="var(--color-rule-2)" strokeWidth="0.8" strokeDasharray="5 4" />
          <Arm pose={POSES.home} />
          <Dim x1={0} x2={260} y={26} label="reach 1,300 mm" up={false} />
          <g transform="translate(-112 0) rotate(-90)">
            <Dim x1={0} x2={240} y={0} label="shoulder to wrist 1,400 mm" />
          </g>
          <text x="-160" y="-330" fontSize="9" fill="var(--color-muted)" className="num">
            G12, side elevation, scale 1:10
          </text>
          <text x="300" y="-330" fontSize="9" textAnchor="end" fill="var(--color-muted)" className="num">
            sheet 01 of 07
          </text>
        </svg>
      </figure>
    </section>
  )
}

/* ---------------------------------------------- pinned scene: three jobs */

const JOBS = [
  { key: 'pick', title: 'Machine tending', line: 'Loads a blank into a CNC lathe and takes the finished part out, 410 times a shift.', spec: [['Cycle', '70 s'], ['Tool', 'Two-finger gripper'], ['Typical model', 'G6']], tool: 'grip' },
  { key: 'weld', title: 'MIG welding', line: 'Follows a seam within 0.1 mm at 12 mm a second and keeps the torch angle constant.', spec: [['Seam speed', '12 mm/s'], ['Tool', 'Welding torch'], ['Typical model', 'G12']], tool: 'torch' },
  { key: 'stack', title: 'Palletising', line: 'Stacks 20 kg boxes six layers high and changes the pattern from the teach tablet.', spec: [['Rate', '9 boxes/min'], ['Tool', 'Vacuum gripper'], ['Typical model', 'G20']], tool: 'vacuum' },
]

function Work({ job, k }) {
  // the thing the arm works on, drawn under the tool tip
  if (job === 'pick')
    return (
      <g opacity={k}>
        <rect x="150" y="-34" width="130" height="34" fill="none" stroke="var(--color-ink)" strokeWidth="1.1" />
        <path d="M150 -24h130" stroke="var(--color-rule-2)" />
        <rect x="174" y="-52" width="28" height="18" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.1" />
        <rect x="228" y="-52" width="28" height="18" fill="none" stroke="var(--color-rule-2)" strokeDasharray="3 3" />
      </g>
    )
  if (job === 'weld')
    return (
      <g opacity={k}>
        <path d="M180 -212h110M233 -212v-50h57" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
        <path d="M184 -212v212M286 -212v212" stroke="var(--color-rule-2)" strokeWidth="0.9" />
        <path d="M226 -212l7-8" stroke="var(--color-ink)" strokeWidth="2.4" />
      </g>
    )
  return (
    <g opacity={k}>
      {[0, 1, 2, 3].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={104 + c * 46} y={-44 - r * 34} width="44" height="32" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1" />))}
      <rect x="96" y="-10" width="108" height="10" fill="none" stroke="var(--color-ink)" strokeWidth="1.1" />
    </g>
  )
}

function Tasks() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const sp = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 })
  const [p, setP] = useState(0)
  useMotionValueEvent(sp, 'change', (v) => setP(Math.max(0, Math.min(1, v))))
  // three holds joined by two moves: 0-.24 hold, .24-.4 move, .4-.6 hold, .6-.76 move, .76-1 hold
  const pose = p < 0.4 ? mix(POSES.pick, POSES.weld, (p - 0.24) / 0.16) : mix(POSES.weld, POSES.stack, (p - 0.6) / 0.16)
  const idx = p < 0.32 ? 0 : p < 0.68 ? 1 : 2
  const job = JOBS[idx]
  const vis = (i) => Math.max(0, Math.min(1, i === 0 ? (0.34 - p) / 0.08 : i === 1 ? Math.min((p - 0.34) / 0.08, (0.66 - p) / 0.08) : (p - 0.66) / 0.08))
  return (
    <section id="tasks" ref={ref} className="relative h-[400vh] bg-paper-2">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="wrap grid h-full grid-rows-[minmax(0,1fr)_auto] gap-4 pb-6 pt-20 md:grid-cols-12 md:grid-rows-1 md:items-center md:gap-6 md:pt-16">
          <figure className="fig sheet-grid min-h-0 md:order-2 md:col-span-7" style={{ '--arm-fill': 'var(--color-paper-2)' }}>
            <svg viewBox="-170 -350 480 400" className="mx-auto block h-full max-h-[78svh] w-full" role="img" aria-label={`The arm in its ${job.title.toLowerCase()} position`}>
              <Work job="pick" k={vis(0)} />
              <Work job="weld" k={vis(1)} />
              <Work job="stack" k={vis(2)} />
              <Arm pose={pose} tool={job.tool} />
              <g className="num" fontSize="9" fill="var(--color-ink)">
                {pose.j.map((v, i) => (
                  <text key={i} x={-160 + (i % 3) * 62} y={-330 + Math.floor(i / 3) * 14}>
                    J{i + 1} {v >= 0 ? '+' : '−'}
                    {Math.abs(v).toFixed(1).padStart(5, '0')}°
                  </text>
                ))}
              </g>
              <text x="300" y="-330" fontSize="9" textAnchor="end" fill="var(--color-muted)" className="num">
                task 0{idx + 1} of 03
              </text>
            </svg>
          </figure>
          <div className="md:order-1 md:col-span-5">
            <p className="label">Three of the jobs it does. Scroll to move the arm.</p>
            <h2 className="h mt-3 text-[clamp(2rem,4.2vw,3.6rem)]" aria-live="polite">
              {job.title}
            </h2>
            <p className="mt-4 min-h-[4.6em] max-w-[36ch] text-ink-2">{job.line}</p>
            <dl className="mt-4 hidden md:block">
              {job.spec.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-t border-rule-2 py-3 last:border-b">
                  <dt className="label">{k}</dt>
                  <dd className={k === 'Tool' || k === 'Typical model' ? 'font-medium' : 'num'}>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex gap-2" aria-hidden="true">
              {JOBS.map((j, i) => (
                <span key={j.key} className={`h-[3px] flex-1 origin-left transition-colors duration-200 ${i <= idx ? 'bg-ink' : 'bg-rule-2'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- range */

const RANGE = [
  { id: 'G6', payload: '6 kg', reach: '900 mm', rep: '±0.02 mm', weight: '21 kg', price: 21900, scale: 0.7, use: 'Machine tending, screwdriving, inspection' },
  { id: 'G12', payload: '12 kg', reach: '1,300 mm', rep: '±0.03 mm', weight: '34 kg', price: 27400, scale: 0.86, use: 'Welding, gluing, assembly' },
  { id: 'G20', payload: '20 kg', reach: '1,700 mm', rep: '±0.05 mm', weight: '62 kg', price: 34800, scale: 1, use: 'Palletising, heavy machine tending' },
]
const eur = (n) => '€' + n.toLocaleString('en-US')

function Range() {
  return (
    <section id="range" className="wrap py-24 md:py-36">
      <div className="grid gap-6 md:grid-cols-12">
        <h2 className="h text-[clamp(2rem,4.2vw,3.6rem)] md:col-span-6">Three arms, 6 to 20 kg</h2>
        <p className="max-w-[40ch] text-ink-2 md:col-span-4 md:col-start-8 md:self-end">All three share one controller, one teach tablet and one set of spare joints, drawn here at the same scale.</p>
      </div>
      <div className="mt-14 grid md:grid-cols-3">
        {RANGE.map((m, i) => (
          <article key={m.id} className={`pb-10 md:px-8 md:pb-0 md:pt-0 ${i ? 'border-t-2 border-rule pt-10 md:border-l-2 md:border-t-0' : 'md:pl-0'} ${i === 2 ? 'md:pr-0' : ''}`}>
            <svg viewBox="-170 -360 480 380" className="block h-auto w-full" aria-hidden="true">
              <g transform={`scale(${m.scale})`}>
                <Arm pose={{ t1: 12, t2: 96, t3: 160 }} tags={false} tool={i === 2 ? 'vacuum' : i === 1 ? 'torch' : 'grip'} />
              </g>
            </svg>
            <h3 className="h text-[clamp(3rem,5vw,4.4rem)]">{m.id}</h3>
            <p className="mt-2 min-h-[3.2em] text-ink-2">{m.use}</p>
            <dl className="mt-5">
              {[['Payload', m.payload], ['Reach', m.reach], ['Repeatability', m.rep], ['Arm weight', m.weight], ['Price', eur(m.price)]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-t border-rule-2 py-2.5 last:border-b">
                  <dt className="label">{k}</dt>
                  <dd className="num">{v}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ----------------------------------------------------- installed figure */

function Installed() {
  return (
    <section className="bg-paper-3">
      <div className="wrap py-24 md:py-32">
        <p className="h text-[clamp(4.5rem,17vw,15rem)] leading-[0.86]">1,240</p>
        <div className="mt-8">
          <motion.div className="dim origin-left" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: '0px 0px -20% 0px' }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
          <div className="num mt-4 flex justify-between text-[0.95rem]">
            <span>2016, arm no. 1, Brno</span>
            <span className="text-right">2026, arm no. 1,240</span>
          </div>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-12">
          <p className="max-w-[34ch] text-[1.2rem] md:col-span-5">Gravon arms installed in 19 countries. 1,173 of them reported in to our service desk this month.</p>
          <dl className="grid grid-cols-3 gap-6 md:col-span-6 md:col-start-7">
            {[['97.8%', 'measured uptime in 2025'], ['31,000 h', 'mean time between joint failures'], ['48 h', 'to ship any spare part in Europe']].map(([n, l]) => (
              <div key={l} className="border-l border-rule-2 pl-4">
                <dt className="num text-[1.25rem]">{n}</dt>
                <dd className="label mt-1">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- payback */

function Payback() {
  const [model, setModel] = useState(1)
  const [wage, setWage] = useState(24)
  const [shifts, setShifts] = useState(2)
  const cell = RANGE[model].price + 9800 // arm plus gripper, stand, guarding and install
  const saved = Math.round(shifts * 8 * 240 * wage * 0.85)
  const months = Math.max(1, Math.round((cell / saved) * 12 * 10) / 10)
  return (
    <section id="payback" className="wrap py-24 md:py-36">
      <div className="grid gap-6 md:grid-cols-12">
        <h2 className="h text-[clamp(2rem,4.2vw,3.6rem)] md:col-span-6">Payback, worked out for your shift</h2>
        <p className="max-w-[40ch] text-ink-2 md:col-span-4 md:col-start-8 md:self-end">A cell is the arm plus €9,800 for the gripper, the stand, the guarding and the install day. One arm frees one operator for 85% of a shift.</p>
      </div>
      <div className="mt-14 grid md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="grid grid-cols-3">
            {RANGE.map((m, i) => (
              <button key={m.id} type="button" aria-pressed={model === i} onClick={() => setModel(i)} className={`cell text-left transition-colors duration-150 ${model === i ? 'bg-ink text-paper' : 'hover:bg-paper-3'}`}>
                <span className={`block text-[0.875rem] font-medium ${model === i ? '' : 'text-muted'}`}>Model</span>
                <span className="h3 block text-[1.6rem]">{m.id}</span>
              </button>
            ))}
          </div>
          <div className="cell">
            <label htmlFor="wage" className="label flex justify-between">
              Operator cost per hour <span className="num text-ink">€{wage}</span>
            </label>
            <input id="wage" type="range" min={10} max={48} value={wage} onChange={(e) => setWage(+e.target.value)} />
          </div>
          <div className="grid grid-cols-3">
            {[1, 2, 3].map((s) => (
              <button key={s} type="button" aria-pressed={shifts === s} onClick={() => setShifts(s)} className={`cell text-left transition-colors duration-150 ${shifts === s ? 'bg-ink text-paper' : 'hover:bg-paper-3'}`}>
                <span className={`block text-[0.875rem] font-medium ${shifts === s ? '' : 'text-muted'}`}>Shifts a day</span>
                <span className="h3 block text-[1.6rem]">{s}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="cell flex flex-col justify-between md:col-span-5" aria-live="polite">
          <p className="label">The cell pays for itself in</p>
          <p className="h py-6 text-[clamp(3.6rem,8vw,7rem)] leading-[0.9]">
            {months.toFixed(1)}
            <span className="h3 ml-3 text-[0.3em] normal-case">months</span>
          </p>
          <dl>
            <div className="flex justify-between border-t border-rule-2 py-2.5">
              <dt className="label">Cell price</dt>
              <dd className="num">{eur(cell)}</dd>
            </div>
            <div className="flex justify-between border-t border-rule-2 py-2.5">
              <dt className="label">Labour freed per year</dt>
              <dd className="num">{eur(saved)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------- install day */

const DAY = [
  ['07:00', 'Unbox', 'Two crates. The heavier one holds the arm and weighs 48 kg.'],
  ['08:30', 'Bolt down', 'Four M12 anchors into the floor, or eight bolts onto our stand.'],
  ['10:00', 'Teach', 'An engineer moves the arm by hand through the job. The tablet records each point.'],
  ['13:00', 'First part', 'The arm runs at 30% speed for an hour while your operator watches.'],
  ['15:00', 'Handover', 'Your operator has taught one job alone. We leave a printed manual and a phone number.'],
]

function Install() {
  return (
    <section id="install" className="bg-paper-2">
      <div className="wrap py-24 md:py-36">
        <h2 className="h max-w-[16ch] text-[clamp(2rem,4.2vw,3.6rem)]">Install day, 07:00 to 15:00</h2>
        <div className="mt-16 hidden md:block">
          <div className="dim" />
        </div>
        <ol className="mt-8 grid gap-8 md:mt-0 md:grid-cols-5 md:gap-6">
          {DAY.map(([t, name, text], i) => (
            <li key={t} className="relative border-l border-rule pl-4 md:border-l-0 md:pl-0 md:pt-8">
              <span className="absolute left-0 top-0 hidden h-4 w-px bg-rule md:block" />
              <p className="num text-[1.05rem]">{t}</p>
              <h3 className="h3 mt-2 text-[1.5rem]">
                {i + 1}. {name}
              </h3>
              <p className="mt-2 text-[0.95rem] text-ink-2">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ crew */

const CREW = [
  ['FE-014', 'Radka Vondrová', 'Field engineer, Brno', '87 cells commissioned', 'Carries a torque wrench her grandfather used on tractors. It is still in calibration.'],
  ['FE-031', 'Mateus Okafor', 'Field engineer, Porto', '52 cells commissioned', 'Once taught an arm to ice 400 cakes an hour. The bakery now runs three.'],
  ['QL-003', 'Ingrid Sæther', 'Endurance lab lead', '11 arms running since 2019', 'Her lab is called the treadmill. Arms there repeat one move until a joint fails, and she writes down when.'],
  ['SD-007', 'Bao Reinholt', 'Service desk, nights', '4 min median answer time', 'Has talked a night-shift operator through a joint swap over the phone, twice.'],
]

function Crew() {
  return (
    <section id="crew" className="wrap py-24 md:py-36">
      <div className="grid gap-6 md:grid-cols-12">
        <h2 className="h text-[clamp(2rem,4.2vw,3.6rem)] md:col-span-6">The crew that turns up</h2>
        <p className="max-w-[40ch] text-ink-2 md:col-span-4 md:col-start-8 md:self-end">Gravon employs 146 people. 38 are field engineers, and the one who installs your arm is the one you call afterwards.</p>
      </div>
      <div className="mt-14 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-rule">
              {['No.', 'Name', 'Post', 'Record', 'Note'].map((h) => (
                <th key={h} scope="col" className="label pb-3 pr-6 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CREW.map(([no, name, post, rec, note]) => (
              <tr key={no} className="border-b border-rule-2 align-top transition-colors duration-150 hover:bg-paper-2">
                <td className="num py-5 pr-6">{no}</td>
                <th scope="row" className="h3 py-5 pr-6 text-[1.35rem] whitespace-nowrap">
                  {name}
                </th>
                <td className="py-5 pr-6 text-ink-2">{post}</td>
                <td className="num py-5 pr-6 whitespace-nowrap">{rec}</td>
                <td className="max-w-[34ch] py-5 text-ink-2">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ demo */

function Demo() {
  const f = useMockForm()
  return (
    <section id="demo" className="bg-paper-3">
      <div className="wrap grid gap-12 py-24 md:grid-cols-12 md:gap-6 md:py-36">
        <div className="md:col-span-5">
          <h2 className="h text-[clamp(2.3rem,4.7vw,4.2rem)]">Request a demo at your plant</h2>
          <p className="mt-6 max-w-[36ch] text-ink-2">A field engineer brings a G12 in a van, sets it up next to your machine and runs one of your parts. It takes half a day and costs nothing.</p>
          <dl className="mt-10">
            {[['Works', 'Tovární, Brno-Židenice'], ['Demo vans', '6, covering 19 countries'], ['Lead time', '9 working days from order']].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-t border-rule-2 py-3 last:border-b">
                <dt className="label">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          {f.state === 'sent' ? (
            <div role="status" className="cell !p-8">
              <p className="num">Request GR-{f.ticket}</p>
              <p className="h mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">Demo request filed</p>
              <p className="mt-4 max-w-[40ch] text-ink-2">This title block is a simulation. Nothing left your browser and no van is on its way.</p>
              <button type="button" onClick={f.reset} className="btn mt-8">
                File another request
              </button>
            </div>
          ) : (
            <form onSubmit={f.onSubmit} className="pr-px">
              <div className="grid sm:grid-cols-2">
                <label className="cell label">
                  Your name
                  <input required name="name" autoComplete="name" placeholder="Jana Holub" />
                </label>
                <label className="cell label">
                  Work email
                  <input required type="email" name="email" autoComplete="email" placeholder="jana@works.com" />
                </label>
              </div>
              <div className="grid sm:grid-cols-[2fr_1fr]">
                <label className="cell label">
                  Company and town
                  <input name="company" placeholder="Holub Precision, Plzeň" />
                </label>
                <label className="cell label">
                  Job for the arm
                  <select name="job" defaultValue="Machine tending">
                    {['Machine tending', 'Welding', 'Palletising', 'Something else'].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="cell label block">
                The part and the machine
                <textarea name="part" rows={3} placeholder="Steel flange, 4 kg, loaded into a Mazak lathe every 70 seconds" className="resize-none" />
              </label>
              <div className="cell flex flex-wrap items-center justify-between gap-4 !py-4">
                <p className="label">A simulated form. No data is sent.</p>
                <button type="submit" disabled={f.state === 'sending'} className="btn btn-1 disabled:opacity-70">
                  {f.state === 'sending' ? 'Filing the request' : 'Request a demo'}
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
    <footer className="wrap pb-28 pt-14">
      <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] md:pr-px">
        <div className="cell !py-5">
          <Mark />
          <p className="mt-4 max-w-[34ch] text-[0.95rem] text-ink-2">Six-axis robot arms, designed and assembled in Brno since 2016.</p>
        </div>
        {[['Drawn', 'Gravon Robotics'], ['Sheet', '07 of 07'], ['Revision', 'C, November 2026']].map(([k, v]) => (
          <div key={k} className="cell !py-5">
            <p className="label">{k}</p>
            <p className="num mt-1">{v}</p>
          </div>
        ))}
      </div>
      <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-medium">
        {[['#tasks', 'Tasks'], ['#range', 'Range'], ['#payback', 'Payback'], ['#install', 'Install day'], ['#crew', 'Field crew'], ['#demo', 'Request a demo']].map(([h, l]) => (
          <li key={h}>
            <a href={h} className="lnk">
              {l}
            </a>
          </li>
        ))}
      </ul>
      <p className="label mt-8 max-w-[70ch]">© 2026 Gravon Robotics. Gravon, its arms, its people and every figure on this page are fictional and exist to demonstrate a design.</p>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Tasks />
        <Range />
        <Installed />
        <Payback />
        <Install />
        <Crew />
        <Demo />
      </main>
      <Footer />
      <SiteSwitcher current="gravon" dark />
    </>
  )
}

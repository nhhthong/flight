import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { SiteSwitcher, useMockForm } from '../../shared/ui.jsx'

const FILL = {
  pink: 'bg-pink text-white',
  lime: 'bg-lime text-ink',
  ink: 'bg-ink text-paper',
  white: 'bg-white text-ink',
}

/* ------------------------------------------------------------------- nav */

function Wordmark() {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label="Sootfox Games, home">
      <span className="grid h-9 w-9 -rotate-6 place-items-center rounded-[10px] border-[3px] border-white bg-pink shadow-[3px_3px_0_var(--color-ink)]">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M2 2l4.500 4h5L16 2v8l-7 6-7-6z" fill="var(--color-white)" />
        </svg>
      </span>
      <span className="h text-[1.35rem]">Sootfox</span>
    </a>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-paper">
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        <Wordmark />
        <nav aria-label="Main" className="hidden items-center gap-7 text-[1rem] font-bold md:flex">
          {[['#games', 'Games'], ['#play', 'Play a round'], ['#crew', 'Crew'], ['#jobs', 'Jobs']].map(([h, l]) => (
            <a key={h} href={h} className="lnk">
              {l}
            </a>
          ))}
        </nav>
        <a href="#write" className="btn !h-11 !px-5 text-[0.95rem]">
          Write to the studio
        </a>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ hero */

const STICKERS = [
  { t: '23', s: 'people, one studio', fill: 'pink', big: true, x: '4%', y: '6%', r: -5, w: '46%' },
  { t: '3 games', s: 'shipped since 2018', fill: 'lime', x: '50%', y: '0%', r: 4, w: '46%' },
  { t: '0', s: 'weekends worked, ever', fill: 'ink', big: true, x: '56%', y: '30%', r: -3, w: '40%' },
  { t: '4-day', s: 'week, Monday to Thursday', fill: 'white', x: '0%', y: '52%', r: 3, w: '50%' },
  { t: '1.9 m', s: 'copies of Night Market', fill: 'lime', x: '30%', y: '74%', r: -2, w: '52%' },
]

function Pile() {
  const box = useRef(null)
  const reduce = useReducedMotion()
  const [top, setTop] = useState(null)
  return (
    <div ref={box} className="relative mx-auto aspect-[1/1.02] w-full max-w-[560px]">
      {STICKERS.map((s, i) => (
        <motion.div
          key={s.t}
          drag
          dragConstraints={box}
          dragElastic={0.12}
          dragMomentum={!reduce}
          whileDrag={{ scale: 1.04, rotate: s.r + 3 }}
          onPointerDown={() => setTop(i)}
          initial={reduce ? false : { y: -40, opacity: 0, rotate: s.r * 3 }}
          animate={{ y: 0, opacity: 1, rotate: s.r }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 + i * 0.08 }}
          className={`diecut absolute cursor-grab touch-none select-none p-5 active:cursor-grabbing md:p-6 ${FILL[s.fill]}`}
          style={{ left: s.x, top: s.y, width: s.w, zIndex: top === i ? 10 : i }}
        >
          <p className={`h ${s.big ? 'text-[clamp(4rem,9vw,7.5rem)] leading-[0.9]' : 'text-[clamp(1.6rem,2.9vw,2.4rem)]'}`}>{s.t}</p>
          <p className="mt-1.5 text-[0.95rem] font-bold leading-snug">{s.s}</p>
        </motion.div>
      ))}
    </div>
  )
}

function Hero() {
  return (
    <section id="top" className="wrap grid items-center gap-10 pb-16 pt-8 md:min-h-[calc(100svh-72px)] md:grid-cols-12 md:gap-6 md:py-8">
      <div className="md:col-span-6">
        <h1 className="h text-[clamp(2.3rem,4.9vw,4.5rem)]">Cosy management games from Ghent</h1>
        <p className="mt-6 max-w-[36ch] text-[1.2rem]">Sootfox makes small, warm games about running things: a noodle stall, a parcel round, a tidal garden.</p>
        <div className="mt-9 flex flex-wrap items-center gap-5">
          <a href="#games" className="btn btn-1">
            See the three games
          </a>
          <a href="#play" className="btn">
            Play a round
          </a>
        </div>
        <p className="label mt-8">The stickers on the right come off. Drag them.</p>
      </div>
      <div className="md:col-span-6">
        <Pile />
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- games */

const GAMES = [
  { name: 'Night Market', fill: 'pink', fig: '€19', line: 'Run a noodle stall on a street that only wakes after dark. Out now on PC and Switch.', rows: [['Released', 'March 2023'], ['Players', '1.9 million'], ['Reviews', '96% positive']], tilt: -1.5, span: 'md:col-span-7' },
  { name: 'Parcel Cat', fill: 'white', fig: '€14', line: 'Plan a delivery round through a hill town and get home before the rain. Out now on PC.', rows: [['Released', 'October 2025'], ['Levels', '84 streets']], tilt: 1.5, span: 'md:col-span-5' },
  { name: 'Tide Garden', fill: 'lime', fig: '2027', line: 'Plant a garden that floods twice a day. In production, with a demo planned for June.', rows: [['Team', '11 people'], ['Platforms', 'PC, Switch 2']], tilt: 1, span: 'md:col-span-5' },
]

function Games() {
  return (
    <section id="games" className="wrap py-20 md:py-32">
      <div className="grid gap-4 md:grid-cols-12 md:gap-6">
        <h2 className="h text-[clamp(1.9rem,3.6vw,3.25rem)] md:col-span-6">Three games so far</h2>
        <p className="max-w-[38ch] md:col-span-4 md:col-start-8 md:self-end">Each one took about two years and was finished by the people who started it.</p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-12 md:gap-7">
        {GAMES.map((g) => (
          <article key={g.name} className={`diecut flex flex-col justify-between p-7 md:p-9 ${FILL[g.fill]} ${g.span}`} style={{ rotate: `${g.tilt}deg` }}>
            <div className="flex items-start justify-between gap-6">
              <h3 className="h text-[clamp(2rem,3.8vw,3.25rem)]">{g.name}</h3>
              <p className="h shrink-0 text-[clamp(2rem,3.8vw,3.25rem)]">{g.fig}</p>
            </div>
            <div>
              <p className="mt-16 max-w-[38ch] text-[1.1rem] font-semibold md:mt-24">{g.line}</p>
              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[0.95rem] font-bold">
                {g.rows.map(([k, v]) => (
                  <div key={k}>
                    <dt className="opacity-75">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        ))}
        <div className="diecut flex flex-col justify-between bg-ink p-7 text-paper md:col-span-7 md:p-9" style={{ rotate: '-1deg' }}>
          <p className="h text-[clamp(1.5rem,2.6vw,2.2rem)]">All three run on a 2019 laptop</p>
          <p className="mt-10 max-w-[44ch] font-semibold">We test every build on the oldest machine in the office, a laptop called Gran. If Gran drops below 60 frames, the build does not ship.</p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------- play: a working stall */

const DISHES = [
  { id: 'Noodles', coins: 4 },
  { id: 'Dumplings', coins: 3 },
  { id: 'Iced tea', coins: 2 },
]
const RENT = 40
const pick = () => DISHES[Math.floor(Math.random() * DISHES.length)].id
const SEED = ['Noodles', 'Iced tea', 'Dumplings', 'Noodles']

function Play() {
  const [queue, setQueue] = useState(SEED)
  const [coins, setCoins] = useState(0)
  const [night, setNight] = useState(1)
  const [served, setServed] = useState(0)
  const [miss, setMiss] = useState(0)
  const serve = (dish) => {
    if (dish.id !== queue[0]) return setMiss((m) => m + 1)
    setQueue((q) => [...q.slice(1), pick()])
    setServed((s) => s + 1)
    const next = coins + dish.coins
    if (next >= RENT) {
      setNight((n) => n + 1)
      setCoins(0)
    } else setCoins(next)
  }
  return (
    <section id="play" className="bg-lime">
      <div className="wrap grid gap-10 py-20 md:grid-cols-12 md:gap-6 md:py-28">
        <div className="md:col-span-5">
          <h2 className="h text-[clamp(1.9rem,3.6vw,3.25rem)]">Play a round of Night Market</h2>
          <p className="mt-5 max-w-[34ch] text-[1.1rem] font-semibold">Serve whoever is first in the queue. Forty coins pays tonight’s rent on the stall.</p>
          <p className="h mt-10 text-[clamp(5rem,12vw,10rem)] leading-[0.85]" aria-live="polite">
            {coins}
          </p>
          <p className="font-bold">coins of {RENT}, night {night}</p>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <div className="diecut bg-white p-6 md:p-8" style={{ rotate: '1deg' }}>
            <p className="label">The queue, first on the left</p>
            <ol className="mt-3 flex flex-wrap gap-2">
              {queue.map((q, i) => (
                <li key={`${served}-${i}`} className={`rounded-full px-4 py-2 text-[0.95rem] font-bold ${i === 0 ? 'bg-ink text-paper' : 'shadow-[inset_0_0_0_2px_var(--color-rule)]'}`}>
                  {q}
                </li>
              ))}
            </ol>
            <div className="dash my-6" />
            <p className="label">Your stall</p>
            <div key={miss} className={`mt-3 grid grid-cols-3 gap-3 ${miss ? 'nope' : ''}`}>
              {DISHES.map((d) => (
                <button key={d.id} type="button" onClick={() => serve(d)} className="lift rounded-[18px] border-2 border-ink bg-paper px-2 py-5 text-center shadow-[4px_5px_0_var(--color-ink)]">
                  <span className="block font-bold">{d.id}</span>
                  <span className="label block">{d.coins} coins</span>
                </button>
              ))}
            </div>
            <div className="mt-7 h-5 overflow-hidden rounded-full shadow-[inset_0_0_0_2px_var(--color-ink)]" role="progressbar" aria-valuemin={0} aria-valuemax={RENT} aria-valuenow={coins} aria-label="Rent paid">
              <div className="h-full origin-left bg-pink transition-transform duration-200 ease-out" style={{ transform: `scaleX(${coins / RENT})` }} />
            </div>
            <p className="label mt-3">
              {served} served{miss ? `, ${miss} wrong ${miss === 1 ? 'order' : 'orders'}` : ''}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------- how */

const HOW = [
  ['Prototype in two weeks', 'Anyone can pitch. A pitch gets two people and ten working days, then the studio plays it.'],
  ['Playtest every Thursday', 'Strangers come in at 14:00 and play the current build. We watch and say nothing.'],
  ['Work four days', 'Monday to Thursday, 32 hours, full pay. It has been this way since the first hire.'],
  ['Ship when Gran says so', 'A date moves before a team works a weekend. Night Market slipped twice.'],
]

function How() {
  return (
    <section className="wrap py-20 md:py-32">
      <h2 className="h max-w-[14ch] text-[clamp(1.9rem,3.6vw,3.25rem)]">Four rules for making a game</h2>
      <div className="relative mt-14">
        <div className="dash absolute inset-x-0 top-10 hidden md:block" />
        <ol className="relative grid gap-8 md:grid-cols-4 md:gap-5">
          {HOW.map(([t, d], i) => (
            <li key={t} className="diecut bg-white p-6" style={{ rotate: `${[-2, 1.5, -1, 2][i]}deg` }}>
              <span className="h grid h-14 w-14 place-items-center rounded-full bg-lime text-[1.6rem]">{i + 1}</span>
              <h3 className="mt-5 text-[1.25rem] font-bold leading-tight">{t}</h3>
              <p className="mt-2 text-[1rem] text-ink-2">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- statement */

function Statement() {
  return (
    <section className="bg-ink text-paper">
      <div className="wrap relative py-20 md:py-28">
        <p className="h max-w-[18ch] text-[clamp(2.2rem,5.4vw,4.5rem)]">Nobody here has shipped a game on a weekend</p>
        <span className="diecut absolute right-0 top-8 rotate-6 bg-lime px-5 py-3 font-bold text-ink md:right-10 md:top-14">8 years, 3 launches</span>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ crew */

const GUILDS = ['Everyone', 'Code', 'Art', 'Design', 'Sound']
const CREW = [
  { n: 'Lotte Verbeke', role: 'Studio lead', guild: 'Design', lv: 41, fill: 'pink', stats: [['Scope cutting', 96], ['Spreadsheets', 88], ['Sleep', 71]], quirk: 'Cut the entire weather system from Night Market on a Tuesday and brought cake on Wednesday.' },
  { n: 'Amadou Kessel', role: 'Gameplay programmer', guild: 'Code', lv: 33, fill: 'white', stats: [['Pathfinding', 92], ['Naming things', 34], ['Tea intake', 99]], quirk: 'Wrote the queue logic for the stall. Every customer in the game is called Kevin internally.' },
  { n: 'Sanne Okoro', role: 'Lead artist', guild: 'Art', lv: 37, fill: 'lime', stats: [['Lanterns drawn', 97], ['Layers named', 12], ['Deadlines hit', 90]], quirk: 'Painted 212 lanterns for one street and can still tell them apart.' },
  { n: 'Jules Marchetti', role: 'Composer', guild: 'Sound', lv: 29, fill: 'ink', stats: [['Melodicas owned', 80], ['Loop seams hidden', 94], ['Volume', 22]], quirk: 'Recorded the noodle slurp himself. It took 46 bowls over two days.' },
  { n: 'Priya Dunmore', role: 'Level designer', guild: 'Design', lv: 26, fill: 'white', stats: [['Hill towns built', 84], ['Shortcuts hidden', 91], ['Map folding', 40]], quirk: 'Walked every street in Parcel Cat on foot in a real town first, with a real parcel.' },
  { n: 'Gran', role: 'Test laptop, 2019', guild: 'Code', lv: 7, fill: 'lime', stats: [['Frames per second', 60], ['Battery', 9], ['Authority', 100]], quirk: 'Has blocked 31 builds. Nobody is allowed to update her graphics driver.' },
]

function Crew() {
  const [guild, setGuild] = useState('Everyone')
  const list = CREW.filter((c) => guild === 'Everyone' || c.guild === guild)
  return (
    <section id="crew" className="wrap py-20 md:py-32">
      <div className="grid gap-4 md:grid-cols-12 md:gap-6">
        <h2 className="h text-[clamp(1.9rem,3.6vw,3.25rem)] md:col-span-6">The crew, as a party of adventurers</h2>
        <p className="max-w-[38ch] md:col-span-4 md:col-start-8 md:self-end">Six of the 23, with their stats as measured by the rest of the studio in a vote nobody agreed to.</p>
      </div>
      <div role="group" aria-label="Guild" className="mt-10 flex flex-wrap gap-2">
        {GUILDS.map((g) => (
          <button key={g} type="button" aria-pressed={guild === g} onClick={() => setGuild(g)} className={`h-11 rounded-full px-5 text-[0.95rem] font-bold transition-colors duration-100 ${guild === g ? 'bg-ink text-paper' : 'shadow-[inset_0_0_0_2px_var(--color-ink)] hover:bg-white'}`}>
            {g}
          </button>
        ))}
      </div>
      <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c, i) => {
          const dark = c.fill === 'pink' || c.fill === 'ink'
          return (
            <motion.li layout key={c.n} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} className={`diecut p-6 ${FILL[c.fill]}`} style={{ rotate: `${[-1.5, 1, -0.5, 1.5, -1, 0.5][i % 6]}deg` }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[1.35rem] font-bold leading-tight">{c.n}</h3>
                  <p className="text-[0.95rem] font-bold opacity-80">{c.role}</p>
                </div>
                <p className="h shrink-0 text-right text-[2.4rem] leading-none">
                  {c.lv}
                  <span className="block font-sans text-[0.8rem] font-bold">level</span>
                </p>
              </div>
              <dl className="mt-6 space-y-2.5">
                {c.stats.map(([k, v]) => (
                  <div key={k}>
                    <dt className="flex justify-between text-[0.9rem] font-bold">
                      {k} <span>{v}</span>
                    </dt>
                    <dd className={`mt-1 h-2.5 overflow-hidden rounded-full ${dark ? 'bg-white/25' : 'bg-ink/12'}`}>
                      <span className={`block h-full rounded-full ${dark ? 'bg-white' : 'bg-ink'}`} style={{ width: `${v}%` }} />
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-[1rem] font-semibold leading-snug">{c.quirk}</p>
            </motion.li>
          )
        })}
      </ul>
    </section>
  )
}

/* ------------------------------------------------------------------ jobs */

const JOBS = [
  ['Tools programmer', 'Code', '€54,000 to €62,000', 'Tide Garden'],
  ['Environment artist', 'Art', '€46,000 to €55,000', 'Tide Garden'],
  ['Community lead', 'Design', '€42,000 to €48,000', 'All three games'],
  ['QA tester, part time', 'Code', '€24 an hour', 'Sits next to Gran'],
]

function Jobs() {
  return (
    <section id="jobs" className="bg-paper-2">
      <div className="wrap py-20 md:py-28">
        <div className="grid gap-4 md:grid-cols-12 md:gap-6">
          <h2 className="h text-[clamp(1.9rem,3.6vw,3.25rem)] md:col-span-6">Four open jobs</h2>
          <p className="max-w-[38ch] md:col-span-4 md:col-start-8 md:self-end">Every job is in Ghent, four days a week, and the pay band is printed below so nobody has to ask.</p>
        </div>
        <ul className="mt-12">
          {JOBS.map(([t, g, pay, where]) => (
            <li key={t} className="dash grid items-center gap-x-6 gap-y-1 py-6 last:border-b-2 last:border-dashed last:border-rule md:grid-cols-12">
              <h3 className="text-[1.4rem] font-bold md:col-span-4">{t}</h3>
              <p className="md:col-span-1">
                <span className="rounded-full bg-lime px-3 py-1 text-[0.85rem] font-bold">{g}</span>
              </p>
              <p className="font-bold md:col-span-3">{pay}</p>
              <p className="text-ink-2 md:col-span-2">{where}</p>
              <p className="md:col-span-2 md:text-right">
                <a href="#write" className="btn !h-11 !px-5 text-[0.95rem]">
                  Apply for this job
                </a>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- write */

function Write() {
  const f = useMockForm()
  const [about, setAbout] = useState('Saying hello')
  return (
    <section id="write" className="wrap grid gap-10 py-20 md:grid-cols-12 md:gap-6 md:py-32">
      <div className="md:col-span-5">
        <h2 className="h text-[clamp(2.2rem,4.6vw,4rem)]">Write to the studio</h2>
        <p className="mt-5 max-w-[34ch] text-[1.1rem]">Lotte reads everything on Monday morning and answers by Thursday, because there is no Friday.</p>
        <dl className="mt-10">
          {[['Studio', 'Dok Noord, Ghent'], ['Open days', 'First Thursday of the month, 14:00'], ['Press kit', 'Sent on request, 240 MB']].map(([k, v]) => (
            <div key={k} className="dash flex justify-between gap-6 py-3.5">
              <dt className="label">{k}</dt>
              <dd className="text-right font-bold">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="md:col-span-6 md:col-start-7">
        <div className="diecut bg-white p-6 md:p-9" style={{ rotate: '-1deg' }}>
          {f.state === 'sent' ? (
            <div role="status">
              <span className="rounded-full bg-lime px-3 py-1 text-[0.85rem] font-bold">Letter {f.ticket}</span>
              <p className="h mt-5 text-[clamp(1.6rem,2.8vw,2.4rem)]">Your letter is in the tray</p>
              <p className="mt-3 max-w-[38ch]">This form is a simulation. Nothing left your browser and Lotte will not see it on Monday.</p>
              <button type="button" onClick={f.reset} className="btn mt-7">
                Write another letter
              </button>
            </div>
          ) : (
            <form onSubmit={f.onSubmit} className="grid gap-5 sm:grid-cols-2">
              <label className="label">
                Your name
                <input required name="name" autoComplete="name" className="field" placeholder="Robin Achterberg" />
              </label>
              <label className="label">
                Email
                <input required type="email" name="email" autoComplete="email" className="field" placeholder="robin@mail.com" />
              </label>
              <fieldset className="sm:col-span-2">
                <legend className="label">What it is about</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['Saying hello', 'A job', 'Press', 'A bug'].map((o) => (
                    <button key={o} type="button" aria-pressed={about === o} onClick={() => setAbout(o)} className={`h-11 rounded-full px-4 text-[0.95rem] font-bold transition-colors duration-100 ${about === o ? 'bg-ink text-paper' : 'shadow-[inset_0_0_0_2px_var(--color-rule)] hover:shadow-[inset_0_0_0_2px_var(--color-ink)]'}`}>
                      {o}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="label sm:col-span-2">
                Your letter
                <textarea required name="msg" rows={4} className="field resize-none" placeholder="I finished Night Market twice and have a question about the dumpling lady" />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
                <p className="label">A simulated form. No data is sent.</p>
                <button type="submit" disabled={f.state === 'sending'} className="btn btn-1 disabled:opacity-70">
                  {f.state === 'sending' ? 'Posting the letter' : 'Send the letter'}
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
    <footer className="bg-ink text-paper">
      <div className="wrap pb-28 pt-14">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <Wordmark />
            <p className="mt-5 max-w-[30ch] opacity-80">A studio of 23 making cosy management games in Ghent since 2018.</p>
          </div>
          <ul className="grid grid-cols-2 gap-x-12 gap-y-2 font-bold">
            {[['#games', 'Games'], ['#play', 'Play a round'], ['#crew', 'Crew'], ['#jobs', 'Jobs'], ['#write', 'Write to the studio']].map(([h, l]) => (
              <li key={h}>
                <a href={h} className="lnk">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-14 max-w-[70ch] text-[0.9rem] font-bold opacity-65">© 2026 Sootfox Games. The studio, its games, its people and every figure on this page are fictional and exist to demonstrate a design.</p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Games />
        <Play />
        <How />
        <Statement />
        <Crew />
        <Jobs />
        <Write />
      </main>
      <Footer />
      <SiteSwitcher current="sootfox" />
    </>
  )
}

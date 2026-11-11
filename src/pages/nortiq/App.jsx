import { useState } from 'react'
import { SiteSwitcher, useMockForm } from '../../shared/ui.jsx'

const GAP = 'clamp(0.75rem, 1.6vw, 1.5rem)'
// x position of column line 8 inside a 12-column box
const LINE8 = `calc(7 * (100% + ${GAP}) / 12)`

function Wordmark() {
  return (
    <a href="#top" className="inline-grid grid-cols-[auto_auto] items-stretch gap-x-2.5 leading-[0.92]" aria-label="Nortiq Engineering, home">
      <span className="row-span-2 aspect-square bg-mark" />
      <span className="d text-[1.15rem]">Nortiq</span>
      <span className="font-display text-[1.15rem] tracking-[-0.035em]">Engineering</span>
    </a>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  const links = [
    ['#services', 'Services'],
    ['#rates', 'Rates'],
    ['#work', 'Work'],
    ['#people', 'People'],
    ['#questions', 'Questions'],
  ]
  return (
    <header className="sticky top-0 z-50 bg-paper">
      <div className="wrap flex h-[72px] items-center justify-between">
        <Wordmark />
        <nav aria-label="Main" className="hidden items-center gap-8 text-[15px] font-medium md:flex">
          {links.map(([h, l]) => (
            <a key={h} href={h} className="transition-colors hover:text-mark">
              {l}
            </a>
          ))}
          <a href="#contact" className="btn !min-h-[44px]">
            Book a call
          </a>
        </nav>
        <button type="button" className="h-11 px-2 font-medium md:hidden" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      {open && (
        <nav aria-label="Mobile" className="wrap pb-6 md:hidden">
          {[...links, ['#contact', 'Book a call']].map(([h, l]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="d block py-2 text-[2rem]">
              {l}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

/* ------------------------------------------------------------------ hero */

function HeroHead({ className = '', hidden = false, style }) {
  return (
    <h1 className={`poster rise ${className}`} aria-hidden={hidden || undefined} style={style}>
      <span>
        <span>Product teams,</span>
      </span>
      <span>
        <span>built in Porto</span>
      </span>
    </h1>
  )
}

function Hero() {
  return (
    <section id="top" className="relative overflow-x-clip">
      <div className="wrap relative flex min-h-[calc(100svh-72px)] flex-col md:min-h-[max(640px,calc(100svh-72px))]">
        {/* the ultramarine sheet: from column line 8 to the right bleed */}
        <div
          className="absolute inset-y-0 hidden bg-field md:block"
          style={{ left: LINE8, right: 'calc((100% - 100vw) / 2)' }}
          aria-hidden="true"
        />
        <div className="relative pt-[clamp(2.5rem,11vh,7rem)]">
          <HeroHead />
          {/* overprint: the same head in paper, shown only where it crosses the field */}
          <HeroHead hidden className="pointer-events-none absolute inset-x-0 top-[clamp(2.5rem,11vh,7rem)] hidden text-paper md:block" style={{ clipPath: `inset(0 0 0 ${LINE8})` }} />
        </div>

        <div className="cols relative mt-auto items-end pb-10 pt-12 md:pb-14">
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <p className="max-w-[34ch] text-[1.2rem] leading-snug text-ink-2">
              Nortiq hires, trains and runs engineering teams of 2 to 12 for product companies in Europe and Japan.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a href="#contact" className="btn">
                Book a call
              </a>
              <a href="#rates" className="lnk font-medium">
                See the rates
              </a>
            </div>
          </div>
          <div className="col-span-12 mt-10 bg-field p-6 text-paper md:col-span-5 md:col-start-8 md:mt-0 md:bg-transparent md:p-0 md:pl-8">
            <p className="d text-[clamp(4.5rem,9vw,8.5rem)] leading-[0.85] tracking-[-0.05em]">148</p>
            <p className="mt-3 max-w-[22ch] font-medium">engineers on payroll in Porto, none of them subcontracted</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- services */

const SERVICES = [
  {
    name: 'Product teams',
    line: 'A full team that only works on your product: a tech lead, backend and frontend engineers, QA, and a product owner who writes in English or Japanese.',
    rows: [['Size', '4 to 12 people'], ['Shortest contract', '6 months'], ['First demo', '14 days after signing']],
  },
  {
    name: 'Mobile apps',
    line: 'Kotlin, Swift and Flutter. The mobile group has shipped 37 apps to the App Store and Google Play and still maintains 29 of them.',
    rows: [['Platforms', 'iOS, Android'], ['Release rhythm', 'Every 2 weeks'], ['Apps shipped', '37']],
  },
  {
    name: 'Cloud',
    line: 'We move systems to AWS or GCP, write the Terraform, build the pipelines and carry the pager around the clock.',
    rows: [['On call', '24 hours, 7 days'], ['Clouds', 'AWS, GCP'], ['Typical saving', '31% of the monthly bill']],
  },
  {
    name: 'Test automation',
    line: 'An end-to-end suite in Playwright that runs on every pull request, with a one-page coverage report each Friday.',
    rows: [['Tooling', 'Playwright, k6'], ['Runs on', 'Every pull request'], ['Report', 'Weekly']],
  },
  {
    name: 'Code rescue',
    line: 'We take over a codebase another team left behind. The first two weeks are for reading it, documenting it and adding tests. Then we change it.',
    rows: [['Languages', 'PHP, Java, .NET'], ['Reading period', '2 weeks'], ['Oldest system taken over', '14 years']],
  },
]

function Services() {
  const [sel, setSel] = useState(0)
  const s = SERVICES[sel]
  return (
    <section id="services" className="wrap pb-28 pt-28 md:pb-40 md:pt-40">
      <div className="cols">
        <h2 className="d col-span-12 text-[clamp(1.5rem,2.2vw,2rem)] md:col-span-3">Five services</h2>
        <p className="col-span-12 mt-3 max-w-[40ch] text-ink-2 md:col-span-5 md:col-start-8 md:mt-0">
          Every contract is a fixed group of people who stay long enough to know your product. Pick a service to read its terms.
        </p>
      </div>
      <div className="cols mt-12 md:mt-20">
        <div role="tablist" aria-label="Services" className="col-span-12 flex flex-col items-start md:col-span-7">
          {SERVICES.map((x, i) => (
            <button
              key={x.name}
              role="tab"
              type="button"
              aria-selected={sel === i}
              onClick={() => setSel(i)}
              onMouseEnter={() => setSel(i)}
              className={`d py-1 text-left text-[clamp(2.6rem,7.2vw,6.6rem)] leading-[0.98] tracking-[-0.045em] transition-colors duration-150 ${
                sel === i ? 'text-mark' : 'text-ink hover:text-mark'
              }`}
            >
              {x.name}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="col-span-12 mt-12 md:col-span-5 md:col-start-8 md:mt-3">
          <p className="d text-[clamp(5rem,11vw,10rem)] leading-[0.8] tracking-[-0.05em] text-mark" aria-hidden="true">
            0{sel + 1}
          </p>
          <p className="mt-8 max-w-[38ch] text-[1.2rem] leading-snug">{s.line}</p>
          <dl className="mt-8">
            {s.rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-t border-rule py-3.5 last:border-b">
                <dt className="label">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- rates */

const RATE = 5200

function Rates() {
  const [n, setN] = useState(6)
  const total = (n * RATE).toLocaleString('en-US')
  const lead = n >= 4
  return (
    <section id="rates" className="on-field bg-mark text-paper">
      <div className="wrap py-20 md:py-28">
        <div className="cols">
          <h2 className="d col-span-12 text-[clamp(1.5rem,2.2vw,2rem)] md:col-span-4">One rate, any team size</h2>
          <p className="col-span-12 mt-3 max-w-[42ch] md:col-span-5 md:col-start-8 md:mt-0">
            €5,200 per engineer per month. Move the square to size a team and read the monthly cost.
          </p>
        </div>
        <div className="cols mt-14 items-end md:mt-24">
          <div className="col-span-12 md:col-span-7">
            <p className="font-medium" id="rng-label">
              Engineers on the team
            </p>
            <p className="d mt-2 text-[clamp(6rem,19vw,17rem)] leading-[0.8] tracking-[-0.055em] tabular-nums" aria-live="polite">
              {n}
            </p>
            <input
              className="rng mt-8"
              type="range"
              min={2}
              max={12}
              step={1}
              value={n}
              onChange={(e) => setN(+e.target.value)}
              aria-labelledby="rng-label"
            />
            <div className="flex justify-between text-[0.875rem] font-medium tabular-nums" aria-hidden="true">
              {[2, 4, 6, 8, 10, 12].map((k) => (
                <span key={k}>{k}</span>
              ))}
            </div>
          </div>
          <div className="col-span-12 mt-14 md:col-span-5 md:col-start-8 md:mt-0">
            <p className="font-medium">Cost per month</p>
            <p className="d mt-2 text-[clamp(3rem,6.6vw,6rem)] tracking-[-0.045em]">€{total}</p>
            <ul className="mt-8">
              {[
                ['Tech lead', lead ? 'Included in the team' : 'From 4 engineers'],
                ['QA engineer', n >= 6 ? 'Included in the team' : 'From 6 engineers'],
                ['Notice to resize', '30 days'],
                ['Invoiced', 'Monthly, in euros'],
              ].map(([k, v]) => (
                <li key={k} className="flex justify-between gap-6 border-t border-paper/40 py-3.5 last:border-b">
                  <span>{k}</span>
                  <span className="text-right font-medium">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- process */

const STEPS = [
  ['Week 0', 'We read your system', 'Two 90-minute calls. We read the code, the docs and the backlog, then send a written assessment of 6 to 10 pages.'],
  ['Week 1', 'You pick the people', 'You interview each engineer we propose for 45 minutes. Anyone you turn down is replaced within 5 working days.'],
  ['Weeks 2 and 3', 'The first sprint runs', 'The team joins your Slack and your repository. The sprint ends with a demo on staging, however small.'],
  ['Every month', 'You get one page', 'Work delivered, hours used, technical debt added and paid. You resize the team with 30 days of notice.'],
]

function Process() {
  return (
    <section className="wrap py-28 md:py-40">
      <div className="cols">
        <h2 className="d col-span-12 text-[clamp(2.6rem,6vw,5.5rem)] tracking-[-0.045em] md:col-span-9">From first call to first demo in 19 days</h2>
      </div>
      <div className="mt-14 md:mt-24">
        {STEPS.map(([when, step, what]) => (
          <div key={step} className="cols border-t border-rule py-7 last:border-b md:py-9">
            <p className="label col-span-12 md:col-span-2 md:pt-2">{when}</p>
            <h3 className="d col-span-12 mt-1 text-[clamp(1.6rem,2.8vw,2.5rem)] md:col-span-5 md:mt-0">{step}</h3>
            <p className="col-span-12 mt-3 max-w-[46ch] text-ink-2 md:col-span-5 md:col-start-8 md:mt-1">{what}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ work */

const CASES = [
  {
    fig: '−38%',
    figLine: 'checkout load time',
    client: 'Fjordpay',
    meta: 'Payments, Oslo. 9 engineers since 2021.',
    title: 'A checkout rewritten for 1,900 online shops',
    text: 'The team moved the checkout from PHP to Go and React over 8 months. The old and new systems ran side by side and the shops never went offline.',
    rows: [['Downtime during the move', '0 minutes'], ['Automated tests', '1,284']],
  },
  {
    fig: '61,000',
    figLine: 'bookings a month',
    client: 'Kumo Reserve',
    meta: 'Restaurant bookings, Fukuoka. 6 engineers since 2022.',
    title: 'A booking app for 420 izakaya',
    text: 'A Flutter app for guests and a web console for owners. The product owner on the team works in Japanese and sits in the client’s planning meetings.',
    rows: [['App Store rating in Japan', '4.7'], ['Release rhythm', 'Every 2 weeks']],
  },
  {
    fig: '2,300',
    figLine: 'tests written before any change',
    client: 'Hallweg Logistik',
    meta: 'Freight, Hamburg. 11 engineers since 2019.',
    title: 'A 14-year-old dispatch system, taken over',
    text: 'The Java system had no tests. The team wrote them first, then split the system into 7 services on Kubernetes, one at a time.',
    rows: [['Monthly server cost', 'Down 52%'], ['Services split out', '7']],
  },
]

function Work() {
  return (
    <section id="work" className="bg-paper-2">
      <div className="wrap py-28 md:py-40">
        <div className="cols">
          <h2 className="d col-span-12 text-[clamp(1.5rem,2.2vw,2rem)] md:col-span-4">Three teams at work</h2>
        </div>
        {CASES.map((c, i) => (
          <article key={c.client} className={`cols items-end ${i ? 'mt-24 md:mt-40' : 'mt-14 md:mt-24'}`}>
            <div className={`col-span-12 md:col-span-7 ${i % 2 ? 'md:order-2 md:col-start-6 md:text-right' : ''}`}>
              <p className={`d text-[clamp(4.6rem,15.5vw,14.5rem)] leading-[0.8] tracking-[-0.055em] ${i === 1 ? 'text-field' : ''}`}>{c.fig}</p>
              <p className="mt-4 text-[1.2rem] font-medium">{c.figLine}</p>
            </div>
            <div className={`col-span-12 mt-10 md:col-span-4 md:mt-0 ${i % 2 ? 'md:order-1 md:col-start-1' : 'md:col-start-9'}`}>
              <p className="d text-[1.6rem]">{c.client}</p>
              <p className="label mt-1">{c.meta}</p>
              <h3 className="mt-6 text-[1.2rem] font-medium leading-snug">{c.title}</h3>
              <p className="mt-3 text-ink-2">{c.text}</p>
              <dl className="mt-6">
                {c.rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 border-t border-paper-3 py-3 last:border-b">
                    <dt className="label">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- people */

const PEOPLE = [
  {
    name: 'Inês',
    full: 'Inês Carvalhal, tech lead on the Fjordpay team',
    years: '9 years at Nortiq',
    aside: 'Has three cats named 200, 404 and 503. The third is rarely home.',
    day: [
      ['08:30', 'Reads last night’s pull requests', 'Oslo starts an hour later, so the morning is quiet enough to review 6 to 8 of them.'],
      ['10:00', 'Pairs with a new engineer', 'Four hours a week, with whoever has been on the team for less than three months.'],
      ['12:30', 'Stand-up with the client', 'Fifteen minutes on video. Whoever keeps the camera off tells a joke.'],
      ['14:00', 'Writes a design note', 'Any change above three days of work needs one page and one person arguing against it.'],
      ['17:30', 'Five-a-side', 'Tuesdays and Thursdays. Backend has lost to QA eleven times in a row.'],
    ],
  },
  {
    name: 'Tomás',
    full: 'Tomás Bragança, lead QA engineer on the Kumo Reserve team',
    years: '5 years at Nortiq',
    aside: 'Once booked a table for minus one guests. The restaurant confirmed it.',
    day: [
      ['07:00', 'Meets Fukuoka', 'Japan is eight hours ahead, so the day starts early. Tomás has studied Japanese for three years.'],
      ['09:00', 'Reads the night run', '96 end-to-end scenarios run at 2 a.m. He checks the red ones before coffee.'],
      ['11:00', 'Writes new scenarios', 'This week: bookings for groups above 20, with a deposit.'],
      ['14:30', 'Break-the-app hour', 'The whole team stops for 45 minutes and each person tries to break the new build.'],
      ['16:00', 'Teaches the testing class', 'A free 12-session course for students at the University of Porto.'],
    ],
  },
  {
    name: 'Aoife',
    full: 'Aoife Lindqvist, site reliability engineer',
    years: '3 years at Nortiq',
    aside: 'Holds the house record: 417 days on call without a severity-one incident.',
    day: [
      ['07:00', 'Takes the pager', 'Reads the night shift’s handover log. This week she covers 4 clients in 3 time zones.'],
      ['09:30', 'Runs a fire drill', 'Once a month she switches off a service on staging to see whether the alarms ring.'],
      ['11:00', 'Cleans the cloud bill', 'Looks for servers that run and serve nobody. Last month that saved one client €2,900.'],
      ['14:00', 'Writes Terraform', 'Moving Hallweg’s database cluster to the Frankfurt region.'],
      ['16:00', 'Hands over', 'Writes down everything that happened on the shift, false alarms included.'],
    ],
  },
]

function People() {
  const [sel, setSel] = useState(0)
  const p = PEOPLE[sel]
  return (
    <section id="people" className="wrap py-28 md:py-40">
      <div className="cols">
        <h2 className="d col-span-12 text-[clamp(1.5rem,2.2vw,2rem)] md:col-span-4">A Tuesday at Nortiq</h2>
        <p className="col-span-12 mt-3 max-w-[40ch] text-ink-2 md:col-span-5 md:col-start-8 md:mt-0">
          Clients talk to these people every day, with no account manager in between. Pick a name to read their day.
        </p>
      </div>
      <div role="tablist" aria-label="People" className="mt-12 flex flex-wrap items-baseline gap-x-[0.35em] text-[clamp(3.4rem,12vw,11rem)] md:mt-20">
        {PEOPLE.map((x, i) => (
          <button
            key={x.name}
            type="button"
            role="tab"
            aria-selected={sel === i}
            onClick={() => setSel(i)}
            className={`d leading-[0.95] tracking-[-0.05em] transition-colors duration-150 ${sel === i ? 'text-mark' : 'hover:text-mark'}`}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="cols mt-12 md:mt-16">
        <div className="col-span-12 md:col-span-4">
          <p className="text-[1.2rem] font-medium leading-snug">{p.full}</p>
          <p className="label mt-2">{p.years}</p>
          <p className="mt-8 max-w-[30ch] text-ink-2">{p.aside}</p>
        </div>
        <ol className="col-span-12 mt-10 md:col-span-7 md:col-start-6 md:mt-0">
          {p.day.map(([t, what, why]) => (
            <li key={t} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-6 border-t border-rule py-5 last:border-b md:grid-cols-[7rem_minmax(0,1fr)]">
              <span className="d text-[1.5rem] tabular-nums">{t}</span>
              <span>
                <span className="block text-[1.2rem] font-medium leading-snug">{what}</span>
                <span className="mt-1.5 block max-w-[52ch] text-ink-2">{why}</span>
              </span>
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
    <section className="wrap pb-28 md:pb-40">
      <div className="cols">
        <p className="col-span-12 font-display text-[clamp(1.9rem,4.2vw,3.8rem)] leading-[1.06] tracking-[-0.03em] md:col-span-9 md:col-start-4">
          A client stays with Nortiq for 4.3 years on average, and 93 in 100 engineers are still here a year after they join. The two numbers
          depend on each other.
        </p>
      </div>
      <dl className="cols mt-16 md:mt-24">
        {[
          ['31', 'average age of an engineer'],
          ['38%', 'of engineers are women'],
          ['24', 'days of paid leave a year'],
          ['€1,200', 'a year each to spend on learning'],
        ].map(([n, l], i) => (
          <div key={l} className={`col-span-6 mb-10 md:col-span-2 md:mb-0 ${i === 0 ? 'md:col-start-4' : ''}`}>
            <dt className="d text-[clamp(2.2rem,3.6vw,3.2rem)]">{n}</dt>
            <dd className="label mt-2 max-w-[16ch]">{l}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/* ------------------------------------------------------------------- faq */

const FAQ = [
  ['Who owns the code?', 'You do. It is pushed to your repository from the first day, and the contract assigns every right in it to you.'],
  ['Which languages does the team speak?', 'Everyone meets and writes in English. 19 engineers also work in Japanese and 6 in German.'],
  ['What if an engineer leaves?', 'We tell you at least 30 days ahead, bring the replacement in for a 2-week overlap, and do not bill the overlap.'],
  ['Which hours does the team keep?', '9:00 to 18:00 in Lisbon time. That is the full working day in Berlin and the morning in New York.'],
  ['Which law governs the contract?', 'Portuguese law, or English law on request. The non-disclosure agreement is signed before the first technical call.'],
]

function Faq() {
  return (
    <section id="questions" className="bg-paper-2">
      <div className="wrap py-28 md:py-36">
        <h2 className="d text-[clamp(2.6rem,6vw,5.5rem)] tracking-[-0.045em]">Five questions before signing</h2>
        <div className="mt-14 md:mt-20">
          {FAQ.map(([q, a]) => (
            <div key={q} className="cols border-t border-paper-3 py-7 last:border-b">
              <h3 className="col-span-12 text-[1.3rem] font-medium leading-snug md:col-span-5">{q}</h3>
              <p className="col-span-12 mt-2 max-w-[52ch] text-ink-2 md:col-span-5 md:col-start-8 md:mt-0">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- contact */

const input =
  'mt-1 w-full border-0 border-b border-paper/60 bg-transparent py-2 font-display text-[clamp(1.5rem,2.4vw,2.1rem)] tracking-[-0.02em] text-paper placeholder:text-paper/45 focus:border-paper focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper'

function Contact() {
  const f = useMockForm()
  return (
    <section id="contact" className="on-field bg-field text-paper">
      <div className="wrap py-24 md:py-36">
        <h2 className="poster max-w-[9ch]">Tell us what you are building</h2>
        <div className="cols mt-16 md:mt-24">
          <div className="col-span-12 md:col-span-4">
            <p className="max-w-[30ch] text-[1.2rem] leading-snug">
              The first call takes 45 minutes, costs nothing and has a tech lead on it. We answer within one working day.
            </p>
            <dl className="mt-10">
              {[
                ['Office', 'Rua de Cedofeita, Porto'],
                ['Hours', 'Monday to Friday, 9:00 to 18:00'],
                ['Hiring', '14 open roles in Go, Kotlin and QA'],
              ].map(([k, v]) => (
                <div key={k} className="border-t border-paper/40 py-3.5 last:border-b">
                  <dt className="text-[0.875rem] font-medium opacity-80">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="col-span-12 mt-14 md:col-span-7 md:col-start-6 md:mt-0">
            {f.state === 'sent' ? (
              <div role="status">
                <p className="d text-[clamp(2.2rem,4.4vw,4rem)] tracking-[-0.04em]">Your request is noted as NQ-{f.ticket}</p>
                <p className="mt-6 max-w-[44ch] text-[1.2rem] leading-snug">
                  This form is a simulation. Nothing left your browser and nobody will write back.
                </p>
                <button type="button" onClick={f.reset} className="lnk mt-8 font-medium">
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={f.onSubmit} className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
                <label className="text-[0.875rem] font-medium">
                  Your name
                  <input required name="name" autoComplete="name" className={input} placeholder="Ada Moreau" />
                </label>
                <label className="text-[0.875rem] font-medium">
                  Work email
                  <input required type="email" name="email" autoComplete="email" className={input} placeholder="ada@company.com" />
                </label>
                <label className="text-[0.875rem] font-medium sm:col-span-2">
                  What you are building
                  <input required name="what" className={input} placeholder="A booking app that needs a new backend" />
                </label>
                <label className="text-[0.875rem] font-medium sm:col-span-2">
                  Engineers you need
                  <select name="size" defaultValue="4 to 6" className={`${input} appearance-none rounded-none`}>
                    {['2 to 3', '4 to 6', '7 to 12', 'More than 12'].map((o) => (
                      <option key={o} className="text-ink">
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:col-span-2">
                  <button type="submit" disabled={f.state === 'sending'} className="btn disabled:opacity-70">
                    {f.state === 'sending' ? 'Sending' : 'Send the request'}
                  </button>
                  <p className="text-[0.875rem] font-medium opacity-80">A simulated form. No data is sent.</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="wrap pb-28 pt-16">
      <div className="cols">
        <div className="col-span-12 md:col-span-4">
          <Wordmark />
          <p className="mt-6 max-w-[30ch] text-ink-2">Engineering teams for hire, in Porto since 2014.</p>
        </div>
        <ul className="col-span-6 mt-10 space-y-2 font-medium md:col-span-2 md:col-start-8 md:mt-0">
          {[['#services', 'Services'], ['#rates', 'Rates'], ['#work', 'Work']].map(([h, l]) => (
            <li key={h}>
              <a href={h} className="lnk">
                {l}
              </a>
            </li>
          ))}
        </ul>
        <ul className="col-span-6 mt-10 space-y-2 font-medium md:col-span-2 md:mt-0">
          {[['#people', 'People'], ['#questions', 'Questions'], ['#contact', 'Book a call']].map(([h, l]) => (
            <li key={h}>
              <a href={h} className="lnk">
                {l}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="label mt-16 max-w-[70ch]">
        © 2026 Nortiq Engineering. Nortiq, its clients, its people and every figure on this page are fictional and exist to demonstrate a design.
      </p>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Rates />
        <Process />
        <Work />
        <People />
        <Statement />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <SiteSwitcher current="nortiq" />
    </>
  )
}

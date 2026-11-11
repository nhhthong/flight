import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Reveal, SiteSwitcher, useMockForm, Photo, PhotoCredits } from '../../shared/ui.jsx'
import PHOTOS from '../../shared/photos/shiosai.json'

function Mark({ className = '' }) {
  return (
    <a href="#top" className={`flex items-baseline gap-3 ${className}`} aria-label="Shiosai, top of page">
      <span className="jp text-[1.35rem]" lang="ja" aria-hidden="true">
        潮騒
      </span>
      <span className="h text-[1.5rem]">Shiosai</span>
    </a>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  const links = [['#season', 'Season'], ['#menu', 'Menu'], ['#counter', 'The counter'], ['#visit', 'Visit']]
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-sumi/88 backdrop-blur-md">
      <div className="wrap flex h-[68px] items-center justify-between">
        <Mark />
        <nav aria-label="Main" className="hidden items-center gap-9 text-[15px] text-washi-2 md:flex">
          {links.map(([h, l]) => (
            <a key={h} href={h} className="transition-colors hover:text-gold">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#reserve" className="btn !min-h-[42px] !px-4 text-[15px]">
            Reserve
          </a>
          <button type="button" className="grid h-[42px] w-[42px] place-items-center md:hidden" aria-expanded={open} aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            <svg width="22" height="22" viewBox="0 0 22 22" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d={open ? 'M4 4l14 14M18 4L4 18' : 'M2 8h18M2 14h18'} />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="wrap grid border-t border-rule py-3 md:hidden">
          {links.map(([h, l]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="h py-2.5 text-[1.7rem]">
              {l}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      <Photo manifest={PHOTOS} name="hero" alt="Pieces of nigiri sushi set out on a dark plate" priority sizes="100vw" className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-sumi via-sumi/55 to-sumi/35" aria-hidden="true" />
      <p className="tate absolute right-[var(--gutter)] top-28 hidden text-[1.05rem] text-washi/85 md:block" lang="ja" aria-hidden="true">
        金沢　八席　一夜一献立
      </p>
      <div className="wrap relative pb-[clamp(2.5rem,7vw,6rem)] pt-36">
        <Reveal>
          <h1 className="h max-w-[11ch] text-[clamp(3.2rem,10vw,9rem)]">
            Eight seats, <em>one menu</em> a night
          </h1>
        </Reveal>
        <Reveal delay={0.12} className="mt-8 grid gap-6 md:grid-cols-12 md:items-end">
          <p className="max-w-[44ch] text-[1.1rem] text-washi/90 md:col-span-6">Shiosai is a cypress counter in Kanazawa. Each morning the chef buys what the Omicho market has, and by evening that is the menu: sushi, or a kaiseki of nine courses.</p>
          <div className="flex flex-wrap gap-3 md:col-span-6 md:justify-end">
            <a href="#reserve" className="btn">
              Reserve a seat
            </a>
            <a href="#menu" className="btn btn-line">
              Read the menu
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- season */

const SEASONS = [
  { id: 'spring', en: 'Spring', ja: '春', fish: 'Firefly squid, sea bream, bamboo shoot', line: 'The bay warms and the firefly squid come in. Everything is young, and we do very little to it.', photo: 'sashimi', alt: 'Sashimi on a glass plate set on red lacquer' },
  { id: 'summer', en: 'Summer', ja: '夏', fish: 'Rock oyster, sweetfish, conger eel', line: 'Fish run lean, so we cure and grill more. Sweetfish is salted and cooked over charcoal, whole.', photo: 'tempura', alt: 'Tempura with rice, dipping sauce and miso soup' },
  { id: 'autumn', en: 'Autumn', ja: '秋', fish: 'Mackerel, matsutake, snow crab from November', line: 'The crab boats leave on the sixth of November. Until then: mackerel pressed overnight, and mushrooms.', photo: 'kaiseki', alt: 'Grilled fish and beef on a glass dish set on red lacquer' },
  { id: 'winter', en: 'Winter', ja: '冬', fish: 'Yellowtail, cod milt, sweet shrimp', line: 'Cold water makes fat fish. Winter yellowtail from Himi is the reason some guests book a year ahead.', photo: 'nigiri', alt: 'A row of nigiri sushi, most of it tuna' },
]

function Season() {
  const [id, setId] = useState('autumn')
  const s = SEASONS.find((x) => x.id === id)
  const reduce = useReducedMotion()
  return (
    <section id="season" className="wrap py-[clamp(5rem,11vw,10rem)]">
      <div className="grid gap-10 md:grid-cols-12 md:items-center">
        <div className="md:col-span-5">
          <Reveal>
            <p className="small">What the sea gives</p>
            <h2 className="h mt-3 text-[clamp(2.4rem,5.6vw,4.8rem)]">
              The menu follows <em>the water</em>
            </h2>
          </Reveal>
          <div role="tablist" aria-label="Season" className="mt-9 flex border-b border-rule">
            {SEASONS.map((x) => (
              <button key={x.id} type="button" role="tab" aria-selected={x.id === id} onClick={() => setId(x.id)} className={`relative -mb-px flex min-h-[56px] flex-1 flex-col items-center justify-center border-b-2 pb-2 transition-colors ${x.id === id ? 'border-shu text-washi' : 'border-transparent text-muted hover:text-washi'}`}>
                <span className="jp text-[1.3rem] leading-none" lang="ja" aria-hidden="true">
                  {x.ja}
                </span>
                <span className="mt-1 text-[0.8rem]">{x.en}</span>
              </button>
            ))}
          </div>
          <div role="tabpanel" aria-live="polite" className="mt-7 min-h-[11.5rem]">
            <p className="h text-[1.7rem] leading-[1.2] text-gold">{s.fish}</p>
            <p className="mt-4 max-w-[42ch] text-washi-2">{s.line}</p>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden md:col-span-6 md:col-start-7">
          <AnimatePresence initial={false}>
            <motion.div key={s.id} className="absolute inset-0" initial={reduce ? false : { opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <Photo manifest={PHOTOS} name={s.photo} alt={s.alt} sizes="(min-width: 768px) 46vw, 92vw" className="h-full" />
            </motion.div>
          </AnimatePresence>
          <p className="tate absolute right-4 top-4 text-[2.6rem] leading-none text-washi drop-shadow-[0_2px_12px_rgb(0_0_0/0.6)]" lang="ja" aria-hidden="true">
            {s.ja}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------- menu */

const MENUS = {
  omakase: {
    name: 'Omakase',
    ja: 'おまかせ',
    price: '¥24,000',
    note: 'Eighteen pieces and three small plates, about two hours. The chef chooses; tell us what you cannot eat.',
    items: [['Kelp-cured sea bream', '昆布締め'], ['Squid with sudachi and salt', '烏賊'], ['Himi yellowtail, belly and back', '鰤'], ['Lean tuna marinated in soy', '漬け'], ['Sweet shrimp, three to a piece', '甘海老'], ['Snow crab, hand-picked', '香箱蟹'], ['Sea urchin from Hokkaido', '雲丹'], ['Conger eel with sweet glaze', '穴子'], ['Rolled omelette, like cake', '玉子']],
  },
  kaiseki: {
    name: 'Kaiseki',
    ja: '懐石',
    price: '¥19,000',
    note: 'Nine courses in the old order, from the first sip of broth to rice and pickles. About two and a half hours.',
    items: [['Sakizuke: sesame tofu, wasabi', '先付'], ['Wan: clear broth, clam, yuzu', '椀'], ['Mukozuke: three sashimi', '向付'], ['Yakimono: salt-grilled fish', '焼物'], ['Takiawase: simmered vegetables', '炊合'], ['Agemono: tempura of the day', '揚物'], ['Sunomono: crab in vinegar', '酢物'], ['Gohan: clay-pot rice, miso, pickles', '御飯'], ['Mizumono: fruit and a sweet', '水物']],
  },
  drinks: {
    name: 'To drink',
    ja: '酒',
    price: 'from ¥900',
    note: 'Sake from Ishikawa and Toyama, poured by the glass or as a flight of five matched to the menu.',
    items: [['Junmai daiginjo, Hakusan', '¥1,600'], ['Yamahai junmai, Tsurugi', '¥1,300'], ['Junmai ginjo, Toyama bay', '¥1,200'], ['Junmai, Noto', '¥900'], ['Flight of five, 60 ml each', '¥4,800'], ['Kaga bocha roasted tea', '¥600'], ['Yuzu soda, made here', '¥700']],
  },
}

function Menu() {
  const [tab, setTab] = useState('omakase')
  const m = MENUS[tab]
  return (
    <section id="menu" className="bg-sumi-2">
      <div className="wrap grid gap-12 py-[clamp(5rem,11vw,10rem)] md:grid-cols-12">
        <div className="md:col-span-4">
          <Reveal>
            <p className="small">Tonight</p>
            <h2 className="h mt-3 text-[clamp(2.4rem,5.6vw,4.8rem)]">The menu</h2>
          </Reveal>
          <div role="tablist" aria-label="Menu" className="mt-8 grid gap-1">
            {Object.entries(MENUS).map(([k, v]) => (
              <button key={k} type="button" role="tab" aria-selected={k === tab} onClick={() => setTab(k)} className={`flex min-h-[58px] items-center justify-between gap-4 border-l-2 px-4 text-left transition-colors ${k === tab ? 'border-shu bg-sumi-3' : 'border-rule text-washi-2 hover:bg-sumi-3/60'}`}>
                <span className="h text-[1.55rem]">{v.name}</span>
                <span className="jp text-[0.95rem] text-muted" lang="ja">
                  {v.ja}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div role="tabpanel" className="md:col-span-7 md:col-start-6">
          <div className="flex items-baseline justify-between gap-6 border-b border-rule pb-5">
            <p className="max-w-[46ch] text-washi-2">{m.note}</p>
            <p className="h whitespace-nowrap text-[2rem] text-gold">{m.price}</p>
          </div>
          <ul className="mt-3">
            {m.items.map(([a, b]) => (
              <li key={a} className="flex items-baseline gap-4 py-3.5">
                <span className="h text-[1.4rem]">{a}</span>
                <span className="leader" />
                <span className={/[¥]/.test(b) ? 'tabular-nums text-washi-2' : 'jp text-washi-2'} lang={/[¥]/.test(b) ? undefined : 'ja'}>
                  {b}
                </span>
              </li>
            ))}
          </ul>
          <p className="small mt-6">Prices include tax and service. The pieces change with the catch; this is last night's list.</p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ plates */

const PLATES = [
  ['nigiri', 'Tuna, three cuts', 'A row of nigiri sushi, most of it tuna'],
  ['sashimi', 'Mukozuke', 'Sashimi on a glass plate set on red lacquer'],
  ['kaiseki', 'Yakimono, off the charcoal', 'Grilled fish and beef on a glass dish set on red lacquer'],
  ['tempura', 'Agemono', 'Tempura with rice, dipping sauce and miso soup'],
  ['chirashi', 'Chirashi, at lunch on Saturdays', 'Chirashi sushi in a wooden tub'],
  ['wagashi', 'Tea and a sweet, to finish', 'A bowl of matcha and a sweet on a lacquered table'],
]

function Plates() {
  const ref = useRef(null)
  const go = (d) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.7, behavior: 'smooth' })
  return (
    <section className="py-[clamp(5rem,11vw,10rem)]" aria-labelledby="plates-h">
      <div className="wrap flex items-end justify-between gap-6">
        <Reveal>
          <h2 id="plates-h" className="h text-[clamp(2.4rem,5.6vw,4.8rem)]">
            From <em>the pass</em>
          </h2>
        </Reveal>
        <div className="flex gap-2">
          {[[-1, 'Previous dishes', 'M12 4l-6 6 6 6'], [1, 'More dishes', 'M8 4l6 6-6 6']].map(([d, l, p]) => (
            <button key={l} type="button" aria-label={l} onClick={() => go(d)} className="grid h-12 w-12 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--color-rule)] transition-colors hover:bg-sumi-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d={p} />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <ul ref={ref} className="strip mt-10" tabIndex={0} aria-label="Dishes, scroll sideways">
        {PLATES.map(([name, cap, alt], i) => (
          <li key={name} className="w-[min(78vw,440px)]">
            <Photo manifest={PHOTOS} name={name} alt={alt} sizes="(min-width: 600px) 440px, 78vw" className={i % 2 ? 'aspect-[4/5]' : 'aspect-[4/5] md:mt-12'} />
            <p className="h mt-4 text-[1.35rem]">{cap}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------------------------------------------------------------- counter */

function CounterRoom() {
  return (
    <section id="counter" className="bg-washi text-sumi">
      <div className="wrap grid gap-12 py-[clamp(5rem,11vw,10rem)] md:grid-cols-12 md:items-center">
        <Reveal className="md:col-span-7">
          <Photo manifest={PHOTOS} name="counter" alt="A pale wooden counter with places set, in a dim room" sizes="(min-width: 768px) 56vw, 92vw" className="aspect-[3/2]" />
        </Reveal>
        <div className="md:col-span-4 md:col-start-9">
          <Reveal>
            <p className="jp text-[1.1rem] text-shu" lang="ja" aria-hidden="true">
              一枚板
            </p>
            <h2 className="h mt-3 text-[clamp(2.2rem,4.8vw,4rem)]">One board of cypress, six metres long</h2>
            <p className="mt-5">The counter was cut from a single hinoki tree and is planed again every spring. You sit a forearm from the chef's hands. There are no tables, and there is no second sitting pushing you out.</p>
          </Reveal>
          <dl className="mt-8">
            {[['Seats', 'Eight, at the counter'], ['Sittings', '18:00 and 20:45'], ['Chef', 'Ren Hayashida, here since 2011']].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-t border-sumi/20 py-3.5">
                <dt className="text-sumi/60">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- reserve */

const TIMES = ['18:00', '20:45']

function Reserve() {
  const form = useMockForm()
  const [guests, setGuests] = useState(2)
  const [time, setTime] = useState(TIMES[0])
  const [menu, setMenu] = useState('Omakase')
  const each = menu === 'Omakase' ? 24000 : 19000
  return (
    <section id="visit" className="wrap grid gap-12 py-[clamp(5rem,11vw,10rem)] md:grid-cols-12">
      <div className="md:col-span-5">
        <Reveal>
          <h2 className="h text-[clamp(2.4rem,5.6vw,4.8rem)]">
            Find us by <em>the canal</em>
          </h2>
          <p className="mt-5 max-w-[42ch] text-washi-2">Seven minutes on foot from Omicho market, behind a plain wooden door with a white curtain. If the curtain is out, we are open.</p>
        </Reveal>
        <dl className="mt-9">
          {[['Address', '2-14 Kazuemachi, Kanazawa, Ishikawa'], ['Open', 'Tuesday to Saturday, dinner only'], ['Closed', 'Sunday, Monday, and the first week of January'], ['Phone', '076-000-0142']].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6rem_1fr] gap-4 border-t border-rule py-4">
              <dt className="small pt-0.5">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div id="reserve" className="scroll-mt-24 bg-sumi-2 p-[clamp(1.5rem,3.5vw,3rem)] md:col-span-6 md:col-start-7">
        {form.state === 'sent' ? (
          <div role="status">
            <p className="small">Booking {form.ticket}</p>
            <h3 className="h mt-3 text-[2.2rem]">
              {guests} {guests === 1 ? 'seat' : 'seats'} at {time}
            </h3>
            <p className="mt-3 text-washi-2">This is a demo page, so no booking was made. A real one would be confirmed by email, with a note about allergies to answer.</p>
            <button type="button" className="btn mt-7" onClick={form.reset}>
              Make another
            </button>
          </div>
        ) : (
          <form onSubmit={form.onSubmit} className="grid gap-6">
            <h3 className="h text-[2rem]">Reserve a seat</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="small">Date</span>
                <input type="date" name="date" className="field" required />
              </label>
              <fieldset>
                <legend className="small">Sitting</legend>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {TIMES.map((t) => (
                    <button key={t} type="button" aria-pressed={time === t} onClick={() => setTime(t)} className={`min-h-[52px] rounded-[2px] tabular-nums transition-colors ${time === t ? 'bg-washi text-sumi' : 'shadow-[inset_0_0_0_1px_var(--color-rule)] hover:bg-sumi-3'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
            <fieldset>
              <legend className="small">Guests</legend>
              <div className="mt-2 flex items-center gap-1.5" role="group" aria-label="Choose seats at the counter">
                {Array.from({ length: 8 }, (_, i) => (
                  <button key={i} type="button" aria-label={`${i + 1} ${i ? 'guests' : 'guest'}`} aria-pressed={guests === i + 1} onClick={() => setGuests(i + 1)} className={`h-12 flex-1 rounded-t-full transition-colors ${i < guests ? 'bg-shu' : 'bg-sumi-3 hover:bg-rule'}`} />
                ))}
              </div>
              <div className="h-2 rounded-[1px] bg-gold/70" aria-hidden="true" />
              <p className="small mt-2">
                {guests} of the eight seats
              </p>
            </fieldset>
            <fieldset>
              <legend className="small">Menu</legend>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {['Omakase', 'Kaiseki'].map((t) => (
                  <button key={t} type="button" aria-pressed={menu === t} onClick={() => setMenu(t)} className={`min-h-[52px] rounded-[2px] transition-colors ${menu === t ? 'bg-washi text-sumi' : 'shadow-[inset_0_0_0_1px_var(--color-rule)] hover:bg-sumi-3'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="small">Name</span>
                <input name="name" className="field" autoComplete="name" required />
              </label>
              <label className="grid gap-1.5">
                <span className="small">Email</span>
                <input type="email" name="email" className="field" autoComplete="email" required />
              </label>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-5">
              <p>
                <span className="small block">Menu for {guests}, drinks apart</span>
                <span className="h text-[2rem] tabular-nums text-gold">¥{(each * guests).toLocaleString('en-US')}</span>
              </p>
              <button type="submit" className="btn" disabled={form.state === 'sending'}>
                {form.state === 'sending' ? 'Reserving…' : 'Reserve'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="wrap grid gap-8 pb-28 pt-14 md:grid-cols-12">
        <Mark className="md:col-span-4" />
        <div className="small md:col-span-7 md:col-start-6">
          <p>Shiosai is an invented restaurant. The chef, address, phone number, menu and prices are fictional and the form books nothing. The photographs show real Japanese food and a real counter, but not this restaurant.</p>
          <PhotoCredits manifest={PHOTOS} className="mt-4" />
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Season />
        <Menu />
        <Plates />
        <CounterRoom />
        <Reserve />
      </main>
      <Footer />
      <SiteSwitcher current="shiosai" dark />
    </>
  )
}

const SITES = [
  { id: 'nortiq', name: 'Nortiq', kind: 'Software outsourcing', how: 'Swiss poster grid, type as the picture, a live rate calculator', bg: 'oklch(97.5% 0.005 90)', fg: 'oklch(19% 0.022 266)', dot: 'oklch(57% 0.215 29)' },
  { id: 'orvo', name: 'Orvo', kind: 'Smartphones', how: 'Scroll-driven scenes: a phone that turns, a 10x zoom, a sideways tour', bg: 'oklch(14% 0.048 264)', fg: 'oklch(95% 0.016 250)', dot: 'oklch(80% 0.11 230)' },
  { id: 'gravon', name: 'Gravon', kind: 'Industrial robots', how: 'A blueprint sheet with a robot arm that moves as you scroll', bg: 'oklch(35% 0.105 256)', fg: 'oklch(97% 0.012 240)', dot: 'oklch(97% 0.012 240)' },
  { id: 'hinoma', name: 'Hinoma', kind: 'Ceramics, English and Japanese', how: 'three.js pottery: a jar to glaze, a bowl thrown and fired on scroll', bg: 'oklch(94.5% 0.01 76)', fg: 'oklch(19% 0.024 52)', dot: 'oklch(41% 0.075 248)' },
  { id: 'sootfox', name: 'Sootfox', kind: 'Game studio', how: 'Die-cut stickers you can drag, a playable round, the crew as a party', bg: 'oklch(87.6% 0.179 119)', fg: 'oklch(21% 0.011 81)', dot: 'oklch(56% 0.225 2)' },
  { id: 'corsara', name: 'Corsara', kind: 'Supercars', how: 'Full-bleed photographs, wide type, a stock list and a finance calculator', bg: 'oklch(15% 0.004 285)', fg: 'oklch(94% 0.012 85)', dot: 'oklch(86% 0.17 96)' },
  { id: 'shiosai', name: 'Shiosai', kind: 'Japanese restaurant', how: 'An eight-seat counter: a menu by season, vertical script, seats you pick', bg: 'oklch(22% 0.014 55)', fg: 'oklch(93% 0.018 82)', dot: 'oklch(60% 0.19 32)' },
  { id: 'sekitei', name: 'Sekitei', kind: 'Karesansui gardens', how: 'Stone, gravel and white space, with a patch of gravel you can rake', bg: 'oklch(92.5% 0.008 90)', fg: 'oklch(26% 0.008 150)', dot: 'oklch(46% 0.075 142)' },
  { id: 'zenkai', name: 'Zenkai', kind: 'Radio-controlled cars', how: 'three.js: take the wheel and drive the car round a yard of cones', bg: 'oklch(68% 0.215 41)', fg: 'oklch(21% 0.012 265)', dot: 'oklch(21% 0.012 265)' },
]

export default function App() {
  return (
    <>
      <header className="wrap pb-12 pt-16 md:pb-20 md:pt-28">
        <h1 className="max-w-[14ch] text-[clamp(2.6rem,7vw,6rem)] font-semibold leading-[0.98] tracking-[-0.04em]">Nine companies, nine interfaces</h1>
        <p className="mt-6 max-w-[46ch] text-[1.15rem] text-muted">Nine landing pages for nine invented companies. Each has its own type, colour, layout and way of moving. Pick one.</p>
      </header>
      <main>
        <ol>
          {SITES.map((s, i) => (
            <li key={s.id}>
              <a href={`./${s.id}/`} className="band" style={{ '--bg': s.bg, '--fg': s.fg }}>
                <div className="wrap grid items-baseline gap-x-6 gap-y-2 md:grid-cols-12">
                  <p className="text-[0.95rem] font-medium tabular-nums opacity-70 md:col-span-1">{String(i + 1).padStart(2, '0')}</p>
                  <h2 className="flex items-center gap-4 text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-none tracking-[-0.04em] md:col-span-5">
                    {s.name}
                    <span className="h-[0.22em] w-[0.22em] shrink-0 rounded-full" style={{ background: s.dot }} />
                  </h2>
                  <p className="font-medium md:col-span-2">{s.kind}</p>
                  <p className="max-w-[40ch] opacity-80 md:col-span-3">{s.how}</p>
                  <p className="go hidden text-right text-[1.6rem] leading-none md:col-span-1 md:block" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto">
                      <path d="M4 14h19M16 6l8 8-8 8" />
                    </svg>
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ol>
      </main>
      <footer className="wrap py-14 text-[0.9rem] text-muted">
        <p className="max-w-[70ch]">Every company, person, product and figure on these pages is fictional. The contact forms are simulations and send nothing. Photographs come from Wikimedia Commons under open licences and are credited on each page.</p>
      </footer>
    </>
  )
}

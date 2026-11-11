const SITES = [
  { id: 'nortiq', name: 'Nortiq', kind: 'Software outsourcing', how: 'Swiss poster grid, type as the picture, a live rate calculator', bg: 'oklch(97.5% 0.005 90)', fg: 'oklch(19% 0.022 266)', dot: 'oklch(57% 0.215 29)' },
  { id: 'orvo', name: 'Orvo', kind: 'Smartphones', how: 'Scroll-driven scenes: a phone that turns, a 10x zoom, a sideways tour', bg: 'oklch(14% 0.048 264)', fg: 'oklch(95% 0.016 250)', dot: 'oklch(80% 0.11 230)' },
  { id: 'gravon', name: 'Gravon', kind: 'Industrial robots', how: 'A blueprint sheet with a robot arm that moves as you scroll', bg: 'oklch(35% 0.105 256)', fg: 'oklch(97% 0.012 240)', dot: 'oklch(97% 0.012 240)' },
  { id: 'hinoma', name: 'Hinoma', kind: 'Ceramics, English and Japanese', how: 'three.js pottery: a jar to glaze, a bowl thrown and fired on scroll', bg: 'oklch(94.5% 0.01 76)', fg: 'oklch(19% 0.024 52)', dot: 'oklch(41% 0.075 248)' },
  { id: 'sootfox', name: 'Sootfox', kind: 'Game studio', how: 'Die-cut stickers you can drag, a playable round, the crew as a party', bg: 'oklch(87.6% 0.179 119)', fg: 'oklch(21% 0.011 81)', dot: 'oklch(56% 0.225 2)' },
]

export default function App() {
  return (
    <>
      <header className="wrap pb-12 pt-16 md:pb-20 md:pt-28">
        <h1 className="max-w-[14ch] text-[clamp(2.6rem,7vw,6rem)] font-semibold leading-[0.98] tracking-[-0.04em]">Five companies, five interfaces</h1>
        <p className="mt-6 max-w-[46ch] text-[1.15rem] text-muted">Five landing pages for five invented companies. Each has its own type, colour, layout and way of moving. Pick one.</p>
      </header>
      <main>
        <ol>
          {SITES.map((s, i) => (
            <li key={s.id}>
              <a href={`./${s.id}/`} className="band" style={{ '--bg': s.bg, '--fg': s.fg }}>
                <div className="wrap grid items-baseline gap-x-6 gap-y-2 md:grid-cols-12">
                  <p className="text-[0.95rem] font-medium tabular-nums opacity-70 md:col-span-1">0{i + 1}</p>
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
        <p className="max-w-[70ch]">Every company, person, product and figure on these pages is fictional. The contact forms are simulations and send nothing.</p>
      </footer>
    </>
  )
}

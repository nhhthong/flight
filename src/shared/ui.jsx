import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, animate } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1]

/** Fades a block up once, the first time it enters the viewport. */
export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div', ...rest }) {
  const reduce = useReducedMotion()
  const Tag = motion[as] ?? motion.div
  if (reduce) {
    const Plain = as
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    )
  }
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Splits a headline into words that rise out of a mask. */
export function RiseText({ text, className = '', delay = 0, stagger = 0.045, once = true }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  if (reduce) return <span className={className}>{text}</span>
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once }}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/** Counts up to `to` when it scrolls into view. */
export function Counter({ to, decimals = 0, duration = 1.6, prefix = '', suffix = '', className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const fmt = (v) =>
    prefix + v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix
  const [val, setVal] = useState(fmt(reduce ? to : 0))
  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, to, { duration, ease: EASE, onUpdate: (v) => setVal(fmt(v)) })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, to])
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {val}
    </span>
  )
}

/** State for a contact form that only simulates sending. Nothing leaves the browser. */
export function useMockForm() {
  const [state, setState] = useState('idle') // idle | sending | sent
  const [ticket, setTicket] = useState('')
  const onSubmit = (e) => {
    e.preventDefault()
    if (state !== 'idle') return
    setState('sending')
    setTimeout(() => {
      setTicket(String(Math.floor(10000 + Math.random() * 89999)))
      setState('sent')
    }, 1300)
  }
  const reset = () => setState('idle')
  return { state, ticket, onSubmit, reset }
}

/** Endless horizontal strip. Pauses on hover and under reduced motion. */
export function Marquee({ children, speed = 40, reverse = false, className = '' }) {
  return (
    <div className={`mq overflow-hidden ${className}`}>
      <div
        className="mq-track flex w-max"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}

const SITES = [
  { id: 'nortiq', name: 'Nortiq', kind: 'Software outsourcing', dot: '#2a3fd0' },
  { id: 'orvo', name: 'Orvo', kind: 'Smartphones', dot: '#7cc4f2' },
  { id: 'gravon', name: 'Gravon', kind: 'Industrial robots', dot: '#eef3fb' },
  { id: 'hinoma', name: 'Hinoma', kind: 'Ceramics, EN / JP', dot: '#c9a27c' },
  { id: 'sootfox', name: 'Sootfox', kind: 'Game studio', dot: '#e0218a' },
]
export { SITES }

/** Small floating switcher that moves between the five demo sites. */
export function SiteSwitcher({ current, dark = false }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const close = (e) => {
      if (e.key === 'Escape' || (e.type === 'pointerdown' && !ref.current?.contains(e.target))) setOpen(false)
    }
    window.addEventListener('keydown', close)
    window.addEventListener('pointerdown', close)
    return () => {
      window.removeEventListener('keydown', close)
      window.removeEventListener('pointerdown', close)
    }
  }, [])
  const shell = dark
    ? 'bg-white/10 text-white border-white/15 backdrop-blur-xl'
    : 'bg-black/80 text-white border-black/10 backdrop-blur-xl'
  return (
    <div ref={ref} className="fixed bottom-4 left-4 z-[90] font-[system-ui,sans-serif] text-[13px] leading-none">
      {open && (
        <div className={`mb-2 w-60 overflow-hidden rounded-2xl border p-1.5 shadow-2xl ${shell}`}>
          <a href="../" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-white/10">
            <span className="grid h-2 w-2 place-items-center rounded-full bg-white" />
            All five sites
          </a>
          {SITES.map((s) => (
            <a
              key={s.id}
              href={`../${s.id}/`}
              aria-current={s.id === current ? 'page' : undefined}
              className={`flex items-center justify-between gap-2.5 rounded-xl px-3 py-2.5 hover:bg-white/10 ${
                s.id === current ? 'bg-white/10' : ''
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full" style={{ background: s.dot }} />
                {s.name}
              </span>
              <span className="opacity-55">{s.kind}</span>
            </a>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex h-11 items-center gap-2 rounded-full border px-4 shadow-xl transition-transform active:scale-95 ${shell}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
          <rect width="6" height="6" rx="1.5" />
          <rect x="8" width="6" height="6" rx="1.5" opacity=".6" />
          <rect y="8" width="6" height="6" rx="1.5" opacity=".6" />
          <rect x="8" y="8" width="6" height="6" rx="1.5" opacity=".35" />
        </svg>
        Switch site
      </button>
    </div>
  )
}

/** Tracks which section id is currently in view, for nav highlights. */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return active
}

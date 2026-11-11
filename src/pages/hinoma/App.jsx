import { createContext, lazy, Suspense, useContext, useEffect, useRef, useState } from 'react'
import { useScroll, useMotionValueEvent } from 'motion/react'
import { SiteSwitcher, useMockForm, Photo, PhotoCredits } from '../../shared/ui.jsx'
import PHOTOS from '../../shared/photos/hinoma.json'
import { GLAZES } from './glazes.js'

// three.js is the heaviest thing on the page: it loads as its own chunk after the text has painted.
const scenes = () => import('./scene.jsx')
const lazyScene = (name) => {
  const C = lazy(() => scenes().then((m) => ({ default: m[name] })))
  return ({ className, label, ...rest }) => (
    <Suspense fallback={<div className={className} role="img" aria-label={label} />}>
      <C className={className} label={label} {...rest} />
    </Suspense>
  )
}
const HeroScene = lazyScene('HeroScene')
const WheelScene = lazyScene('WheelScene')
const ShelfScene = lazyScene('ShelfScene')

/* -------------------------------------------------------------- language */

const Lang = createContext('en')
/** Picks the reader's language from a { en, ja } pair. */
function useT() {
  const lang = useContext(Lang)
  return (pair) => (typeof pair === 'string' ? pair : pair[lang])
}

const GLAZE_NAMES = {
  ash: { en: 'Ash glaze', ja: '灰釉' },
  tenmoku: { en: 'Tenmoku', ja: '天目釉' },
  shino: { en: 'Shino', ja: '志野釉' },
  kaki: { en: 'Persimmon', ja: '柿釉' },
  namako: { en: 'Sea-cucumber blue', ja: '海鼠釉' },
}

/* ------------------------------------------------------------------- nav */

function Seal({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true">
      <rect x="1" y="1" width="28" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 22c0-7 3-9 7-14 4 5 7 7 7 14M12 22c0-3 1.200-4.500 3-7 1.800 2.500 3 4 3 7" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function Nav({ setLang }) {
  const t = useT()
  const lang = useContext(Lang)
  const links = [
    ['#making', { en: 'Making', ja: 'つくる' }],
    ['#pieces', { en: 'Pieces', ja: '器' }],
    ['#firings', { en: 'Firings', ja: '窯焚き' }],
    ['#people', { en: 'People', ja: '人' }],
    ['#visit', { en: 'Visit', ja: '訪ねる' }],
  ]
  return (
    <header className="sticky top-0 z-50 bg-paper/92 backdrop-blur-sm">
      <div className="wrap flex h-[68px] items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-3 text-ink" aria-label={t({ en: 'Hinoma, home', ja: '火ノ間 ホーム' })}>
          <Seal />
          <span className="s whitespace-nowrap text-[1.3rem] leading-none">{t({ en: 'Hinoma', ja: '火ノ間' })}</span>
        </a>
        <nav aria-label={t({ en: 'Main', ja: 'メイン' })} className="hidden items-center gap-8 text-[15px] lg:flex">
          {links.map(([h, l]) => (
            <a key={h} href={h} className="text-ink decoration-slate underline-offset-[6px] hover:underline">
              {t(l)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div role="group" aria-label="Language" className="flex text-[14px]">
            {[['en', 'EN'], ['ja', '日本語']].map(([id, l]) => (
              <button key={id} type="button" lang={id} aria-pressed={lang === id} onClick={() => setLang(id)} className={`min-h-[40px] whitespace-nowrap px-2.5 transition-colors duration-150 ${lang === id ? 'text-ink underline decoration-slate underline-offset-[6px]' : 'text-muted hover:text-ink'}`}>
                {l}
              </button>
            ))}
          </div>
          <a href="#reserve" className="btn !min-h-[42px] whitespace-nowrap !px-4 text-[15px] max-sm:!hidden">
            {t({ en: 'Reserve a piece', ja: '器を予約する' })}
          </a>
        </div>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ hero */

function Hero() {
  const t = useT()
  const [glaze, setGlaze] = useState('ash')
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="wrap grid items-center gap-4 pb-10 pt-8 md:min-h-[calc(100svh-68px)] md:grid-cols-12 md:gap-6 md:py-0">
        <div className="md:col-span-6">
          <h1 className="h text-[clamp(2.6rem,6vw,5.4rem)]">{t({ en: 'Wood-fired tableware from Mashiko', ja: '益子の薪窯で焼く、日々の器' })}</h1>
          <p className="mt-6 max-w-[36ch] text-[1.15rem]">{t({ en: 'Five people throw every piece by hand and fire one climbing kiln four times a year.', ja: '五人の手でひとつずつ挽き、登り窯を年に四度だけ焚いています。' })}</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a href="#reserve" className="btn">
              {t({ en: 'Reserve a piece', ja: '器を予約する' })}
            </a>
            <a href="#pieces" className="lnk">
              {t({ en: 'See the five pieces', ja: '五つの器を見る' })}
            </a>
          </div>
        </div>
        <div className="relative md:col-span-6">
          <HeroScene glaze={glaze} className="mx-auto aspect-[4/5] w-full max-w-[560px] md:aspect-auto md:h-[min(78svh,720px)]" label={t({ en: 'A large storage jar turning slowly, glazed in ' + GLAZE_NAMES[glaze].en.toLowerCase(), ja: 'ゆっくり回る大壺。' + GLAZE_NAMES[glaze].ja })} />
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4 md:absolute md:inset-x-0 md:bottom-8 md:mt-0">
            <p className="pencil">
              <span className="s block text-[1.05rem] text-ink">{t({ en: 'Jar, 38 cm', ja: '大壺 高さ38cm' })}</span>
              {t(GLAZE_NAMES[glaze])}
            </p>
            <div role="radiogroup" aria-label={t({ en: 'Glaze', ja: '釉薬' })} className="flex gap-2">
              {Object.keys(GLAZES).map((k) => (
                <button key={k} type="button" role="radio" aria-checked={glaze === k} aria-label={t(GLAZE_NAMES[k])} onClick={() => setGlaze(k)} className={`h-11 w-11 rounded-full p-[5px] transition-shadow duration-150 ${glaze === k ? 'shadow-[inset_0_0_0_1px_var(--color-ink)]' : 'hover:shadow-[inset_0_0_0_1px_var(--color-rule)]'}`}>
                  <span className="block h-full w-full rounded-full" style={{ background: `radial-gradient(circle at 32% 28%, ${GLAZES[k].pool}, ${GLAZES[k].base} 45%, ${GLAZES[k].deep})` }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- statement */

function Statement() {
  const t = useT()
  return (
    <section className="wrap py-24 md:py-40">
      <div className="grid gap-10 md:grid-cols-12 md:gap-6">
        <p className="h text-[clamp(1.9rem,4vw,3.5rem)] md:col-span-10">{t({ en: 'A kiln this size holds 1,400 pieces. We lose about one in nine to the fire, and sell the rest.', ja: 'この窯には一度に千四百の器が入ります。九つにひとつは炎に取られ、残りをお届けしています。' })}</p>
        <p className="pencil md:col-span-3 md:col-start-1">{t({ en: 'Hinoma, founded 1987', ja: '火ノ間 一九八七年開窯' })}</p>
        <p className="dropcap max-w-[52ch] md:col-span-6 md:col-start-6">
          {t({
            en: 'Hinoma means the room of the fire. Sōichi Tsuchiya built the kiln into a hillside in Mashiko with brick from a demolished bathhouse. It has five chambers, burns red pine, and takes 72 hours to reach 1,280 °C. Nobody sleeps much that week.',
            ja: '火ノ間は、火の居る部屋という意味です。土屋惣一が取り壊された銭湯の煉瓦を譲り受け、益子の斜面に築きました。窯は五つの房からなり、赤松を焚いて七十二時間かけて千二百八十度まで上げます。その週は、誰もあまり眠りません。',
          })}
        </p>
      </div>
    </section>
  )
}

/* ---------------------------------------------- pinned scene: the making */

const STEPS = [
  { n: { en: 'Wedge', ja: '土練り' }, temp: 18, d: { en: 'Two kilos of local clay, kneaded a hundred times to drive the air out.', ja: '益子の土を二キロ。空気を抜くために百回練ります。' }, time: { en: '15 minutes', ja: '十五分' } },
  { n: { en: 'Throw', ja: '轆轤挽き' }, temp: 18, d: { en: 'The wall is pulled up in three passes on a kick wheel, then opened into a bowl.', ja: '蹴ろくろで三度に分けて壁を挽き上げ、碗のかたちに開きます。' }, time: { en: '6 minutes', ja: '六分' } },
  { n: { en: 'Dry and bisque', ja: '乾燥・素焼き' }, temp: 800, d: { en: 'Ten days on the shelf, then a first firing that leaves the clay pale and thirsty.', ja: '棚で十日乾かしたのち素焼きに。土は白く、水をよく吸うようになります。' }, time: { en: '10 days', ja: '十日' } },
  { n: { en: 'Glaze', ja: '施釉' }, temp: 18, d: { en: 'Dipped once in a glaze of pine ash, feldspar and rice straw. The foot is wiped bare.', ja: '松灰と長石、藁灰の釉にひと息で浸します。高台は拭って土を見せます。' }, time: { en: '4 seconds', ja: '四秒' } },
  { n: { en: 'Fire', ja: '本焼き' }, temp: 1280, d: { en: 'Three days of red pine. The ash that lands on the shoulder melts into the glaze.', ja: '赤松を三日焚き続けます。肩に降りた灰が溶けて、釉と混ざり合います。' }, time: { en: '72 hours', ja: '七十二時間' } },
]

function Making() {
  const t = useT()
  const ref = useRef(null)
  const progress = useRef(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [step, setStep] = useState(0)
  const [temp, setTemp] = useState(18)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    progress.current = v
    const f = Math.min(4.999, v * 5)
    const i = Math.floor(f)
    setStep(i)
    // the reading climbs and falls inside the two firing steps
    const k = Math.sin(Math.PI * Math.max(0, Math.min(1, (f - i) / 0.92)))
    setTemp(Math.round(18 + (STEPS[i].temp - 18) * k))
  })
  const s = STEPS[step]
  return (
    <section id="making" ref={ref} className="relative h-[500vh] bg-paper-2">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="wrap grid h-full grid-rows-[minmax(0,1fr)_auto] gap-2 pb-8 pt-20 md:grid-cols-12 md:grid-rows-1 md:items-center md:gap-6 md:pt-16">
          <WheelScene progress={progress} className="min-h-0 md:order-2 md:col-span-7 md:h-[min(80svh,700px)]" label={t({ en: 'A bowl on the wheel at the step called ' + s.n.en.toLowerCase(), ja: 'ろくろの上の碗。工程は' + s.n.ja })} />
          <div className="md:order-1 md:col-span-5">
            <h2 className="pencil">{t({ en: 'One bowl, five steps. Scroll to follow it.', ja: 'ひとつの碗、五つの工程。スクロールで進みます。' })}</h2>
            <p className="h mt-3 text-[clamp(2.2rem,5vw,4.4rem)]" aria-live="polite">
              <span className="mr-[0.3em] text-muted">{step + 1}</span>
              {t(s.n)}
            </p>
            <p className="mt-4 min-h-[5em] max-w-[34ch]">{t(s.d)}</p>
            <dl className="ruled mt-4 max-w-[26rem]">
              <div className="flex items-baseline justify-between py-3">
                <dt className="label">{t({ en: 'Kiln temperature', ja: '窯の温度' })}</dt>
                <dd className="s text-[1.5rem] tabular-nums">{temp.toLocaleString('en-US')} °C</dd>
              </div>
              <div className="flex items-baseline justify-between py-3">
                <dt className="label">{t({ en: 'Time at this step', ja: 'この工程にかかる時間' })}</dt>
                <dd className="s text-[1.15rem]">{t(s.time)}</dd>
              </div>
            </dl>
            <ol className="mt-6 flex gap-1.5" aria-hidden="true">
              {STEPS.map((x, i) => (
                <li key={x.n.en} className={`h-px flex-1 transition-colors duration-300 ${i <= step ? 'bg-ink' : 'bg-rule'}`} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- pieces */

const PIECES = {
  yunomi: { n: { en: 'Tea cup', ja: '湯呑' }, size: { en: '8 cm tall, 180 ml', ja: '高さ8cm 180ml' }, glaze: 'kaki', price: 4400, made: 320, d: { en: 'Thick enough to hold with tea just off the boil.', ja: '沸かしたてのお茶を注いでも、手に持てる厚みです。' } },
  chawan: { n: { en: 'Rice bowl', ja: '飯碗' }, size: { en: '12 cm across', ja: '径12cm' }, glaze: 'shino', price: 5500, made: 410, d: { en: 'The foot is cut high so the bowl sits light in one hand.', ja: '高台を高く削り、片手に軽くおさまるようにしています。' } },
  tsubo: { n: { en: 'Storage jar', ja: '大壺' }, size: { en: '38 cm tall', ja: '高さ38cm' }, glaze: 'namako', price: 66000, made: 40, d: { en: 'Thrown in two sections and joined at the shoulder.', ja: '上下ふたつに分けて挽き、肩で継いでいます。' } },
  tokkuri: { n: { en: 'Sake flask', ja: '徳利' }, size: { en: '14 cm tall, 360 ml', ja: '高さ14cm 二合' }, glaze: 'tenmoku', price: 8800, made: 150, d: { en: 'The neck is narrow enough to pour with a sound.', ja: 'とくとくと音がするよう、首を細く絞っています。' } },
  plate: { n: { en: 'Dinner plate', ja: '八寸皿' }, size: { en: '24 cm across', ja: '径24cm' }, glaze: 'ash', price: 7700, made: 280, d: { en: 'Fired on shells, which leave three small marks in the well.', ja: '貝殻にのせて焼くため、見込みに三つの目跡が残ります。' } },
}
const ORDER = ['yunomi', 'chawan', 'tsubo', 'tokkuri', 'plate']
const yen = (n) => '¥' + n.toLocaleString('en-US')

function Pieces() {
  const t = useT()
  const [sel, setSel] = useState('chawan')
  const p = PIECES[sel]
  return (
    <section id="pieces" className="py-24 md:py-40">
      <div className="wrap grid gap-6 md:grid-cols-12">
        <h2 className="h text-[clamp(2.2rem,4.6vw,4rem)] md:col-span-6">{t({ en: 'Five pieces from the autumn firing', ja: '秋の窯から、五つの器' })}</h2>
        <p className="max-w-[38ch] md:col-span-4 md:col-start-8 md:self-end">{t({ en: 'Pick a piece from the shelf to read its size, its glaze and how many came out of the kiln.', ja: '棚の器を選ぶと、寸法と釉、窯から出た数をご覧いただけます。' })}</p>
      </div>
      <ShelfScene active={sel} onPick={setSel} className="mx-auto mt-6 h-[clamp(230px,36vw,460px)] w-full max-w-[1500px]" label={t({ en: 'Five pieces on a shelf: a tea cup, a rice bowl, a storage jar, a sake flask and a plate', ja: '棚に並ぶ五つの器。湯呑、飯碗、大壺、徳利、八寸皿' })} />
      <div className="wrap">
        <div role="tablist" aria-label={t({ en: 'Pieces', ja: '器' })} className="ruled grid grid-cols-5 border-b border-rule">
          {ORDER.map((id) => (
            <button key={id} type="button" role="tab" aria-selected={sel === id} onClick={() => setSel(id)} className={`!border-t-0 px-1 py-4 text-center text-[clamp(0.8rem,1.5vw,1.05rem)] transition-colors duration-150 ${sel === id ? 'text-ink shadow-[inset_0_-2px_0_var(--color-slate)]' : 'text-muted hover:text-ink'}`}>
              {t(PIECES[id].n)}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="mt-10 grid gap-8 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <h3 className="h text-[clamp(2.4rem,5vw,4.4rem)]">{t(p.n)}</h3>
            <p className="mt-3 max-w-[34ch]">{t(p.d)}</p>
          </div>
          <dl className="ruled md:col-span-4 md:col-start-7">
            {[
              [{ en: 'Size', ja: '寸法' }, t(p.size)],
              [{ en: 'Glaze', ja: '釉' }, t(GLAZE_NAMES[p.glaze])],
              [{ en: 'Out of the kiln', ja: '窯出しの数' }, t({ en: `${p.made} pieces`, ja: `${p.made}点` })],
            ].map(([k, v]) => (
              <div key={k.en} className="flex justify-between gap-6 py-3">
                <dt className="label">{t(k)}</dt>
                <dd className="text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="md:col-span-2 md:text-right">
            <p className="h text-[clamp(2rem,3.4vw,3rem)]">{yen(p.price)}</p>
            <p className="pencil">{t({ en: 'tax included', ja: '税込' })}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- firings */

const FIRINGS = [
  { s: { en: 'Winter', ja: '冬の窯' }, lit: { en: 'Lit 6 February', ja: '二月六日 火入れ' }, out: { en: 'Opened 15 February', ja: '二月十五日 窯出し' }, state: { en: 'Sold out', ja: '完売' }, open: false },
  { s: { en: 'Spring', ja: '春の窯' }, lit: { en: 'Lit 8 May', ja: '五月八日 火入れ' }, out: { en: 'Opened 17 May', ja: '五月十七日 窯出し' }, state: { en: 'Sold out', ja: '完売' }, open: false },
  { s: { en: 'Autumn', ja: '秋の窯' }, lit: { en: 'Lit 16 October', ja: '十月十六日 火入れ' }, out: { en: 'Opened 25 October', ja: '十月二十五日 窯出し' }, state: { en: '212 pieces left', ja: '残り212点' }, open: true },
  { s: { en: 'Year-end', ja: '歳末の窯' }, lit: { en: 'Lights 4 December', ja: '十二月四日 火入れ' }, out: { en: 'Opens 13 December', ja: '十二月十三日 窯出し' }, state: { en: 'Taking reservations', ja: '予約受付中' }, open: true },
]

function Firings() {
  const t = useT()
  return (
    <section id="firings" className="bg-paper-2">
      <div className="wrap py-24 md:py-36">
        <div className="grid gap-6 md:grid-cols-12">
          <h2 className="h text-[clamp(2.2rem,4.6vw,4rem)] md:col-span-6">{t({ en: 'Four firings in 2026', ja: '二〇二六年、四度の窯焚き' })}</h2>
          <p className="max-w-[38ch] md:col-span-4 md:col-start-8 md:self-end">{t({ en: 'Pieces are sold by firing. When a firing is gone, the next one is nine weeks away.', ja: '器は窯ごとにお分けしています。ひと窯が終わると、次は九週間後です。' })}</p>
        </div>
        <div className="ruled mt-14 border-b border-rule">
          {FIRINGS.map((f) => (
            <div key={f.s.en} className={`grid gap-x-6 gap-y-1 py-6 md:grid-cols-12 md:items-baseline ${f.open ? '' : 'text-muted'}`}>
              <h3 className={`s text-[1.7rem] md:col-span-3 ${f.open ? '' : '!text-muted'}`}>{t(f.s)}</h3>
              <p className="md:col-span-3">{t(f.lit)}</p>
              <p className="md:col-span-3">{t(f.out)}</p>
              <p className="md:col-span-3 md:text-right">
                {f.open ? (
                  <a href="#reserve" className="lnk">
                    {t(f.state)}
                  </a>
                ) : (
                  t(f.state)
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- people */

const PEOPLE = [
  { n: { en: 'Sōichi Tsuchiya', ja: '土屋 惣一' }, r: { en: 'Founder, reads the fire', ja: '窯元・火の番' }, y: { en: 'since 1987', ja: '一九八七年より' }, d: { en: 'Judges the kiln by the colour of the flame at the spy hole and has never owned a pyrometer he trusts.', ja: '色見穴の炎の色で窯を読みます。信用できる温度計には、まだ出会っていないそうです。' } },
  { n: { en: 'Haruka Tsuchiya', ja: '土屋 遥' }, r: { en: 'Thrower', ja: 'ろくろ' }, y: { en: 'since 2009', ja: '二〇〇九年より' }, d: { en: 'Throws 120 rice bowls in a day, each within 2 mm of the last, and weighs none of them.', ja: '一日に飯碗を百二十。どれも誤差二ミリのうちにおさめますが、秤は使いません。' } },
  { n: { en: 'Ren Kasamatsu', ja: '笠松 蓮' }, r: { en: 'Glazes', ja: '釉掛け' }, y: { en: 'since 2015', ja: '二〇一五年より' }, d: { en: 'Burns the straw for the ash glaze himself, in a field behind the workshop, every November.', ja: '藁灰は毎年十一月、工房の裏の田で自分の手で焼いています。' } },
  { n: { en: 'Mio Hanyu', ja: '羽生 澪' }, r: { en: 'Stokes the night shift', ja: '夜の薪くべ' }, y: { en: 'since 2019', ja: '二〇一九年より' }, d: { en: 'Feeds the kiln a bundle of pine every four minutes from midnight to six, and keeps count in pencil on the wall.', ja: '夜十二時から朝六時まで、四分ごとに松をひと束。数は壁に鉛筆で書きつけています。' } },
  { n: { en: 'Tomás Idehara', ja: '出原 トマス' }, r: { en: 'Packs and ships', ja: '梱包・発送' }, y: { en: 'since 2022', ja: '二〇二二年より' }, d: { en: 'Has sent 9,300 parcels to 31 countries. Four arrived broken, and he remembers each address.', ja: '三十一か国へ九千三百個を送りました。割れて届いたのは四つ。その宛先はいまも覚えています。' } },
]

function People() {
  const t = useT()
  return (
    <section id="people" className="wrap py-24 md:py-40">
      <div className="grid gap-6 md:grid-cols-12">
        <h2 className="h text-[clamp(2.2rem,4.6vw,4rem)] md:col-span-6">{t({ en: 'The five people at the kiln', ja: '窯を守る五人' })}</h2>
        <p className="max-w-[38ch] md:col-span-4 md:col-start-8 md:self-end">{t({ en: 'Each piece passes through all five pairs of hands, in this order.', ja: 'どの器も、この順に五人の手を渡っていきます。' })}</p>
      </div>
      <ol className="ruled mt-14 border-b border-rule">
        {PEOPLE.map((p, i) => (
          <li key={p.n.en} className="group grid gap-x-6 gap-y-2 py-8 transition-colors duration-200 hover:bg-paper-2 md:grid-cols-12 md:items-baseline md:py-10">
            <p className="h text-[clamp(2.4rem,4.4vw,3.8rem)] text-muted md:col-span-1">{i + 1}</p>
            <div className="md:col-span-4">
              <h3 className="s text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight">{t(p.n)}</h3>
              <p className="label mt-1">
                {t(p.r)}
                <span className="pencil block">{t(p.y)}</span>
              </p>
            </div>
            <p className="max-w-[46ch] md:col-span-6 md:col-start-7">{t(p.d)}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ----------------------------------------------------------------- visit */

function Visit() {
  const t = useT()
  return (
    <section id="visit" className="bg-paper-2">
      <div className="wrap grid gap-12 py-24 md:grid-cols-12 md:gap-6 md:py-36">
        <div className="md:col-span-5">
          <h2 className="h text-[clamp(2.2rem,4.6vw,4rem)]">{t({ en: 'The workshop in Mashiko', ja: '益子の工房' })}</h2>
          <p className="mt-6 max-w-[36ch]">{t({ en: 'The shop room is open three days a week. On Saturdays you can sit at a wheel for two hours and take home what survives the fire.', ja: '売り場は週に三日開けています。土曜はろくろに二時間。焼き上がった器はお持ち帰りいただけます。' })}</p>
        </div>
        <dl className="ruled md:col-span-6 md:col-start-7">
          {[
            [{ en: 'Address', ja: '所在地' }, { en: 'Jōnaizaka, Mashiko, Tochigi', ja: '栃木県益子町 城内坂' }],
            [{ en: 'Shop room', ja: '売り場' }, { en: 'Thursday to Saturday, 10:00 to 17:00', ja: '木曜から土曜 10時〜17時' }],
            [{ en: 'Wheel class', ja: 'ろくろ体験' }, { en: 'Saturdays at 13:00, six seats, ¥6,600', ja: '土曜13時 定員六名 ¥6,600' }],
            [{ en: 'From Tokyo', ja: '東京から' }, { en: '2 hours 20 minutes by train and bus', ja: '電車とバスで二時間二十分' }],
            [{ en: 'Kiln opening', ja: '窯出し' }, { en: 'Open to visitors on 13 December from 9:00', ja: '十二月十三日 朝九時より公開' }],
          ].map(([k, v]) => (
            <div key={k.en} className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-6 py-4">
              <dt className="label">{t(k)}</dt>
              <dd className="text-ink">{t(v)}</dd>
            </div>
          ))}
        </dl>
        <div className="grid gap-4 sm:grid-cols-2 md:col-span-12 md:gap-6">
          <Photo manifest={PHOTOS} name="wheel" alt={t({ en: 'Hands closing a cone of clay on a spinning wheel', ja: '回るろくろの上で土をしぼる手' })} sizes="(min-width: 640px) 46vw, 92vw" className="aspect-[3/2]" />
          <Photo manifest={PHOTOS} name="drying" alt={t({ en: 'Rows of unfired pots drying in the sun on wooden racks', ja: '板の上で天日に干される素地の器' })} sizes="(min-width: 640px) 46vw, 92vw" className="aspect-[3/2]" />
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- reserve */

function Reserve() {
  const t = useT()
  const f = useMockForm()
  const [firing, setFiring] = useState(1)
  const opts = [
    { en: 'Autumn, in stock', ja: '秋の窯・在庫あり' },
    { en: 'Year-end, 13 December', ja: '歳末の窯・十二月十三日' },
  ]
  return (
    <section id="reserve" className="wrap py-24 md:py-40">
      <div className="grid gap-12 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5">
          <h2 className="h text-[clamp(2.4rem,5.2vw,4.6rem)]">{t({ en: 'Reserve a piece', ja: '器を予約する' })}</h2>
          <p className="mt-6 max-w-[36ch]">{t({ en: 'Write down what you would like and from which firing. Haruka answers each card by hand within three days.', ja: 'ご希望の器と窯をお書きください。三日のうちに、遥がひとつずつお返事します。' })}</p>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <div className="stock p-8 md:p-12">
            {f.state === 'sent' ? (
              <div role="status" className="relative">
                <p className="pencil">{t({ en: 'Card no.', ja: '控え番号' })} {f.ticket}</p>
                <p className="h mt-3 text-[clamp(1.8rem,3vw,2.6rem)]">{t({ en: 'Your card is on the workbench', ja: 'カードを作業台に置きました' })}</p>
                <p className="mt-4 max-w-[40ch]">{t({ en: 'This form is a simulation. Nothing left your browser and no piece has been set aside.', ja: 'このフォームは見本です。入力内容はどこにも送信されず、器の取り置きも行われません。' })}</p>
                <button type="button" onClick={f.reset} className="btn mt-8">
                  {t({ en: 'Write another card', ja: 'もう一枚書く' })}
                </button>
              </div>
            ) : (
              <form onSubmit={f.onSubmit} className="relative grid gap-7 sm:grid-cols-2">
                <p className="s text-[1.5rem] sm:col-span-2">{t({ en: 'Hinoma', ja: '火ノ間' })}</p>
                <label className="label">
                  {t({ en: 'Your name', ja: 'お名前' })}
                  <input required name="name" autoComplete="name" className="line-field" placeholder={t({ en: 'Mira Aldana', ja: '山田 花子' })} />
                </label>
                <label className="label">
                  {t({ en: 'Email', ja: 'メールアドレス' })}
                  <input required type="email" name="email" autoComplete="email" className="line-field" placeholder="you@mail.com" />
                </label>
                <fieldset className="sm:col-span-2">
                  <legend className="label">{t({ en: 'Firing', ja: '窯' })}</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {opts.map((o, i) => (
                      <button key={o.en} type="button" aria-pressed={firing === i} onClick={() => setFiring(i)} className={`min-h-[44px] rounded-[3px] px-4 text-[0.95rem] text-ink transition-shadow duration-150 ${firing === i ? 'shadow-[inset_0_0_0_1px_var(--color-ink),inset_1px_2px_3px_oklch(30%_0.03_55/0.18)]' : 'shadow-[inset_0_0_0_1px_var(--color-card-edge)] hover:shadow-[inset_0_0_0_1px_var(--color-muted)]'}`}>
                        {t(o)}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label className="label sm:col-span-2">
                  {t({ en: 'Pieces and how many', ja: 'ご希望の器と数' })}
                  <input required name="what" className="line-field" placeholder={t({ en: 'Two rice bowls and one sake flask', ja: '飯碗をふたつ、徳利をひとつ' })} />
                </label>
                <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
                  <p className="pencil">{t({ en: 'A simulated form. No data is sent.', ja: '見本のフォームです。送信はされません。' })}</p>
                  <button type="submit" disabled={f.state === 'sending'} className="btn disabled:opacity-60">
                    {f.state === 'sending' ? t({ en: 'Sending the card', ja: '送っています' }) : t({ en: 'Send the card', ja: 'カードを送る' })}
                  </button>
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
  const t = useT()
  return (
    <footer className="wrap pb-28 pt-10">
      <div className="ruled">
        <div className="flex flex-wrap items-start justify-between gap-10 pt-10">
          <div className="text-ink">
            <div className="flex items-center gap-3">
              <Seal size={34} />
              <span className="s text-[1.5rem] leading-none">{t({ en: 'Hinoma', ja: '火ノ間' })}</span>
            </div>
            <p className="mt-4 max-w-[30ch] text-ink-2">{t({ en: 'Wood-fired tableware, made in Mashiko since 1987.', ja: '一九八七年より、益子で薪窯の器をつくっています。' })}</p>
          </div>
          <ul className="grid grid-cols-2 gap-x-12 gap-y-2">
            {[
              ['#making', { en: 'Making', ja: 'つくる' }],
              ['#pieces', { en: 'Pieces', ja: '器' }],
              ['#firings', { en: 'Firings', ja: '窯焚き' }],
              ['#people', { en: 'People', ja: '人' }],
              ['#visit', { en: 'Visit', ja: '訪ねる' }],
              ['#reserve', { en: 'Reserve a piece', ja: '器を予約する' }],
            ].map(([h, l]) => (
              <li key={h}>
                <a href={h} className="lnk">
                  {t(l)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="label mt-14 max-w-[70ch]">{t({ en: '© 2026 Hinoma. The pottery, its people and every figure on this page are fictional and exist to demonstrate a design.', ja: '© 2026 火ノ間。この窯元、人物、数字はすべて架空のもので、デザインの見本として制作しています。' })}</p>
      <PhotoCredits manifest={PHOTOS} className="label mt-4 max-w-[70ch]" />
    </footer>
  )
}

export default function App() {
  const [lang, setLang] = useState('en')
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = lang === 'ja' ? '火ノ間｜益子の薪窯で焼く器' : 'Hinoma: wood-fired tableware from Mashiko'
  }, [lang])
  return (
    <Lang.Provider value={lang}>
      <Nav setLang={setLang} />
      <main>
        <Hero />
        <Statement />
        <Making />
        <Pieces />
        <Firings />
        <People />
        <Visit />
        <Reserve />
      </main>
      <Footer />
      <SiteSwitcher current="hinoma" />
    </Lang.Provider>
  )
}

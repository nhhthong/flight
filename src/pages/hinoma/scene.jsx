import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ------------------------------------------------------------- profiles */
// Each piece is a half-section [radius, height] turned around the vertical axis.

export const PROFILES = {
  tsubo: [[0, 0], [0.4, 0], [0.5, 0.04], [0.74, 0.45], [0.92, 0.95], [0.9, 1.35], [0.7, 1.75], [0.42, 1.98], [0.34, 2.1], [0.4, 2.22], [0.45, 2.27], [0.4, 2.26], [0.31, 2.1], [0.36, 1.96]],
  yunomi: [[0, 0], [0.29, 0], [0.34, 0.04], [0.4, 0.4], [0.43, 0.8], [0.44, 0.96], [0.41, 0.97], [0.39, 0.8], [0.35, 0.3], [0.2, 0.13], [0, 0.11]],
  chawan: [[0, 0], [0.26, 0], [0.28, 0.08], [0.31, 0.1], [0.56, 0.3], [0.7, 0.55], [0.74, 0.76], [0.71, 0.77], [0.66, 0.56], [0.5, 0.32], [0.25, 0.19], [0, 0.17]],
  tokkuri: [[0, 0], [0.3, 0], [0.37, 0.05], [0.5, 0.4], [0.5, 0.7], [0.36, 1.0], [0.16, 1.2], [0.13, 1.4], [0.2, 1.52], [0.17, 1.54], [0.1, 1.4], [0.1, 1.2]],
  plate: [[0, 0], [0.5, 0], [0.52, 0.05], [0.9, 0.12], [1.0, 0.2], [0.98, 0.225], [0.85, 0.15], [0.5, 0.09], [0, 0.08]],
  // stages of one bowl on the wheel
  lump: [[0, 0], [0.5, 0], [0.62, 0.1], [0.66, 0.3], [0.6, 0.5], [0.42, 0.62], [0.3, 0.66], [0.2, 0.68], [0.12, 0.69], [0.06, 0.7], [0.02, 0.7], [0, 0.7]],
  cylinder: [[0, 0], [0.44, 0], [0.5, 0.05], [0.5, 0.36], [0.49, 0.62], [0.47, 0.74], [0.41, 0.75], [0.39, 0.62], [0.38, 0.36], [0.34, 0.2], [0.2, 0.13], [0, 0.11]],
}

const N = 56
function sample(profile) {
  const curve = new THREE.SplineCurve(profile.map(([x, y]) => new THREE.Vector2(x, y)))
  curve.curveType = 'catmullrom'
  curve.tension = 0.35
  return curve.getPoints(N).map((p) => new THREE.Vector2(Math.max(0.0001, p.x), p.y))
}
const SAMPLED = Object.fromEntries(Object.entries(PROFILES).map(([k, v]) => [k, sample(v)]))

/* --------------------------------------------------------------- glazes */

function rng(seed) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}

export const GLAZES = {
  ash: { base: '#8f9a7c', deep: '#5f6d54', pool: '#a9b393', fleck: '#3f3a2c', gloss: 0.32 },
  tenmoku: { base: '#2a1a12', deep: '#120b08', pool: '#6b3a1c', fleck: '#a8672e', gloss: 0.18 },
  shino: { base: '#e9e0d0', deep: '#d6c9b4', pool: '#f3ede2', fleck: '#c2643a', gloss: 0.45 },
  kaki: { base: '#a8492a', deep: '#7c2f1a', pool: '#c9703d', fleck: '#2b140c', gloss: 0.28 },
  namako: { base: '#2c4460', deep: '#1a2a40', pool: '#6f8fae', fleck: '#d9e2ea', gloss: 0.22 },
}
const CLAY = '#9a6f52'

function makeTextures(key) {
  const g = GLAZES[key]
  const r = rng(key.length * 7919 + key.charCodeAt(0))
  const W = 512
  const c = document.createElement('canvas')
  c.width = c.height = W
  const x = c.getContext('2d')
  // v runs from the foot (bottom of the canvas) to the lip
  const grad = x.createLinearGradient(0, W, 0, 0)
  grad.addColorStop(0, g.deep)
  grad.addColorStop(0.35, g.base)
  grad.addColorStop(0.8, g.base)
  grad.addColorStop(1, g.pool)
  x.fillStyle = grad
  x.fillRect(0, 0, W, W)
  // runs of glaze
  for (let i = 0; i < 90; i++) {
    const px = r() * W
    const len = 60 + r() * 260
    const top = r() * W * 0.7
    const lg = x.createLinearGradient(0, top, 0, top + len)
    lg.addColorStop(0, 'rgba(0,0,0,0)')
    lg.addColorStop(0.6, i % 3 ? g.pool : g.deep)
    lg.addColorStop(1, 'rgba(0,0,0,0)')
    x.globalAlpha = 0.1 + r() * 0.16
    x.fillStyle = lg
    x.fillRect(px, top, 3 + r() * 14, len)
  }
  // iron flecks
  x.globalAlpha = 1
  for (let i = 0; i < 900; i++) {
    x.globalAlpha = 0.15 + r() * 0.5
    x.fillStyle = g.fleck
    x.beginPath()
    x.arc(r() * W, r() * W, 0.3 + r() * 1.3, 0, 7)
    x.fill()
  }
  // bare clay at the foot, with an uneven glaze line
  x.globalAlpha = 1
  x.fillStyle = CLAY
  x.beginPath()
  x.moveTo(0, W)
  for (let i = 0; i <= 32; i++) x.lineTo((i / 32) * W, W - 50 - Math.sin(i * 1.7) * 5 - r() * 9)
  x.lineTo(W, W)
  x.fill()
  const map = new THREE.CanvasTexture(c)
  map.colorSpace = THREE.SRGBColorSpace
  map.wrapS = THREE.RepeatWrapping
  map.anisotropy = 4

  // throwing rings and grit for the bump
  const b = document.createElement('canvas')
  b.width = b.height = W
  const y = b.getContext('2d')
  y.fillStyle = '#808080'
  y.fillRect(0, 0, W, W)
  for (let i = 0; i < 70; i++) {
    y.globalAlpha = 0.05 + r() * 0.12
    y.fillStyle = r() > 0.5 ? '#fff' : '#000'
    y.fillRect(0, r() * W, W, 1 + r() * 5)
  }
  for (let i = 0; i < 2600; i++) {
    y.globalAlpha = 0.08 + r() * 0.2
    y.fillStyle = r() > 0.5 ? '#fff' : '#000'
    y.fillRect(r() * W, r() * W, 1 + r() * 2, 1 + r() * 2)
  }
  const bump = new THREE.CanvasTexture(b)
  bump.wrapS = THREE.RepeatWrapping
  return { map, bump, gloss: g.gloss }
}

const texCache = {}
const tex = (k) => (texCache[k] ??= makeTextures(k))

/* ---------------------------------------------------------------- parts */

export function Pot({ shape, glaze, ...props }) {
  const geo = useMemo(() => {
    const g = new THREE.LatheGeometry(SAMPLED[shape], 96)
    g.computeVertexNormals()
    return g
  }, [shape])
  const t = tex(glaze)
  return (
    <mesh geometry={geo} castShadow receiveShadow {...props}>
      <meshPhysicalMaterial map={t.map} bumpMap={t.bump} bumpScale={1.2} roughness={t.gloss} clearcoat={0.5} clearcoatRoughness={0.35} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Lights({ warm = 0 }) {
  return (
    <>
      <hemisphereLight args={['#fff6e8', '#b9a68f', 1.15]} />
      <directionalLight position={[-1.2, 8, 3.2]} intensity={2.6} color="#fff1dc" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} shadow-radius={6}>
        <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 0.1, 20]} />
      </directionalLight>
      <directionalLight position={[5, 2.5, -3]} intensity={0.9} color="#cfdcf0" />
      <pointLight position={[0, 1.2, 1.5]} intensity={warm * 28} color="#ff7a2a" distance={6} />
    </>
  )
}

function Ground({ y = 0 }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={y} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <shadowMaterial opacity={0.16} />
    </mesh>
  )
}

/** A soft contact shadow: a disc with a radial falloff, lying on the floor. */
function Blob({ y = 0, size = 3.4 }) {
  const map = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const x = c.getContext('2d')
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0, 'rgba(46,32,22,0.42)')
    g.addColorStop(0.45, 'rgba(46,32,22,0.16)')
    g.addColorStop(1, 'rgba(46,32,22,0)')
    x.fillStyle = g
    x.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(c)
  }, [])
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0.25, y, -0.1]} scale={[size * 1.25, size, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={map} transparent depthWrite={false} />
    </mesh>
  )
}

/** Keeps a canvas rendering only while it is on screen. */
function Stage({ children, camera, className = '', label }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '120px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} role="img" aria-label={label}>
      <Canvas shadows dpr={[1, 1.75]} camera={camera} frameloop={on ? 'always' : 'never'} gl={{ antialias: true, alpha: true }}>
        {children}
      </Canvas>
    </div>
  )
}

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------- hero: one jar */

function HeroJar({ glaze }) {
  const g = useRef()
  const { pointer } = useThree()
  const still = reduced()
  useFrame((_, dt) => {
    if (!g.current) return
    if (!still) g.current.rotation.y += dt * 0.22
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, pointer.y * -0.12, 3, dt)
    g.current.position.x = THREE.MathUtils.damp(g.current.position.x, pointer.x * 0.12, 3, dt)
  })
  return (
    <group ref={g} position={[0, -1.14, 0]}>
      <Pot shape="tsubo" glaze={glaze} />
    </group>
  )
}

export function HeroScene({ glaze, label, className }) {
  return (
    <Stage className={className} label={label} camera={{ position: [0, 1.25, 5.6], fov: 30 }}>
      <Lights />
      <CameraAim y={0} />
      <HeroJar glaze={glaze} />
      <Ground y={-1.14} />
    </Stage>
  )
}

/* ------------------------------------------- process: a bowl on the wheel */

const STAGES = ['lump', 'cylinder', 'chawan', 'chawan', 'chawan', 'chawan']
const clayCols = ['#6b5546', '#6b5546', '#74604f', '#c9a48a', '#c9a48a', '#c9a48a'].map((c) => new THREE.Color(c))
const tmpCol = new THREE.Color()
const ss = (k) => {
  const t = Math.max(0, Math.min(1, k))
  return t * t * (3 - 2 * t)
}

function Bowl({ progress }) {
  const group = useRef()
  const wheel = useRef()
  const clay = useRef()
  const glazed = useRef()
  const heat = useRef()
  const geo = useMemo(() => new THREE.LatheGeometry(SAMPLED.lump, 80), [])
  const pts = useMemo(() => SAMPLED.lump.map((p) => p.clone()), [])
  const last = useRef(-1)
  const t = tex('ash')
  useFrame((_, dt) => {
    const p = progress.current
    // five steps across the scroll; each morph or colour change sits between two holds
    const f = p * 5
    const i = Math.min(4, Math.floor(f))
    const k = ss((f - i - 0.25) / 0.5)
    if (Math.abs(p - last.current) > 0.0005) {
      last.current = p
      const A = SAMPLED[STAGES[i]]
      const B = SAMPLED[STAGES[i + 1]]
      for (let n = 0; n < pts.length; n++) pts[n].set(A[n].x + (B[n].x - A[n].x) * k, A[n].y + (B[n].y - A[n].y) * k)
      const fresh = new THREE.LatheGeometry(pts, 80)
      geo.attributes.position.copy(fresh.attributes.position)
      geo.attributes.position.needsUpdate = true
      geo.computeVertexNormals()
      fresh.dispose()
      tmpCol.copy(clayCols[i]).lerp(clayCols[i + 1], k)
      clay.current.color.copy(tmpCol)
      clay.current.roughness = i < 2 ? 0.45 : 0.9
      // glaze goes on during step 4, the fire is step 5
      const g = i < 3 ? 0 : i === 3 ? k : 1
      glazed.current.opacity = g
      glazed.current.visible = g > 0.01
      const fire = i === 4 ? Math.sin(Math.PI * ss((f - 4) / 0.92)) : 0
      glazed.current.emissiveIntensity = fire * 2.2
      glazed.current.roughness = i === 4 && f - 4 > 0.5 ? t.gloss : 0.85
      heat.current.intensity = fire * 40
    }
    // the wheel spins fast while throwing, then idles
    const speed = reduced() ? 0 : p < 0.42 ? 7 : 0.35
    group.current.rotation.y += dt * speed
    wheel.current.rotation.y += dt * speed
  })
  return (
    <group position={[0, -0.55, 0]}>
      <mesh ref={wheel} position-y={-0.06} receiveShadow castShadow>
        <cylinderGeometry args={[1.25, 1.25, 0.12, 64]} />
        <meshStandardMaterial color="#8d8478" roughness={0.6} metalness={0.25} />
      </mesh>
      <group ref={group}>
        <mesh geometry={geo} castShadow receiveShadow>
          <meshStandardMaterial ref={clay} color="#6b5546" roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={geo} scale={1.004}>
          <meshPhysicalMaterial ref={glazed} map={t.map} bumpMap={t.bump} bumpScale={1.2} roughness={0.85} clearcoat={0.4} clearcoatRoughness={0.4} transparent opacity={0} visible={false} emissive="#ff5a14" emissiveIntensity={0} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <pointLight ref={heat} position={[0, 0.9, 0.4]} intensity={0} color="#ff6a1f" distance={7} />
      <Ground y={-0.12} />
    </group>
  )
}

export function WheelScene({ progress, label, className }) {
  return (
    <Stage className={className} label={label} camera={{ position: [0, 1.7, 4.4], fov: 30 }}>
      <Lights />
      <CameraAim y={-0.2} />
      <Bowl progress={progress} />
    </Stage>
  )
}

function CameraAim({ y }) {
  const { camera } = useThree()
  useEffect(() => {
    camera.lookAt(0, y, 0)
  }, [camera, y])
  return null
}

/* ----------------------------------------------------- shelf: five pieces */

export const SHELF = [
  { id: 'yunomi', glaze: 'kaki', x: -2.5, s: 0.95 },
  { id: 'chawan', glaze: 'shino', x: -1.25, s: 0.95 },
  { id: 'tsubo', glaze: 'namako', x: 0.2, s: 0.78 },
  { id: 'tokkuri', glaze: 'tenmoku', x: 1.55, s: 0.92 },
  { id: 'plate', glaze: 'ash', x: 2.95, s: 0.82 },
]

function ShelfPiece({ item, active, onPick }) {
  const g = useRef()
  const [hover, setHover] = useState(false)
  useFrame((_, dt) => {
    const lift = active ? 0.16 : hover ? 0.05 : 0
    g.current.position.y = THREE.MathUtils.damp(g.current.position.y, lift, 6, dt)
    if (active && !reduced()) g.current.rotation.y += dt * 0.7
    else g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, Math.round(g.current.rotation.y / (Math.PI * 2)) * Math.PI * 2, 4, dt)
  })
  return (
    <group
      ref={g}
      position-x={item.x}
      scale={item.s}
      onClick={(e) => (e.stopPropagation(), onPick(item.id))}
      onPointerOver={(e) => (e.stopPropagation(), setHover(true), (document.body.style.cursor = 'pointer'))}
      onPointerOut={() => (setHover(false), (document.body.style.cursor = ''))}
    >
      <Pot shape={item.id} glaze={item.glaze} />
    </group>
  )
}

function FitWidth({ width }) {
  // keep the whole shelf in frame on narrow screens
  const { camera, size } = useThree()
  useEffect(() => {
    const aspect = size.width / size.height
    const half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    camera.position.z = Math.max(8.4, width / 2 / (half * aspect))
    camera.position.y = 1.7
    camera.lookAt(0.2, 0.78, 0)
    camera.updateProjectionMatrix()
  }, [camera, size, width])
  return null
}

export function ShelfScene({ active, onPick, label, className }) {
  return (
    <Stage className={className} label={label} camera={{ position: [0, 1.5, 9], fov: 28 }}>
      <Lights />
      <FitWidth width={8.2} />
      <mesh position={[0.2, -0.05, 0]} receiveShadow>
        <boxGeometry args={[8.4, 0.1, 2.2]} />
        <meshStandardMaterial color="#d9c9b1" roughness={0.85} />
      </mesh>
      {SHELF.map((it) => (
        <ShelfPiece key={it.id} item={it} active={active === it.id} onPick={onPick} />
      ))}
      <Ground y={-0.1} />
    </Stage>
  )
}

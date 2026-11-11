import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* The yard: 56 m by 36 m of tarmac with a painted oval, cones to hit and cells to collect. */
const HALF_X = 28
const HALF_Z = 18
const KMH = 3.6

function groundTexture() {
  const W = 1024
  const H = Math.round((W * HALF_Z) / HALF_X)
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const x = c.getContext('2d')
  x.fillStyle = '#383b42'
  x.fillRect(0, 0, W, H)
  // speckle, so the surface reads as tarmac rather than a flat fill
  for (let i = 0; i < 5200; i++) {
    const v = 40 + Math.random() * 30
    x.fillStyle = `rgba(${v + 20},${v + 20},${v + 26},${0.25 + Math.random() * 0.4})`
    x.fillRect(Math.random() * W, Math.random() * H, 1.6, 1.6)
  }
  const s = W / (HALF_X * 2)
  // oval racing line
  x.lineWidth = 0.35 * s
  x.strokeStyle = '#f4f1ea'
  x.setLineDash([2.2 * s, 1.4 * s])
  x.beginPath()
  x.ellipse(W / 2, H / 2, 19 * s, 10.5 * s, 0, 0, Math.PI * 2)
  x.stroke()
  x.setLineDash([])
  x.strokeStyle = '#ff5a1f'
  x.lineWidth = 0.22 * s
  x.beginPath()
  x.ellipse(W / 2, H / 2, 25 * s, 15.5 * s, 0, 0, Math.PI * 2)
  x.stroke()
  // start grid
  for (let i = 0; i < 8; i++) {
    x.fillStyle = i % 2 ? '#f4f1ea' : '#16181d'
    x.fillRect(W / 2 - 0.5 * s, H / 2 + (10.5 + (i - 4) * 0.62) * s, 1 * s, 0.62 * s)
  }
  // border
  x.strokeStyle = '#f4f1ea'
  x.lineWidth = 0.3 * s
  x.strokeRect(0.6 * s, 0.6 * s, W - 1.2 * s, H - 1.2 * s)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

const CONES = [
  [-8, 0], [-4, 0], [0, 0], [4, 0], [8, 0],
  [-14, -6], [-12, -8], [14, 6], [12, 8], [-14, 6], [14, -6],
  [0, -6], [0, 6], [20, 0], [-20, 0],
].map(([x, z]) => ({ x, z }))

const CELLS = [[19, -9], [-19, 9], [0, -14], [-22, -3], [22, 4], [6, 13], [-8, -12], [12, -2], [-12, 3], [0, 3]]

function Car({ carRef, wheels, model }) {
  const tyre = '#101114'
  const wheel = (x, z, i) => (
    <group position={[x, 0.2, z]} ref={(el) => (wheels.current[i] = el)}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.17, 18]} />
        <meshStandardMaterial color={tyre} roughness={0.9} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.11, 0.11, 0.18, 6]} />
        <meshStandardMaterial color={model.trim} roughness={0.4} metalness={0.5} />
      </mesh>
    </group>
  )
  return (
    <group ref={carRef}>
      {/* chassis plate */}
      <mesh position={[0, 0.19, 0]} castShadow>
        <boxGeometry args={[0.62, 0.06, 1.5]} />
        <meshStandardMaterial color="#16181d" roughness={0.6} />
      </mesh>
      {/* body shell: nose, cabin, tail */}
      <mesh position={[0, 0.31, 0.02]} castShadow>
        <boxGeometry args={[0.74, 0.17, 1.58]} />
        <meshStandardMaterial color={model.body} roughness={0.35} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.45, -0.1]} castShadow>
        <boxGeometry args={[0.6, 0.15, 0.7]} />
        <meshStandardMaterial color="#0d1117" roughness={0.15} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.535, -0.1]}>
        <boxGeometry args={[0.56, 0.03, 0.56]} />
        <meshStandardMaterial color={model.body} roughness={0.35} />
      </mesh>
      {/* wing */}
      <mesh position={[0, 0.6, -0.72]} castShadow>
        <boxGeometry args={[0.78, 0.03, 0.2]} />
        <meshStandardMaterial color={model.trim} roughness={0.5} />
      </mesh>
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.5, -0.72]}>
          <boxGeometry args={[0.03, 0.2, 0.12]} />
          <meshStandardMaterial color={model.trim} />
        </mesh>
      ))}
      {/* lamps */}
      {[-0.24, 0.24].map((x) => (
        <mesh key={x} position={[x, 0.32, 0.815]}>
          <boxGeometry args={[0.16, 0.06, 0.02]} />
          <meshStandardMaterial color="#fff6d6" emissive="#ffe9a8" emissiveIntensity={1.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.34, -0.775]}>
        <boxGeometry args={[0.6, 0.05, 0.02]} />
        <meshStandardMaterial color="#ff2a2a" emissive="#ff1a1a" emissiveIntensity={0.9} />
      </mesh>
      {/* aerial */}
      <mesh position={[0.26, 0.75, -0.4]}>
        <cylinderGeometry args={[0.008, 0.008, 0.6, 5]} />
        <meshStandardMaterial color="#16181d" />
      </mesh>
      {wheel(-0.4, 0.5, 0)}
      {wheel(0.4, 0.5, 1)}
      {wheel(-0.4, -0.5, 2)}
      {wheel(0.4, -0.5, 3)}
    </group>
  )
}

function World({ model, input, active, onTelemetry, resetKey }) {
  const car = useRef()
  const wheels = useRef([])
  const coneRefs = useRef([])
  const cellRef = useRef()
  const ground = useMemo(groundTexture, [])
  useEffect(() => () => ground.dispose(), [ground])

  const sim = useRef(null)
  if (!sim.current) {
    sim.current = { x: 0, z: 10.5, h: Math.PI / 2, vx: 0, vz: 0, steer: 0, spin: 0, cell: 0, score: 0, tick: 0, cones: CONES.map((c) => ({ ...c, vx: 0, vz: 0, tilt: 0, ax: 0, az: 0 })) }
  }
  useEffect(() => {
    const s = sim.current
    Object.assign(s, { x: 0, z: 10.5, h: Math.PI / 2, vx: 0, vz: 0, steer: 0, cell: 0, score: 0 })
    s.cones.forEach((c, i) => Object.assign(c, CONES[i], { vx: 0, vz: 0, tilt: 0 }))
    onTelemetry({ speed: 0, score: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  const cam = useMemo(() => ({ pos: new THREE.Vector3(-9, 6, 10.5), look: new THREE.Vector3(0, 0.4, 10.5) }), [])

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const s = sim.current
    const k = input.current
    const auto = !active
    // when nobody is driving, the car laps the oval by itself as a demo
    let throttle = (k.up ? 1 : 0) - (k.down ? 1 : 0)
    let turn = (k.left ? 1 : 0) - (k.right ? 1 : 0)
    if (auto) {
      const a = Math.atan2(s.z / 10.5, s.x / 19) + 0.35
      const tx = Math.cos(a) * 19
      const tz = Math.sin(a) * 10.5
      const want = Math.atan2(tx - s.x, tz - s.z)
      let d = want - s.h
      d = Math.atan2(Math.sin(d), Math.cos(d))
      turn = THREE.MathUtils.clamp(d * 2.2, -1, 1)
      throttle = 0.42
    }
    const fx = Math.sin(s.h)
    const fz = Math.cos(s.h)
    let fwd = s.vx * fx + s.vz * fz
    let lat = s.vx * fz - s.vz * fx
    const top = model.top / KMH
    if (throttle > 0) fwd += model.accel * throttle * (1 - Math.max(0, fwd) / top) * dt
    else if (throttle < 0) fwd += (fwd > 0.5 ? -26 : -model.accel * 0.5 * (1 + Math.min(0, fwd) / (top * 0.35))) * dt
    if (k.brake) fwd -= Math.sign(fwd) * Math.min(Math.abs(fwd), 30 * dt)
    fwd -= fwd * 0.35 * dt
    lat -= lat * Math.min(1, model.grip * (k.brake ? 0.35 : 1) * dt)
    s.steer += (turn - s.steer) * Math.min(1, 9 * dt)
    const bite = THREE.MathUtils.clamp(fwd / 4, -1, 1)
    s.h += s.steer * model.turn * bite * dt * (1 - Math.min(0.45, Math.abs(fwd) / top / 2))
    const nfx = Math.sin(s.h)
    const nfz = Math.cos(s.h)
    s.vx = nfx * fwd + nfz * lat
    s.vz = nfz * fwd - nfx * lat
    s.x += s.vx * dt
    s.z += s.vz * dt
    // boards round the yard
    const bx = HALF_X - 1.2
    const bz = HALF_Z - 1.2
    if (Math.abs(s.x) > bx) { s.x = Math.sign(s.x) * bx; s.vx *= -0.35 }
    if (Math.abs(s.z) > bz) { s.z = Math.sign(s.z) * bz; s.vz *= -0.35 }
    // cones
    s.cones.forEach((c, i) => {
      const dx = c.x - s.x
      const dz = c.z - s.z
      const d2 = dx * dx + dz * dz
      const sp = Math.hypot(s.vx, s.vz)
      if (d2 < 0.72 && sp > 0.6) {
        const d = Math.sqrt(d2) || 1
        c.vx = s.vx * 0.9 + (dx / d) * 2
        c.vz = s.vz * 0.9 + (dz / d) * 2
        c.ax = dz / d
        c.az = -dx / d
        c.tilt = Math.min(1.45, c.tilt + sp * 0.2)
        s.vx *= 0.9
        s.vz *= 0.9
      }
      c.x += c.vx * dt
      c.z += c.vz * dt
      c.vx -= c.vx * 2.4 * dt
      c.vz -= c.vz * 2.4 * dt
      c.x = THREE.MathUtils.clamp(c.x, -bx, bx)
      c.z = THREE.MathUtils.clamp(c.z, -bz, bz)
      const m = coneRefs.current[i]
      if (m) {
        m.position.set(c.x, 0, c.z)
        m.rotation.set(c.ax * c.tilt, 0, c.az * c.tilt)
      }
    })
    // the cell to collect
    const [cx, cz] = CELLS[s.cell % CELLS.length]
    if (!auto && (cx - s.x) ** 2 + (cz - s.z) ** 2 < 1.7) {
      s.cell += 1
      s.score += 1
    }
    if (cellRef.current) {
      const [nx, nz] = CELLS[s.cell % CELLS.length]
      cellRef.current.position.set(nx, 0.75 + Math.sin(state.clock.elapsedTime * 3) * 0.12, nz)
      cellRef.current.rotation.y += dt * 2
      cellRef.current.visible = !auto
    }
    // place the car
    const c = car.current
    c.position.set(s.x, 0, s.z)
    c.rotation.set(0, s.h, 0)
    c.rotation.z = THREE.MathUtils.clamp(lat * 0.035, -0.12, 0.12)
    s.spin += (fwd / 0.2) * dt
    wheels.current.forEach((w, i) => {
      if (!w) return
      w.rotation.set(s.spin, i < 2 ? s.steer * 0.5 : 0, 0, 'YXZ')
    })
    // chase camera
    const back = auto ? 9 : 6.2
    const up = auto ? 6.5 : 3.1
    cam.pos.set(s.x - nfx * back + (auto ? 5 : 0), up, s.z - nfz * back)
    cam.look.set(s.x + nfx * 1.5, 0.5, s.z + nfz * 1.5)
    state.camera.position.lerp(cam.pos, Math.min(1, (auto ? 1.2 : 3.4) * dt))
    state.camera.lookAt(cam.look)
    // telemetry at 8 Hz is plenty for a readout
    s.tick += dt
    if (s.tick > 0.125) {
      s.tick = 0
      onTelemetry({ speed: Math.abs(fwd) * KMH, score: s.score })
    }
  })

  return (
    <>
      <color attach="background" args={['#cfd6dc']} />
      <fog attach="fog" args={['#cfd6dc', 34, 78]} />
      <hemisphereLight args={['#f6f8ff', '#3a3c42', 1.05]} />
      <directionalLight position={[14, 22, 8]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-32} shadow-camera-right={32} shadow-camera-top={22} shadow-camera-bottom={-22} shadow-camera-far={70} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[HALF_X * 2, HALF_Z * 2]} />
        <meshStandardMaterial map={ground} roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#b9c0c6" roughness={1} />
      </mesh>
      {/* boards */}
      {[
        [0, -HALF_Z, HALF_X * 2, 0.3],
        [0, HALF_Z, HALF_X * 2, 0.3],
        [-HALF_X, 0, 0.3, HALF_Z * 2],
        [HALF_X, 0, 0.3, HALF_Z * 2],
      ].map(([x, z, w, d], i) => (
        <mesh key={i} position={[x, 0.3, z]} castShadow>
          <boxGeometry args={[w, 0.6, d]} />
          <meshStandardMaterial color={i % 2 ? '#f4f1ea' : '#ff5a1f'} roughness={0.7} />
        </mesh>
      ))}
      {CONES.map((_, i) => (
        <group key={i} ref={(el) => (coneRefs.current[i] = el)}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <coneGeometry args={[0.2, 0.6, 14]} />
            <meshStandardMaterial color="#ff5a1f" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.46, 0.04, 0.46]} />
            <meshStandardMaterial color="#16181d" />
          </mesh>
        </group>
      ))}
      <group ref={cellRef}>
        <mesh castShadow>
          <boxGeometry args={[0.36, 0.7, 0.36]} />
          <meshStandardMaterial color="#b6ff3c" emissive="#7dff00" emissiveIntensity={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.16, 0.1, 0.16]} />
          <meshStandardMaterial color="#16181d" />
        </mesh>
      </group>
      <Car carRef={car} wheels={wheels} model={model} />
    </>
  )
}

/** The yard and the car. Renders only while on screen; drives itself until `active`. */
export default function Yard({ model, input, active, onTelemetry, resetKey, className = '', label }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '80px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} role="img" aria-label={label}>
      <Canvas shadows dpr={[1, 1.6]} camera={{ fov: 46, near: 0.1, far: 200, position: [-9, 6, 10.5] }} frameloop={on ? 'always' : 'never'} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <World model={model} input={input} active={active} onTelemetry={onTelemetry} resetKey={resetKey} />
      </Canvas>
    </div>
  )
}

// Plain data shared by the page and the three.js scene, kept apart so the shell never imports three.
export const MODELS = [
  { id: 'kite', name: 'Kite 10', cls: '1/10 touring', price: 289, body: '#ff5a1f', trim: '#16181d', top: 62, accel: 15, grip: 5.2, turn: 2.5, run: 28, drive: '4WD shaft', motor: '3650 brushless, 3300 kV', photo: 'touring', blurb: 'Low, planted and quick to turn. The one to learn racing lines on.' },
  { id: 'burro', name: 'Burro 8', cls: '1/8 buggy', price: 419, body: '#1f6bff', trim: '#f4f1ea', top: 74, accel: 19, grip: 4.2, turn: 2.2, run: 22, drive: '4WD, three diffs', motor: '4074 brushless, 2200 kV', photo: 'buggy', blurb: 'Long-travel shocks and big tyres. Lands jumps and shrugs off gravel.' },
  { id: 'yoko', name: 'Yoko D', cls: '1/10 drift', price: 339, body: '#f2c200', trim: '#16181d', top: 48, accel: 13, grip: 1.6, turn: 3.1, run: 35, drive: 'RWD, gyro assist', motor: '540 sensored, 10.5T', photo: 'drift', blurb: 'Hard tyres and a steering gyro. Built to go sideways on polished concrete.' },
]

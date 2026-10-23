import { Buffer } from 'node:buffer'

// Original stereo composition. No reference audio or downloaded sample is used.
export function createScore(duration = 22, sampleRate = 48000) {
  const length = Math.round(duration * sampleRate)
  const left = new Float32Array(length)
  const right = new Float32Array(length)
  const tau = Math.PI * 2
  let seed = 78124
  const noise = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 2147483648 - 1
  }
  function event(start, seconds, sound, pan = 0) {
    const first = Math.max(0, Math.floor(start * sampleRate))
    const end = Math.min(length, Math.ceil((start + seconds) * sampleRate))
    const gainL = Math.sqrt((1 - pan) / 2)
    const gainR = Math.sqrt((1 + pan) / 2)
    for (let i = first; i < end; i++) {
      const value = sound((i - first) / sampleRate)
      left[i] += value * gainL
      right[i] += value * gainR
    }
  }
  const chords = [
    [146.832, 174.614, 220, 261.626],
    [116.541, 146.832, 174.614, 220],
    [130.813, 174.614, 220, 261.626],
    [130.813, 164.814, 195.998, 246.942],
  ]
  // Broad, softly detuned pads, released well before the final silence.
  for (let bar = 0; bar < 10; bar++) {
    const start = bar * 2
    const notes = bar === 9 ? chords[0] : chords[bar % chords.length]
    for (const [voice, freq] of notes.entries()) {
      event(
        start,
        4,
        (t) => {
          const env = Math.min(1, t / 0.65) * Math.min(1, (4 - t) / 1.8)
          const wave =
            Math.sin(tau * freq * t) * 0.7 +
            Math.sin(tau * freq * 1.003 * t) * 0.3
          return wave * env * 0.027
        },
        (voice - 1.5) * 0.38,
      )
    }
  }
  for (let beat = 0; beat < 38; beat++) {
    const start = beat * 0.5
    const intensity = start < 2.5 ? 0.6 : 1
    event(
      start,
      0.38,
      (t) =>
        Math.sin(tau * (48 * t + 7 * (1 - Math.exp(-t * 30)))) *
        Math.exp(-t * 17) *
        0.31 *
        intensity,
    )
    const chord = chords[Math.floor(start / 2) % chords.length]
    const freq = chord[0] / 2
    event(start, 0.44, (t) => {
      const env = Math.min(1, t / 0.012) * Math.exp(-t * 6)
      return (
        (Math.sin(tau * freq * t) + 0.2 * Math.sin(tau * freq * 2 * t)) *
        env *
        0.13 *
        intensity
      )
    })
    if (beat % 2 === 1) {
      event(
        start,
        0.18,
        (t) =>
          (noise() * 0.6 + Math.sin(tau * 180 * t) * 0.4) *
          Math.exp(-t * 26) *
          0.13 *
          intensity,
        0.08,
      )
    }
    for (let half = 0; half < 2; half++) {
      event(
        start + half * 0.25,
        0.075,
        (t) => noise() * Math.exp(-t * 95) * (half ? 0.035 : 0.018) * intensity,
        half ? 0.45 : -0.45,
      )
    }
  }
  const pattern = [0, 2, 1, 3, 2, 1, 3, 2]
  for (let note = 0; note < 76; note++) {
    const start = 0.125 + note * 0.25
    const chord = chords[Math.floor(start / 2) % chords.length]
    const freq = chord[pattern[note % pattern.length]] * 2
    for (let echo = 0; echo < 4; echo++) {
      event(
        start + echo * 0.375,
        0.9,
        (t) => {
          const env = Math.min(1, t / 0.004) * Math.exp(-t * 8)
          const wave =
            Math.sin(tau * freq * t) +
            0.23 * Math.sin(tau * freq * 2 * t) +
            0.08 * Math.sin(tau * freq * 3 * t)
          return wave * env * 0.057 * 0.36 ** echo
        },
        echo % 2 ? -0.55 : 0.55,
      )
    }
  }
  // Filter-like air movement marks each edit without harsh transition impacts.
  for (const cut of [2.5, 5.5, 9, 12.5, 16.5, 19]) {
    let previous = 0
    event(
      cut - 0.2,
      0.5,
      (t) => {
        const raw = noise()
        previous = previous * 0.88 + raw * 0.12
        return previous * Math.sin((Math.PI * t) / 0.5) ** 2 * 0.2
      },
      0,
    )
  }
  let peak = 0
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate
    const fade =
      Math.min(1, t / 0.1) * Math.max(0, Math.min(1, (21.95 - t) / 3)) ** 1.7
    left[i] *= fade
    right[i] *= fade
    peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]))
  }
  const wav = Buffer.alloc(44 + length * 4)
  wav.write('RIFF', 0)
  wav.writeUInt32LE(wav.length - 8, 4)
  wav.write('WAVEfmt ', 8)
  wav.writeUInt32LE(16, 16)
  wav.writeUInt16LE(1, 20)
  wav.writeUInt16LE(2, 22)
  wav.writeUInt32LE(sampleRate, 24)
  wav.writeUInt32LE(sampleRate * 4, 28)
  wav.writeUInt16LE(4, 32)
  wav.writeUInt16LE(16, 34)
  wav.write('data', 36)
  wav.writeUInt32LE(length * 4, 40)
  const gain = 0.86 / peak
  for (let i = 0; i < length; i++) {
    wav.writeInt16LE(Math.round(left[i] * gain * 32767), 44 + i * 4)
    wav.writeInt16LE(Math.round(right[i] * gain * 32767), 46 + i * 4)
  }
  return wav
}

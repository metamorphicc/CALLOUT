import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas'
import ffmpeg from 'ffmpeg-static'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { log, error as logError } from 'node:console'
import { Buffer } from 'node:buffer'
import process from 'node:process'
import {
  markedCallers,
  leaderboardSource,
} from '../../src/features/marked-ones/data.ts'
import { publishedSignals } from '../../src/lib/catalog.ts'
import { createFilm, settings } from './film.mjs'

const root = fileURLToPath(new URL('../../', import.meta.url))
const output = path.join(root, 'artifacts/promo')
await mkdir(output, { recursive: true })
const fonts = {
  Grotesk:
    'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
  Pixel: 'node_modules/@fontsource/tiny5/files/tiny5-latin-400-normal.woff',
  Terminal:
    'node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2',
}
for (const [name, file] of Object.entries(fonts)) {
  if (!GlobalFonts.registerFromPath(path.join(root, file), name))
    throw new Error(`Font could not be registered: ${name}`)
}
const data = {
  source: leaderboardSource.url,
  callers: markedCallers.map((caller) => ({
    id: caller.id,
    name: caller.displayName,
    rewards: Number(caller.rewards.amount),
    followers: caller.sourceStatistics.followers,
    median: caller.sourceStatistics.medianGainMultiple,
  })),
  signals: publishedSignals.map((signal) => ({
    symbol: signal.symbol,
    caller: markedCallers.find((caller) => caller.id === signal.callerId)
      .displayName,
    mint: signal.mint,
    source: signal.sourceUrl,
  })),
}
const atlasBytes = await readFile(path.join(root, 'public/art/order-atlas.png'))
const atlas = await loadImage(atlasBytes)
const canvas = createCanvas(settings.width, settings.height)
const ctx = canvas.getContext('2d')
const draw = createFilm(data, atlas)
const samples = [1.5, 5.4, 9, 15.6, 21.2, 26.3, 30]
for (const [index, second] of samples.entries()) {
  draw(ctx, second)
  await writeFile(
    path.join(output, `callout-frame-${index + 1}.png`),
    canvas.toBuffer('image/png'),
  )
}
draw(ctx, 9)
await writeFile(
  path.join(output, 'callout-terminal-poster.png'),
  canvas.toBuffer('image/png'),
)

// HTML and MP4 use the same drawing function, data, embedded artwork and fonts.
const fontCss = (
  await Promise.all(
    Object.entries(fonts).map(
      async ([name, file]) =>
        `@font-face{font-family:${name};src:url(data:${file.endsWith('.woff') ? 'font/woff' : 'font/woff2'};base64,${(await readFile(path.join(root, file))).toString('base64')})}`,
    ),
  )
).join('')
const filmSource = (
  await readFile(new URL('./film.mjs', import.meta.url), 'utf8')
).replaceAll('export ', '')
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CALLOUT / Source Playback</title><style>${fontCss}*{box-sizing:border-box}body{margin:0;background:#061b15;color:#edfff5;font:14px Grotesk;display:grid;place-items:center;min-height:100dvh}main{width:min(100%,720px)}canvas{width:100%;height:auto;display:block}nav{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:16px}button{font:inherit;border:1px solid #9fffd0;color:#9fffd0;background:transparent;min-height:44px;padding:10px 18px;cursor:pointer}p{margin:0;color:#92b5a2;max-width:45ch;font-size:12px}:focus-visible{outline:2px solid #9fffd0;outline-offset:4px}</style></head><body><main><canvas width="1080" height="1350" aria-label="Animated CALLOUT research terminal: callers, reward source records, comparisons and original callouts"></canvas><nav><button id="play" type="button">Pause</button><button id="replay" type="button">Replay</button><p>Historical source records. Animation is an original promotional treatment of the website.</p></nav></main><script type="module">${filmSource}\nconst data=${JSON.stringify(data)};await document.fonts.load('400 30px Grotesk');await document.fonts.load('400 30px Pixel');await document.fonts.load('400 30px Terminal');const atlas=new Image();atlas.src='data:image/png;base64,${atlasBytes.toString('base64')}';await atlas.decode();const canvas=document.querySelector('canvas');const draw=createFilm(data,atlas);const ctx=canvas.getContext('2d');let start=performance.now(),paused=false,held=0;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce){paused=true;held=9;document.querySelector('#play').textContent='Play'}function tick(now){const t=paused?held:((now-start)/1000)%settings.duration;draw(ctx,t);requestAnimationFrame(tick)}requestAnimationFrame(tick);document.querySelector('#play').onclick=()=>{if(paused){start=performance.now()-held*1000;paused=false}else{held=((performance.now()-start)/1000)%settings.duration;paused=true}document.querySelector('#play').textContent=paused?'Play':'Pause'};document.querySelector('#replay').onclick=()=>{start=performance.now();held=0;paused=false;document.querySelector('#play').textContent='Pause'};</script></body></html>`
await writeFile(path.join(output, 'callout-terminal.html'), html)

// Original synthesized score, including a bass pulse, percussion and data ticks.
const sampleRate = 48000
const samplesCount = Math.ceil(settings.duration * sampleRate)
const audio = Buffer.alloc(44 + samplesCount * 2)
audio.write('RIFF', 0)
audio.writeUInt32LE(audio.length - 8, 4)
audio.write('WAVEfmt ', 8)
audio.writeUInt32LE(16, 16)
audio.writeUInt16LE(1, 20)
audio.writeUInt16LE(1, 22)
audio.writeUInt32LE(sampleRate, 24)
audio.writeUInt32LE(sampleRate * 2, 28)
audio.writeUInt16LE(2, 32)
audio.writeUInt16LE(16, 34)
audio.write('data', 36)
audio.writeUInt32LE(samplesCount * 2, 40)
const scenes = [0, 3.5, 6.5, 13.5, 18.5, 24.5, 28]
for (let i = 0; i < samplesCount; i++) {
  const t = i / sampleRate
  const beat = t % 0.5
  const kick =
    Math.sin(2 * Math.PI * (54 * beat + 6 * (1 - Math.exp(-beat * 26)))) *
    Math.exp(-beat * 19) *
    0.16
  const bassNote = [55, 55, 65.406, 49][Math.floor(t / 4) % 4]
  const bass =
    (Math.sin(2 * Math.PI * bassNote * t) +
      0.25 * Math.sin(2 * Math.PI * bassNote * 2 * t)) *
    0.08 *
    (0.65 + 0.35 * Math.exp(-beat * 9))
  const tickTime = t % 0.25
  const hash = Math.sin(i * 12.9898) * 43758.5453
  const noise = (hash - Math.floor(hash)) * 2 - 1
  const hat = noise * Math.exp(-tickTime * 170) * 0.025
  let blip = 0
  for (const scene of scenes) {
    const dt = t - scene
    if (dt >= 0 && dt < 0.24)
      blip +=
        Math.sin(2 * Math.PI * (660 + dt * 330) * dt) *
        Math.exp(-dt * 24) *
        0.12
  }
  const leadTime = t % 2
  const note = [440, 523.251, 659.255, 587.33][Math.floor(t / 2) % 4]
  const lead =
    Math.sin(2 * Math.PI * note * t) * Math.exp(-leadTime * 2.8) * 0.025
  const fade = Math.min(1, t / 0.25, (settings.duration - t) / 0.8)
  audio.writeInt16LE(
    Math.round(
      Math.max(-0.9, Math.min(0.9, (kick + bass + hat + blip + lead) * fade)) *
        32767,
    ),
    44 + i * 2,
  )
}
const wav = path.join(output, 'callout-terminal-score.wav')
await writeFile(wav, audio)

if (process.argv.includes('--stills')) {
  log(`Stills and self-contained HTML ready in ${output}`)
  process.exit(0)
}
if (!ffmpeg) throw new Error('FFmpeg binary is unavailable for this platform.')
const video = path.join(output, 'callout-terminal.mp4')
const args = [
  '-y',
  '-hide_banner',
  '-loglevel',
  'warning',
  '-f',
  'rawvideo',
  '-pixel_format',
  'rgba',
  '-video_size',
  `${settings.width}x${settings.height}`,
  '-framerate',
  String(settings.fps),
  '-i',
  'pipe:0',
  '-i',
  wav,
  '-map',
  '0:v:0',
  '-map',
  '1:a:0',
  '-c:v',
  'libx264',
  '-preset',
  'medium',
  '-crf',
  '19',
  '-pix_fmt',
  'yuv420p',
  '-profile:v',
  'high',
  '-level:v',
  '4.2',
  '-r',
  String(settings.fps),
  '-g',
  '60',
  '-c:a',
  'aac',
  '-b:a',
  '160k',
  '-af',
  'loudnorm=I=-16:TP=-1.5:LRA=7',
  '-ar',
  '48000',
  '-ac',
  '2',
  '-movflags',
  '+faststart',
  '-t',
  String(settings.duration),
  video,
]
const encoder = spawn(ffmpeg, args, { stdio: ['pipe', 'ignore', 'pipe'] })
let diagnostic = ''
encoder.stderr.on('data', (chunk) => {
  diagnostic += chunk.toString()
})
encoder.stdin.on('error', (error) => {
  logError(error.message)
})
const complete = new Promise((resolve, reject) => {
  encoder.on('error', reject)
  encoder.on('close', (code) =>
    code === 0
      ? resolve()
      : reject(new Error(`FFmpeg exited ${code}: ${diagnostic}`)),
  )
})
const frameCount = settings.duration * settings.fps
const started = Date.now()
try {
  for (let frame = 0; frame < frameCount; frame++) {
    draw(ctx, frame / settings.fps)
    const pixels = ctx.getImageData(0, 0, settings.width, settings.height).data
    if (
      !encoder.stdin.write(
        Buffer.from(pixels.buffer, pixels.byteOffset, pixels.byteLength),
      )
    )
      await once(encoder.stdin, 'drain')
    if (frame % 90 === 0)
      log(
        `Render ${Math.round((frame / frameCount) * 100)}% / frame ${frame} of ${frameCount}`,
      )
  }
  encoder.stdin.end()
  await complete
} catch (error) {
  encoder.kill()
  throw error
}
log(`Rendered ${video} in ${Math.round((Date.now() - started) / 1000)}s`)
const inspect = spawn(
  ffmpeg,
  ['-hide_banner', '-i', video, '-f', 'null', '-'],
  { stdio: ['ignore', 'ignore', 'pipe'] },
)
let details = ''
inspect.stderr.on('data', (chunk) => {
  details += chunk.toString()
})
const [decodeCode] = await once(inspect, 'close')
if (decodeCode !== 0)
  throw new Error(`Video decode verification failed: ${details}`)
await writeFile(
  path.join(output, 'render-report.json'),
  JSON.stringify(
    {
      settings,
      frameCount,
      elapsedSeconds: Math.round((Date.now() - started) / 1000),
      video,
      source: data.source,
      details,
    },
    null,
    2,
  ),
)
log('Full decode verification finished. See render-report.json.')

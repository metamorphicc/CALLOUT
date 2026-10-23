import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas'
import ffmpeg from 'ffmpeg-static'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { Buffer } from 'node:buffer'
import process from 'node:process'
import { log } from 'node:console'
import { createFilm, settings, cuts, reviewTimes } from './film.mjs'
import { createScore } from './score.mjs'

const root = fileURLToPath(new URL('../../', import.meta.url))
const output = path.join(root, 'artifacts/promo-montage')
await mkdir(output, { recursive: true })
const fonts = {
  Grotesk:
    'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
  Pixel: 'node_modules/@fontsource/tiny5/files/tiny5-latin-400-normal.woff',
}
for (const [family, relative] of Object.entries(fonts)) {
  if (!GlobalFonts.registerFromPath(path.join(root, relative), family))
    throw new Error(`Missing font: ${family}`)
}
const sources = {
  atlas: 'public/art/order-atlas.png',
  overview: 'media/callout-montage/assets/overview.png',
  directory: 'media/callout-montage/assets/directory.png',
  compare: 'media/callout-montage/assets/compare.png',
  'profile-mobile': 'media/callout-montage/assets/profile-mobile.png',
  'signal-mobile': 'media/callout-montage/assets/signal-mobile.png',
  saved: 'media/callout-montage/assets/saved.png',
  'saved-mobile': 'media/callout-montage/assets/saved-mobile.png',
}
const bytes = Object.fromEntries(
  await Promise.all(
    Object.entries(sources).map(async ([name, relative]) => [
      name,
      await readFile(path.join(root, relative)),
    ]),
  ),
)
const images = Object.fromEntries(
  await Promise.all(
    Object.entries(bytes).map(async ([name, data]) => [
      name,
      await loadImage(data),
    ]),
  ),
)
const canvas = createCanvas(settings.width, settings.height)
const ctx = canvas.getContext('2d')
const draw = createFilm(images)
for (const [i, second] of reviewTimes.entries()) {
  draw(ctx, second)
  await writeFile(
    path.join(output, `scene-${i + 1}.png`),
    canvas.toBuffer('image/png'),
  )
}
draw(ctx, 1.6)
await writeFile(
  path.join(output, 'callout-montage-poster.png'),
  canvas.toBuffer('image/png'),
)
const contact = createCanvas(1440, 810)
const review = contact.getContext('2d')
review.fillStyle = '#edf8f0'
review.fillRect(0, 0, 1440, 810)
for (const [i, second] of reviewTimes.entries()) {
  draw(ctx, second)
  review.drawImage(canvas, (i % 3) * 480, Math.floor(i / 3) * 270, 480, 270)
}
await writeFile(
  path.join(output, 'storyboard.png'),
  contact.toBuffer('image/png'),
)
const score = createScore(settings.duration)
const wav = path.join(output, 'callout-montage-score.wav')
await writeFile(wav, score)
const fontCss = (
  await Promise.all(
    Object.entries(fonts).map(
      async ([family, relative]) =>
        `@font-face{font-family:${family};src:url(data:${relative.endsWith('.woff2') ? 'font/woff2' : 'font/woff'};base64,${(await readFile(path.join(root, relative))).toString('base64')})}`,
    ),
  )
).join('')
const filmSource = (
  await readFile(new URL('./film.mjs', import.meta.url), 'utf8')
).replaceAll('export ', '')
const encodedImages = Object.fromEntries(
  Object.entries(bytes).map(([name, data]) => [name, data.toString('base64')]),
)
const chapters = [
  'The Marked Ones',
  'Overview',
  'Caller profiles',
  'Comparison',
  'Original signal',
  'Shortlist',
  'CALLOUT',
]
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CALLOUT — Product Film</title><style>${fontCss}*{box-sizing:border-box}body{margin:0;background:#e8f7ee;color:#102b23;font:14px Grotesk,system-ui;min-height:100dvh;display:grid;place-items:center}main{width:min(100%,1440px,calc((100dvh - 200px)*16/9))}canvas{display:block;width:100%;height:auto;aspect-ratio:16/9;background:#fbfefc}nav{padding:16px 20px;display:flex;flex-wrap:wrap;align-items:center;gap:12px}button{font:inherit;cursor:pointer;padding:10px 16px;min-height:44px;color:inherit;background:transparent;border:1px solid #8fb6a2;border-radius:6px}button:hover{background:#c8ecd9}input{flex:1;min-width:140px;accent-color:#14643f}output{font-variant-numeric:tabular-nums}p{padding:0 20px;margin:0 0 14px;color:#567563;font-size:12px}.chapters{padding-top:0}.chapters button{font-size:12px;min-height:36px;padding:7px 12px}:focus-visible{outline:3px solid #14643f;outline-offset:3px}@media(max-width:600px){nav{padding:10px;gap:8px}button{padding:8px 10px}input{order:5;flex-basis:100%}}</style></head><body><main><canvas width="1920" height="1080" aria-label="CALLOUT product film showing real caller records, comparisons, original-source signals and a personal shortlist"></canvas><nav aria-label="Playback"><button id="toggle">Pause</button><button id="replay">Replay</button><button id="sound" aria-pressed="false">Enable sound</button><input id="seek" type="range" min="0" max="22" step="0.01" value="0" aria-label="Playback position"><output id="time">0:00 / 0:22</output></nav><nav class="chapters" aria-label="Chapters">${chapters.map((label, i) => `<button data-time="${reviewTimes[i]}">${label}</button>`).join('')}</nav><p>Actual CALLOUT website captures · Original animation and soundtrack · Historical source records</p><audio id="audio" preload="auto" src="data:audio/wav;base64,${score.toString('base64')}"></audio></main><script type="module">${filmSource}
const sources=${JSON.stringify(encodedImages)};
await document.fonts.load('600 40px Grotesk');await document.fonts.load('400 40px Pixel');
const images=Object.fromEntries(await Promise.all(Object.entries(sources).map(async([name,base64])=>{const image=new Image();image.src='data:image/png;base64,'+base64;await image.decode();return[name,image]})));
const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d'),draw=createFilm(images),audio=document.querySelector('#audio'),toggle=document.querySelector('#toggle'),sound=document.querySelector('#sound'),seek=document.querySelector('#seek'),clock=document.querySelector('#time');
let playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,enabled=false,held=0,start=performance.now();
function position(){return playing?Math.min(settings.duration,(performance.now()-start)/1000):held}
function update(){toggle.textContent=playing?'Pause':'Play';sound.textContent=enabled?'Mute':'Enable sound';sound.setAttribute('aria-pressed',String(enabled))}
function syncAudio(){audio.pause();audio.currentTime=Math.min(position(),settings.duration-0.001);if(playing&&enabled)audio.play().catch(()=>{enabled=false;update()})}
function jump(t,resume=false){held=t;start=performance.now()-t*1000;if(resume)playing=true;syncAudio();update()}
function tick(){const t=position();if(t>=settings.duration&&playing){held=settings.duration;playing=false;audio.pause();update()}draw(ctx,Math.min(t,21.999));seek.value=t;clock.textContent='0:'+String(Math.floor(t)).padStart(2,'0')+' / 0:22';requestAnimationFrame(tick)}
toggle.onclick=()=>{if(playing){held=position();playing=false}else{if(held>=settings.duration)held=0;start=performance.now()-held*1000;playing=true}syncAudio();update()};
document.querySelector('#replay').onclick=()=>jump(0,true);sound.onclick=()=>{enabled=!enabled;syncAudio();update()};seek.oninput=()=>jump(Number(seek.value));document.querySelectorAll('[data-time]').forEach(button=>button.onclick=()=>{playing=false;jump(Number(button.dataset.time))});update();requestAnimationFrame(tick);
</script></body></html>`
await writeFile(path.join(output, 'callout-montage.html'), html)
if (process.argv.includes('--stills')) {
  log('Montage review frames, soundtrack and self-contained HTML ready.')
  process.exit(0)
}
if (!ffmpeg) throw new Error('FFmpeg is unavailable.')
const video = path.join(output, 'callout-montage.mp4')
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
  '1920x1080',
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
  '18',
  '-pix_fmt',
  'yuv420p',
  '-profile:v',
  'high',
  '-level:v',
  '4.2',
  '-r',
  '60',
  '-g',
  '120',
  '-c:a',
  'aac',
  '-b:a',
  '192k',
  '-af',
  'loudnorm=I=-16:TP=-1.5:LRA=7,afade=t=out:st=19:d=3',
  '-ar',
  '48000',
  '-ac',
  '2',
  '-movflags',
  '+faststart',
  '-t',
  '22',
  video,
]
const encoder = spawn(ffmpeg, args, { stdio: ['pipe', 'ignore', 'pipe'] })
let diagnostics = ''
encoder.stderr.on('data', (chunk) => {
  diagnostics += chunk.toString()
})
encoder.stdin.on('error', () => {})
const complete = new Promise((resolve, reject) => {
  encoder.on('error', reject)
  encoder.on('close', (code) =>
    code === 0
      ? resolve()
      : reject(new Error(`FFmpeg exited ${code}: ${diagnostics}`)),
  )
})
const frameCount = settings.fps * settings.duration
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
    if (frame % 180 === 0)
      log(`Montage render ${Math.round((frame / frameCount) * 100)}%`)
  }
  encoder.stdin.end()
  await complete
} catch (error) {
  encoder.kill()
  throw error
}
const inspect = spawn(
  ffmpeg,
  ['-hide_banner', '-i', video, '-f', 'null', '-'],
  { stdio: ['ignore', 'ignore', 'pipe'] },
)
let details = ''
inspect.stderr.on('data', (chunk) => {
  details += chunk.toString()
})
const [code] = await once(inspect, 'close')
if (code !== 0) throw new Error(`Full decode failed: ${details}`)
await writeFile(
  path.join(output, 'render-report.json'),
  JSON.stringify(
    {
      settings,
      cuts,
      frameCount,
      bytes: (await stat(video)).size,
      elapsedSeconds: Math.round((Date.now() - started) / 1000),
      decodeExitCode: code,
      details,
    },
    null,
    2,
  ),
)
log(`Montage ready. Full ${frameCount}-frame decode passed.`)

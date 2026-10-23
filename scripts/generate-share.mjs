import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { log } from 'node:console'

const root = fileURLToPath(new URL('../', import.meta.url))
GlobalFonts.registerFromPath(
  path.join(
    root,
    'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
  ),
  'Grotesk',
)
GlobalFonts.registerFromPath(
  path.join(
    root,
    'node_modules/@fontsource/tiny5/files/tiny5-latin-400-normal.woff',
  ),
  'Pixel',
)
const canvas = createCanvas(1200, 630)
const ctx = canvas.getContext('2d')
const palette = {
  paper: '#f2fcf7',
  ink: '#112b22',
  mint: '#bbf0d5',
  accent: '#256a4c',
  muted: '#526e61',
}
ctx.fillStyle = palette.paper
ctx.fillRect(0, 0, 1200, 630)
ctx.fillStyle = palette.mint
ctx.fillRect(660, 0, 540, 630)
ctx.fillStyle = palette.ink
ctx.font = '400 90px Pixel'
ctx.fillText('CALLOUT', 64, 130)
ctx.font = '600 55px Grotesk'
ctx.fillText('Follow the signal.', 64, 270)
ctx.fillText('Keep the record.', 64, 335)
ctx.fillStyle = palette.muted
ctx.font = '400 22px Grotesk'
ctx.fillText('Caller research. Original sources.', 68, 402)
ctx.fillText('Your own view of the Order.', 68, 436)
const atlas = await loadImage(path.join(root, 'public/art/order-atlas.png'))
const cell = atlas.width / 5
ctx.imageSmoothingEnabled = false
for (const [index, x, y, size] of [
  [1, 670, 100, 180],
  [2, 875, 60, 195],
  [0, 720, 330, 195],
  [3, 930, 330, 180],
]) {
  ctx.drawImage(
    atlas,
    index * cell,
    135,
    cell,
    525,
    x,
    y,
    size,
    (size * 525) / cell,
  )
}
ctx.fillStyle = palette.accent
ctx.fillRect(64, 535, 45, 4)
ctx.font = '500 16px Grotesk'
ctx.fillText('THE CALLOUT ORDER', 125, 544)
ctx.fillStyle = palette.muted
ctx.font = '400 16px Grotesk'
ctx.fillText('callout-xi.vercel.app', 64, 590)
await writeFile(
  path.join(root, 'public/og-cover.png'),
  canvas.toBuffer('image/png'),
)
log('Created public/og-cover.png (1200 × 630).')

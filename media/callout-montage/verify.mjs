import ffmpeg from 'ffmpeg-static'
import { spawnSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { log } from 'node:console'
import { settings, reviewTimes } from './film.mjs'

const output = fileURLToPath(
  new URL('../../artifacts/promo-montage/', import.meta.url),
)
const video = path.join(output, 'callout-montage.mp4')
function run(args) {
  const result = spawnSync(
    ffmpeg,
    ['-hide_banner', '-loglevel', 'error', ...args],
    { maxBuffer: 32 * 1024 * 1024 },
  )
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(result.stderr.toString())
  return result.stdout
}
const report = JSON.parse(
  await readFile(path.join(output, 'render-report.json'), 'utf8'),
)
if (report.decodeExitCode !== 0 || report.frameCount !== 1320)
  throw new Error('Missing full decode verification.')
const hashes = run(['-i', video, '-an', '-vf', 'fps=4', '-f', 'framemd5', '-'])
  .toString()
  .split('\n')
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => line.split(',').at(-1).trim())
const unique = new Set(hashes).size
if (hashes.length !== settings.duration * 4 || unique !== hashes.length)
  throw new Error('A sampled frame is missing or frozen.')
const pcm = run([
  '-i',
  video,
  '-vn',
  '-ac',
  '2',
  '-ar',
  '48000',
  '-f',
  'f32le',
  '-',
])
const perSecond = []
let absolutePeak = 0
for (let second = 0; second < 22; second++) {
  let square = 0
  let count = 0
  for (
    let sample = second * 96000;
    sample < (second + 1) * 96000 && sample * 4 + 4 <= pcm.length;
    sample++
  ) {
    const value = pcm.readFloatLE(sample * 4)
    square += value * value
    absolutePeak = Math.max(absolutePeak, Math.abs(value))
    count++
  }
  perSecond.push(
    Number((20 * Math.log10(Math.sqrt(square / count) || 1e-10)).toFixed(2)),
  )
}
if (!(
  perSecond[19] > perSecond[20] &&
  perSecond[20] > perSecond[21] &&
  perSecond[21] < -45
))
  throw new Error('The closing music does not decay to a quiet ending.')
if (absolutePeak >= 1) throw new Error('The decoded soundtrack clips.')
for (const [i, second] of reviewTimes.entries()) {
  run([
    '-y',
    '-ss',
    String(second),
    '-i',
    video,
    '-frames:v',
    '1',
    path.join(output, `encoded-scene-${i + 1}.png`),
  ])
}
const final = {
  sampledFrames: hashes.length,
  uniqueSampledFrames: unique,
  stereoPeakDbFS: Number((20 * Math.log10(absolutePeak)).toFixed(2)),
  rmsDbFSBySecond: perSecond,
  encodedReviewFrames: reviewTimes,
  fullDecodeFrames: report.frameCount,
  fullDecodeExitCode: report.decodeExitCode,
}
await writeFile(
  path.join(output, 'motion-audio-check.json'),
  JSON.stringify(final, null, 2),
)
log(final)

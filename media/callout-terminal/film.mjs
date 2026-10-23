export const settings = { width: 1080, height: 1350, fps: 30, duration: 33 }

const C = {
  paper: '#dff8eb',
  ink: '#061b15',
  panel: '#09271e',
  panel2: '#10392c',
  line: '#27513f',
  mint: '#9fffd0',
  white: '#edfff5',
  muted: '#92b5a2',
  dark: '#03100c',
}
const clamp = (x) => Math.max(0, Math.min(1, x))
const ease = (x) => 1 - (1 - clamp(x)) ** 3
const amount = (x) => '$' + Math.round(x).toLocaleString('en-US')
const phases = [0, 3.5, 6.5, 13.5, 18.5, 24.5, 28, 33]
const names = [
  'THE ORDER',
  'INDEX THE SOURCE',
  'THE MARKED ONES',
  'COMPARE RECORDS',
  'TRACE THE CALL',
  'KEEP YOUR SHORTLIST',
  'CALLOUT',
]

export function createFilm(data, atlas) {
  const rows = data.callers
  const total = rows.reduce((sum, row) => sum + row.rewards, 0)
  const maxReward = Math.max(...rows.map((row) => row.rewards))
  return function draw(ctx, time) {
    const t = Math.max(0, Math.min(time, settings.duration - 0.001))
    const phase = phases.findIndex(
      (start, index) => t >= start && t < phases[index + 1],
    )
    const local = t - phases[phase]
    const opacity = Math.min(
      ease(local / 0.22),
      ease((phases[phase + 1] - t) / 0.2),
    )
    ctx.save()
    ctx.fillStyle = C.paper
    ctx.fillRect(0, 0, 1080, 1350)
    ctx.fillStyle = C.ink
    ctx.fillRect(24, 24, 1032, 1302)
    ctx.strokeStyle = C.line
    ctx.lineWidth = 1
    ctx.strokeRect(36, 36, 1008, 1278)

    // Deterministic moving field. No external clock, randomness or network feed.
    ctx.save()
    ctx.beginPath()
    ctx.rect(37, 115, 1006, 1125)
    ctx.clip()
    for (let i = 0; i < 64; i++) {
      const x = 55 + ((i * 197 + t * (7 + (i % 5))) % 965)
      const y = 130 + ((i * 263 + t * 17) % 1080)
      ctx.globalAlpha = 0.08 + (i % 4) * 0.015
      ctx.fillStyle = C.mint
      ctx.fillRect(x, y, 3 + (i % 2), 3 + (i % 2))
    }
    ctx.globalAlpha = 0.1
    ctx.strokeStyle = C.line
    for (let x = 56; x < 1044; x += 44) {
      ctx.beginPath()
      ctx.moveTo(x, 114)
      ctx.lineTo(x, 1240)
      ctx.stroke()
    }
    for (let y = 136; y < 1240; y += 44) {
      ctx.beginPath()
      ctx.moveTo(36, y)
      ctx.lineTo(1044, y)
      ctx.stroke()
    }
    const scan = 120 + ((t * 70) % 1110)
    const beam = ctx.createLinearGradient(0, scan - 30, 0, scan + 5)
    beam.addColorStop(0, 'rgba(159,255,208,0)')
    beam.addColorStop(1, 'rgba(159,255,208,0.055)')
    ctx.fillStyle = beam
    ctx.fillRect(37, scan - 30, 1006, 35)
    ctx.restore()

    function text(
      value,
      x,
      y,
      size = 28,
      color = C.white,
      weight = 400,
      align = 'left',
      family = 'Grotesk',
    ) {
      ctx.fillStyle = color
      ctx.font = `${weight} ${size}px ${family}`
      ctx.textAlign = align
      ctx.textBaseline = 'alphabetic'
      ctx.fillText(String(value), x, y)
    }
    function line(x1, y1, x2, y2, color = C.line, width = 1) {
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
    function box(x, y, w, h, fill = C.panel, border = C.line) {
      ctx.fillStyle = fill
      ctx.fillRect(x, y, w, h)
      ctx.strokeStyle = border
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, w, h)
    }
    function paragraph(
      value,
      x,
      y,
      width,
      size = 28,
      color = C.muted,
      spacing = 39,
    ) {
      ctx.font = `400 ${size}px Grotesk`
      let current = ''
      let offset = 0
      for (const word of value.split(' ')) {
        const next = current ? `${current} ${word}` : word
        if (ctx.measureText(next).width > width && current) {
          text(current, x, y + offset, size, color)
          offset += spacing
          current = word
        } else current = next
      }
      if (current) text(current, x, y + offset, size, color)
    }
    function mark(x, y, size, progress = 1) {
      ctx.save()
      ctx.translate(x, y)
      ctx.scale(size / 48, size / 48)
      const points = [
        [22, 4],
        [26, 4],
        [26, 9],
        [30, 9],
        [30, 16],
        [34, 16],
        [34, 23],
        [38, 23],
        [38, 30],
        [42, 30],
        [42, 40],
        [6, 40],
        [6, 30],
        [10, 30],
        [10, 23],
        [14, 23],
        [14, 16],
        [18, 16],
        [18, 9],
        [22, 9],
        [22, 4],
      ]
      const visible = Math.min(
        points.length - 1,
        Math.floor(progress * (points.length - 1)),
      )
      ctx.beginPath()
      ctx.moveTo(...points[0])
      for (let i = 1; i <= visible; i++) ctx.lineTo(...points[i])
      ctx.strokeStyle = C.mint
      ctx.lineWidth = 2
      ctx.stroke()
      if (progress > 0.8) {
        ctx.globalAlpha *= clamp((progress - 0.8) / 0.2)
        ctx.fillStyle = C.mint
        ctx.beginPath()
        ctx.moveTo(24, 18)
        ctx.lineTo(33, 35)
        ctx.lineTo(15, 35)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()
    }
    function portrait(index, x, y, size) {
      ctx.save()
      ctx.imageSmoothingEnabled = false
      ctx.fillStyle = C.paper
      ctx.fillRect(x, y, size, size)
      const column = atlas.width / 5
      ctx.beginPath()
      ctx.rect(x, y, size, size)
      ctx.clip()
      // Same five-column atlas and crop as the website's square portraits.
      const sourceSize = Math.min(column, atlas.height)
      ctx.drawImage(
        atlas,
        column * index + (column - sourceSize) / 2,
        (atlas.height - sourceSize) / 2,
        sourceSize,
        sourceSize,
        x,
        y,
        size,
        size,
      )
      ctx.restore()
    }
    function typed(value, x, y, elapsed, size = 26) {
      const length = Math.max(0, Math.floor(elapsed * 33))
      text(value.slice(0, length), x, y, size, C.mint, 400, 'left', 'Terminal')
      if (Math.floor(t * 2.5) % 2 === 0) {
        ctx.font = `400 ${size}px Terminal`
        const width = ctx.measureText(value.slice(0, length)).width
        ctx.fillStyle = C.mint
        ctx.fillRect(x + width + 5, y - size + 3, size * 0.56, size)
      }
    }
    function bracket(x, y, w, h, progress) {
      ctx.save()
      ctx.globalAlpha *= progress
      const len = 18
      const points = [
        [x, y, 1, 1],
        [x + w, y, -1, 1],
        [x, y + h, 1, -1],
        [x + w, y + h, -1, -1],
      ]
      for (const [px, py, dx, dy] of points) {
        line(px, py, px + dx * len, py, C.mint, 3)
        line(px, py, px, py + dy * len, C.mint, 3)
      }
      ctx.restore()
    }
    function headline(top, bottom, subtitle) {
      text(top, 78, 232, 65, C.white, 600)
      if (bottom) text(bottom, 78, 304, 65, C.mint, 600)
      if (subtitle) text(subtitle, 78, bottom ? 350 : 282, 25, C.muted)
    }

    mark(66, 55, 36)
    text('CALLOUT', 116, 83, 31, C.white, 400, 'left', 'Pixel')
    text('SOURCE PLAYBACK', 1000, 80, 19, C.mint, 500, 'right', 'Terminal')
    line(60, 111, 1020, 111)
    ctx.save()
    ctx.globalAlpha *= opacity
    text(
      `0${phase + 1} / ${names[phase]}`,
      78,
      167,
      22,
      C.muted,
      400,
      'left',
      'Terminal',
    )

    if (phase === 0) {
      const intro = ease(local / 0.7)
      ctx.save()
      ctx.globalAlpha *= intro
      ctx.translate(0, 25 * (1 - intro))
      headline('SHOW THE', 'RECEIPTS.', '')
      mark(310, 390, 460, ease(local / 1.5))
      for (let i = 0; i < 4; i++) {
        ctx.save()
        ctx.globalAlpha *= 0.15 * (1 - clamp(local / 3.5))
        ctx.strokeStyle = C.mint
        ctx.strokeRect(150 - i * 22, 370 - i * 22, 780 + i * 44, 530 + i * 44)
        ctx.restore()
      }
      typed('> open the_callout_order', 98, 1000, local - 0.5, 29)
      text('CALLERS / REWARDS / ORIGINAL SOURCES', 98, 1060, 25, C.muted)
      ctx.restore()
    }
    if (phase === 1) {
      headline('READ THE', 'SOURCE.', '')
      const progress = ease(local / 2.5)
      box(78, 410, 924, 180)
      text('CALLOUT REWARDS', 106, 456, 24, C.muted, 400, 'left', 'Terminal')
      text(amount(total * progress), 106, 548, 82, C.mint, 500)
      text('Combined value of five source rows', 104, 640, 28, C.muted)
      box(78, 720, 924, 64, C.dark)
      ctx.fillStyle = C.mint
      ctx.fillRect(88, 730, 904 * progress, 44)
      text(
        `${Math.round(progress * 100)}%`,
        1000,
        844,
        28,
        C.mint,
        500,
        'right',
        'Terminal',
      )
      typed('> read rewards_table --rows 5', 98, 943, local - 0.1)
      typed('> keep original source attached', 98, 1003, local - 1)
    }
    if (phase === 2) {
      headline(
        'THE MARKED ONES.',
        '',
        'Five source records. Every number attached.',
      )
      const sorting = ease((local - 3.6) / 0.65)
      const target = [...rows].sort((a, b) => b.followers - a.followers)
      rows.forEach((row, index) => {
        const entry = ease((local - index * 0.32) / 0.5)
        const targetIndex = target.findIndex((item) => item.id === row.id)
        const order = index + (targetIndex - index) * sorting
        const y = 325 + order * 127
        ctx.save()
        ctx.globalAlpha *= entry
        ctx.translate((1 - entry) * 60, 0)
        box(78, y, 924, 112, index === 0 ? C.panel2 : C.panel)
        portrait(index, 96, y + 22, 64)
        text(row.name, 183, y + 44, 31, C.white, 500)
        text(amount(row.rewards * entry), 978, y + 44, 31, C.mint, 500, 'right')
        text(
          `${row.followers.toLocaleString('en-US')} followers in snapshot`,
          184,
          y + 76,
          20,
          C.muted,
        )
        ctx.fillStyle = C.line
        ctx.fillRect(184, y + 93, 790, 3)
        ctx.fillStyle = C.mint
        ctx.fillRect(184, y + 93, ((790 * row.rewards) / maxReward) * entry, 3)
        ctx.restore()
      })
      text(
        sorting < 0.5 ? 'SORT / SOURCE REWARDS' : 'SORT / FOLLOWERS',
        80,
        1015,
        24,
        C.mint,
        400,
        'left',
        'Terminal',
      )
      typed(
        sorting < 0.5 ? '> rank --by rewards' : '> sort --by followers',
        98,
        1084,
        local - 0.5,
      )
      text('Order artwork / source display names', 98, 1140, 22, C.muted)
    }
    if (phase === 3) {
      headline('COMPARE THE', 'RECORD.', '')
      const compared = [rows[0], rows[3]]
      compared.forEach((row, index) => {
        const enter = ease((local - index * 0.3) / 0.6)
        const x = 78 + index * 478
        ctx.save()
        ctx.globalAlpha *= enter
        ctx.translate(index ? 50 * (1 - enter) : -50 * (1 - enter), 0)
        box(x, 400, 446, 570)
        portrait(index ? 3 : 0, x + 28, 432, 90)
        text(row.name, x + 28, 575, 34, C.white, 600)
        text(
          'CALLOUT REWARDS',
          x + 28,
          628,
          21,
          C.muted,
          400,
          'left',
          'Terminal',
        )
        text(amount(row.rewards), x + 28, 688, 45, C.mint, 500)
        line(x + 28, 723, x + 418, 723)
        text(
          'FOLLOWERS IN SOURCE',
          x + 28,
          764,
          20,
          C.muted,
          400,
          'left',
          'Terminal',
        )
        text(row.followers.toLocaleString('en-US'), x + 28, 812, 34, C.white)
        text(
          'MEDIAN GAIN IN SOURCE',
          x + 28,
          868,
          20,
          C.muted,
          400,
          'left',
          'Terminal',
        )
        text(`${row.median.toFixed(1)}×`, x + 28, 930, 52, C.white, 500)
        bracket(x + 15, 842, 416, 112, ease((local - 1.3) / 0.3))
        ctx.restore()
      })
      text(
        'Source gain statistics exclude callouts above $500M.',
        78,
        1026,
        23,
        C.muted,
      )
      typed('> compare chairman cupsey', 98, 1110, local - 0.1)
    }
    if (phase === 4) {
      headline('TRACE THE', 'CALL.', '')
      data.signals.forEach((signal, index) => {
        const enter = ease((local - index * 0.65) / 0.55)
        const y = 390 + index * 229
        ctx.save()
        ctx.globalAlpha *= enter
        ctx.translate(40 * (1 - enter), 0)
        box(78, y, 924, 200)
        text(signal.caller, 107, y + 47, 28, C.muted)
        text(`$${signal.symbol}`, 107, y + 104, 48, C.mint, 500)
        text(
          'ORIGINAL POST',
          973,
          y + 47,
          19,
          C.muted,
          400,
          'right',
          'Terminal',
        )
        text('pump.fun', 940, y + 100, 29, C.white, 500, 'right')
        line(956, y + 98, 976, y + 78, C.white, 2)
        line(959, y + 78, 976, y + 78, C.white, 2)
        line(976, y + 78, 976, y + 95, C.white, 2)
        line(107, y + 130, 973, y + 130)
        text(
          `${signal.mint.slice(0, 16)}…${signal.mint.slice(-8)}`,
          107,
          y + 170,
          25,
          C.muted,
          400,
          'left',
          'Terminal',
        )
        ctx.restore()
      })
      const xPoints = [130, 540, 950]
      const labels = ['CALLER', 'ARCHIVE', 'ORIGINAL']
      line(130, 964, 950, 964, C.line, 3)
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = C.panel2
        ctx.fillRect(xPoints[i] - 15, 949, 30, 30)
        ctx.strokeStyle = C.mint
        ctx.strokeRect(xPoints[i] - 15, 949, 30, 30)
        text(
          labels[i],
          xPoints[i],
          1021,
          22,
          C.muted,
          400,
          'center',
          'Terminal',
        )
      }
      const packet = clamp((local - 1.8) / 2.1)
      ctx.fillStyle = C.mint
      ctx.fillRect(130 + 820 * packet - 7, 957, 14, 14)
      typed('> follow signal --to original', 98, 1110, local - 0.2)
    }
    if (phase === 5) {
      headline('KEEP YOUR', 'SHORTLIST.', '')
      ;[rows[0], rows[3]].forEach((row, index) => {
        const y = 430 + index * 185
        const enter = ease((local - index * 0.45) / 0.4)
        ctx.save()
        ctx.globalAlpha *= enter
        box(78, y, 924, 144)
        portrait(index ? 3 : 0, 105, y + 30, 80)
        text(row.name, 215, y + 61, 35, C.white, 500)
        text(amount(row.rewards), 215, y + 106, 29, C.muted)
        const filled = local > 0.6 + index * 0.6
        ctx.beginPath()
        ctx.moveTo(925, y + 42)
        ctx.lineTo(959, y + 42)
        ctx.lineTo(959, y + 100)
        ctx.lineTo(942, y + 86)
        ctx.lineTo(925, y + 100)
        ctx.closePath()
        ctx.strokeStyle = C.mint
        ctx.lineWidth = 3
        ctx.stroke()
        if (filled) {
          ctx.fillStyle = C.mint
          ctx.fill()
        }
        ctx.restore()
      })
      text(
        local > 1.3 ? '02 RECORDS SAVED' : 'SAVING YOUR RECORDS',
        78,
        875,
        30,
        C.mint,
        500,
        'left',
        'Terminal',
      )
      paragraph(
        'Your callers. Your sources. Saved in your browser.',
        78,
        944,
        800,
        32,
        C.white,
        46,
      )
      typed('> save --to reading-list', 98, 1110, local - 0.1)
    }
    if (phase === 6) {
      const enter = ease(local / 0.8)
      ctx.save()
      ctx.translate(0, 30 * (1 - enter))
      ctx.globalAlpha *= enter
      mark(410, 258, 260)
      text('CALLOUT', 540, 680, 146, C.mint, 400, 'center', 'Pixel')
      text('ENTER THE ORDER.', 540, 775, 57, C.white, 600, 'center')
      text(
        'Explore the callers. Follow the sources.',
        540,
        840,
        30,
        C.muted,
        400,
        'center',
      )
      box(171, 930, 738, 94, C.mint, C.mint)
      text('EXPLORE THE RECORD  >', 540, 990, 31, C.ink, 600, 'center')
      typed('> the_callout_order', 260, 1110, local - 0.4, 28)
      ctx.restore()
    }
    ctx.restore()

    line(60, 1198, 1020, 1198)
    text(
      'HISTORICAL SOURCE RECORDS / SOLANA',
      78,
      1237,
      19,
      C.muted,
      400,
      'left',
      'Terminal',
    )
    text(
      'Rewards table transcribed Oct 12, 2026 · Independent community project',
      78,
      1270,
      18,
      C.muted,
    )
    for (let i = 0; i < 7; i++) {
      const x = 78 + i * 132
      ctx.fillStyle = i <= phase ? C.mint : C.line
      ctx.fillRect(x, 1292, i === 6 ? 132 : 116, 4)
    }
    text(
      `${t.toFixed(1).padStart(4, '0')} / 33`,
      1002,
      1168,
      19,
      C.muted,
      400,
      'right',
      'Terminal',
    )
    // Single scene handoff sweep; the whole image never strobes.
    if (local < 0.2) {
      ctx.save()
      ctx.globalAlpha = (1 - local / 0.2) * 0.14
      ctx.fillStyle = C.mint
      ctx.fillRect(37, 115 + local * 4000, 1006, 3)
      ctx.restore()
    }
    if (t > 32.5) {
      ctx.fillStyle = `rgba(6,27,21,${clamp((t - 32.5) / 0.5)})`
      ctx.fillRect(24, 24, 1032, 1302)
    }
    ctx.restore()
  }
}

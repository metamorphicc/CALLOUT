export const settings = { width: 1920, height: 1080, fps: 60, duration: 22 }
export const cuts = [0, 2.5, 5.5, 9, 12.5, 16.5, 19, 22]
export const reviewTimes = [1.6, 4, 7.4, 10.8, 14.8, 17.8, 20.5]

const clamp = (v) => Math.max(0, Math.min(1, v))
const ease = (v) => 1 - (1 - clamp(v)) ** 4
const smooth = (v) => clamp(v) ** 2 * (3 - 2 * clamp(v))
const mix = (a, b, p) => a + (b - a) * p
const ink = '#102b23'
const muted = '#4d7766'

// All screen textures are actual captures. Only the camera and editorial layer move.
export function createFilm(images) {
  return function draw(ctx, time) {
    const t = Math.max(0, Math.min(settings.duration - 0.001, time))
    ctx.save()
    ctx.fillStyle = '#fbfefc'
    ctx.fillRect(0, 0, 1920, 1080)
    const glow = ctx.createRadialGradient(
      960 + Math.sin(t * 0.35) * 220,
      1260,
      40,
      960,
      1140,
      1250,
    )
    glow.addColorStop(0, '#85eab6')
    glow.addColorStop(0.4, '#c6f5dd')
    glow.addColorStop(1, 'rgba(243,253,247,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, 1920, 1080)

    function text(value, x, y, size, options = {}) {
      ctx.save()
      ctx.fillStyle = options.color || ink
      ctx.font = `${options.weight || 600} ${size}px ${options.pixel ? 'Pixel' : 'Grotesk'}`
      ctx.textAlign = options.align || 'left'
      ctx.textBaseline = 'alphabetic'
      ctx.fillText(value, x, y)
      ctx.restore()
    }
    function rounded(x, y, w, h, r = 20) {
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, r)
    }
    function line(x1, y1, x2, y2, color, width = 2) {
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
    function mark(x, y, size, color = ink) {
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
      ]
      ctx.save()
      ctx.translate(x, y)
      ctx.scale(size / 48, size / 48)
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.lineJoin = 'miter'
      ctx.beginPath()
      points.forEach(([px, py], i) =>
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py),
      )
      ctx.closePath()
      ctx.stroke()
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(24, 18)
      ctx.lineTo(33, 35)
      ctx.lineTo(15, 35)
      ctx.fill()
      ctx.restore()
    }
    function title(
      lines,
      local,
      x = 960,
      y = 155,
      size = 94,
      align = 'center',
    ) {
      lines.forEach((value, i) => {
        const enter = ease((local - i * 0.09) / 0.55)
        ctx.save()
        ctx.globalAlpha *= enter
        text(value, x, y + i * size * 1.03 + 42 * (1 - enter), size, { align })
        ctx.restore()
      })
    }
    function portrait(index, x, y, w, alpha = 1) {
      const cell = images.atlas.width / 5
      ctx.save()
      ctx.globalAlpha *= alpha
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(
        images.atlas,
        index * cell,
        135,
        cell,
        525,
        x,
        y,
        w,
        (w * 525) / cell,
      )
      ctx.restore()
    }
    function floor(x, y, w) {
      ctx.save()
      const shadow = ctx.createRadialGradient(
        x,
        y + 48,
        10,
        x,
        y + 48,
        w * 0.62,
      )
      shadow.addColorStop(0, 'rgba(11,104,64,0.16)')
      shadow.addColorStop(1, 'rgba(11,104,64,0)')
      ctx.scale(1, 0.24)
      ctx.fillStyle = shadow
      ctx.fillRect(x - w, (y + 48) / 0.24 - w, w * 2, w * 2)
      ctx.restore()
      const side = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0)
      side.addColorStop(0, '#70ca9f')
      side.addColorStop(0.2, '#c1f4dc')
      side.addColorStop(0.65, '#f1fff7')
      side.addColorStop(1, '#79d7aa')
      ctx.fillStyle = side
      ctx.fillRect(x - w / 2, y, w, 75)
      ctx.beginPath()
      ctx.ellipse(x, y + 75, w / 2, 52, 0, 0, Math.PI)
      ctx.fill()
      ctx.fillStyle = '#e6fff2'
      ctx.beginPath()
      ctx.ellipse(x, y, w / 2, 52, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#91d9b5'
      ctx.lineWidth = 2
      ctx.stroke()
    }
    function screen(name, x, y, w, options = {}) {
      const image = images[name]
      const crop = options.crop || [0, 0, image.width - 16, image.height]
      const h = (w * crop[3]) / crop[2]
      const bar = options.chrome === false ? 0 : 38
      ctx.save()
      ctx.translate(x + w / 2, y + (h + bar) / 2)
      ctx.rotate(options.angle || 0)
      ctx.transform(1, options.skew || 0, 0, 1, 0, 0)
      ctx.translate(-w / 2, -(h + bar) / 2)
      ctx.shadowColor = 'rgba(22,89,59,0.17)'
      ctx.shadowBlur = 68
      ctx.shadowOffsetY = 32
      rounded(-3, -3, w + 6, h + bar + 6, 22)
      ctx.fillStyle = '#f5fff9'
      ctx.fill()
      ctx.shadowColor = 'transparent'
      rounded(0, 0, w, h + bar, 20)
      ctx.clip()
      ctx.fillStyle = '#eff9f3'
      ctx.fillRect(0, 0, w, bar)
      if (bar) {
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.arc(20 + i * 16, 19, 4, 0, Math.PI * 2)
          ctx.fillStyle = ['#abcdbb', '#c4dfcf', '#d8ebdf'][i]
          ctx.fill()
        }
        text('THE CALLOUT ORDER', w / 2, 25, 13, {
          color: muted,
          weight: 500,
          align: 'center',
        })
      }
      ctx.drawImage(image, ...crop, 0, bar, w, h)
      ctx.restore()
      return h + bar
    }
    function phone(name, x, y, h, angle = 0) {
      const image = images[name]
      const sw = image.width - 16
      const w = (h * sw) / image.height + 22
      ctx.save()
      ctx.translate(x + w / 2, y + h / 2)
      ctx.rotate(angle)
      ctx.translate(-w / 2, -h / 2)
      ctx.shadowColor = 'rgba(4,62,35,0.24)'
      ctx.shadowBlur = 65
      ctx.shadowOffsetY = 30
      rounded(-3, -3, w + 6, h + 6, 45)
      ctx.fillStyle = '#a8bcb2'
      ctx.fill()
      ctx.shadowColor = 'transparent'
      rounded(0, 0, w, h, 43)
      ctx.fillStyle = '#10251c'
      ctx.fill()
      rounded(10, 10, w - 20, h - 20, 34)
      ctx.clip()
      ctx.drawImage(image, 0, 0, sw, image.height, 10, 10, w - 20, h - 20)
      ctx.restore()
      return w
    }
    function pointer(x, y, progress, scale = 1) {
      ctx.save()
      ctx.translate(x, y)
      ctx.scale(scale, scale)
      ctx.shadowColor = 'rgba(0,0,0,0.2)'
      ctx.shadowBlur = 8
      ctx.fillStyle = ink
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(0, 35)
      ctx.lineTo(10, 27)
      ctx.lineTo(20, 44)
      ctx.lineTo(29, 39)
      ctx.lineTo(19, 23)
      ctx.lineTo(33, 21)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      if (progress >= 0 && progress < 1) {
        ctx.shadowColor = 'transparent'
        ctx.strokeStyle = `rgba(18,136,80,${1 - progress})`
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(0, 0, 12 + progress * 60, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.restore()
    }

    // Sparse moving pixel motes tie the clean reference direction to the brand.
    ctx.save()
    for (let i = 0; i < 18; i++) {
      const x = (i * 313 + Math.sin(t * 0.3 + i) * 24) % 1920
      const y = (i * 197 - t * (7 + (i % 4)) + 2160) % 1080
      ctx.globalAlpha = 0.04 + (i % 3) * 0.025
      ctx.fillStyle = '#2aa56c'
      ctx.fillRect(x, y, i % 3 === 0 ? 8 : 4, i % 3 === 0 ? 8 : 4)
    }
    ctx.restore()

    function scene(index, local) {
      const p = clamp(local / (cuts[index + 1] - cuts[index]))
      if (index === 0) {
        title(['Meet the'], local, 960, 152, 62)
        title(['Marked Ones.'], local - 0.12, 960, 290, 132)
        const enter = ease(local / 0.8)
        floor(960, 830 + 100 * (1 - enter), 1390)
        const names = [
          'chairman',
          'slingoor',
          'Dior',
          'cupsey',
          'jackduvalcalls',
        ]
        for (let i = 0; i < 5; i++) {
          const show = ease((local - 0.12 - i * 0.1) / 0.6)
          const w = i === 2 ? 322 : 282
          const x = 228 + i * 300 - (i === 2 ? 20 : 0)
          const y =
            510 -
            (i === 2 ? 30 : 0) +
            110 * (1 - show) +
            Math.sin(t * 2.2 + i) * 7
          portrait(i, x, y, w, show)
          ctx.save()
          ctx.globalAlpha = show
          text(names[i], x + w / 2, 933, 24, { weight: 500, align: 'center' })
          ctx.restore()
        }
      } else if (index === 1) {
        title(['See the whole Order.'], local)
        const enter = ease(local / 0.7)
        const w = mix(1210, 1290, smooth(p))
        screen(
          'overview',
          (1920 - w) / 2,
          250 + 210 * (1 - enter) - p * 22,
          w,
          { angle: mix(0.025, -0.012, ease(p)), skew: -0.009 },
        )
      } else if (index === 2) {
        title(['Know the caller.'], local)
        const enter = ease(local / 0.7)
        screen(
          'directory',
          120 - 180 * (1 - enter) - p * 25,
          350 + Math.sin(t) * 10,
          1160 + p * 40,
          { crop: [245, 286, 1135, 520], angle: -0.018 + p * 0.02 },
        )
        phone(
          'profile-mobile',
          1370 + 350 * (1 - enter),
          220 - p * 24,
          830,
          -0.05 + p * 0.025,
        )
        text('SOURCE PROFILES / CALLER DIRECTORY', 135, 992, 22, {
          color: muted,
          weight: 500,
        })
      } else if (index === 3) {
        title(['Compare the record.'], local)
        const enter = ease(local / 0.65)
        const w = 620 + p * 18
        screen('compare', 295 - 240 * (1 - enter) - p * 15, 280 + p * 5, w, {
          crop: [257, 228, 550, 580],
          angle: -0.025 + p * 0.018,
          chrome: false,
        })
        screen('compare', 1005 + 240 * (1 - enter) - p * 5, 280 - p * 5, w, {
          crop: [826, 228, 550, 580],
          angle: 0.025 - p * 0.018,
          chrome: false,
        })
        const pulse = 0.15 + Math.sin(local * 3) * 0.08
        ctx.strokeStyle = `rgba(14,132,77,${pulse})`
        ctx.lineWidth = 3
        rounded(317, 641, 572, 80, 10)
        ctx.stroke()
        rounded(1025, 641, 572, 80, 10)
        ctx.stroke()
        text(
          'Historical source snapshot · Last 100 callouts · Excludes >$500M',
          960,
          1020,
          23,
          { align: 'center', color: muted, weight: 400 },
        )
      } else if (index === 4) {
        const enter = ease(local / 0.75)
        const phoneX = 300 - 360 * (1 - enter) + p * 30
        phone('signal-mobile', phoneX, 150 - p * 50, 1000, -0.035 + p * 0.04)
        title(['Follow the', 'signal.'], local, 925, 420, 106, 'left')
        const subtitle = ease((local - 0.75) / 0.6)
        ctx.save()
        ctx.globalAlpha *= subtitle
        text('Back to its source.', 930, 650 + 24 * (1 - subtitle), 50, {
          color: muted,
          weight: 400,
        })
        ctx.restore()
        const move = smooth((local - 0.8) / 0.8)
        const px = mix(855, phoneX + 100, move)
        const py = mix(1050, 882 - p * 50, move)
        if (local > 0.8) pointer(px, py, (local - 1.7) / 0.7, 1.2)
        if (local > 1.75) {
          const path = ease((local - 1.75) / 0.65)
          ctx.save()
          ctx.globalAlpha *= path
          line(740, 838, 960, 838, '#69b893', 2)
          ctx.fillStyle = ink
          rounded(985, 780 + 35 * (1 - path), 580, 116, 22)
          ctx.fill()
          text('ORIGINAL CALLOUT ↗', 1020, 828, 27, {
            color: '#d7ffe8',
            weight: 500,
          })
          text('pump.fun', 1020, 865, 25, { color: '#a8d9bd', weight: 400 })
          ctx.restore()
        }
      } else if (index === 5) {
        title(['Keep your', 'own shortlist.'], local, 125, 365, 100, 'left')
        const enter = ease(local / 0.65)
        screen('saved', 765 + 300 * (1 - enter), 370 - p * 22, 1010, {
          crop: [244, 80, 1150, 780],
          angle: 0.035 - p * 0.025,
        })
        phone(
          'saved-mobile',
          1305 + 300 * (1 - enter),
          175 - p * 24,
          850,
          -0.025 - p * 0.015,
        )
        text('CALLERS + ORIGINAL SIGNALS', 130, 685, 25, {
          color: muted,
          weight: 500,
        })
      } else {
        const enter = ease(local / 0.85)
        ctx.save()
        ctx.globalAlpha = 0.09 * enter
        screen('overview', 1150 + p * 90, -230 - p * 35, 1000, { angle: -0.12 })
        screen('compare', -390 - p * 90, 690 + p * 40, 1100, { angle: 0.1 })
        ctx.restore()
        ctx.save()
        ctx.globalAlpha = enter
        const zoom = 0.96 + 0.04 * enter + p * 0.015
        ctx.translate(960, 510 + (1 - enter) * 55)
        ctx.scale(zoom, zoom)
        mark(-710, -140, 240)
        text('CALLOUT', 130, 68, 244, {
          pixel: true,
          weight: 400,
          align: 'center',
        })
        text('Every signal leaves a mark.', 0, 192, 42, {
          align: 'center',
          weight: 400,
          color: muted,
        })
        ctx.restore()
      }
    }

    const index = cuts.findIndex((cut, i) => t >= cut && t < cuts[i + 1])
    // Brief overlapping handoffs keep the product moving without blank flashes.
    const transition = index > 0 ? smooth((t - cuts[index]) / 0.22) : 1
    if (transition < 1) {
      ctx.save()
      ctx.globalAlpha = 1 - transition
      scene(index - 1, cuts[index] - cuts[index - 1])
      ctx.restore()
    }
    ctx.save()
    ctx.globalAlpha = transition
    scene(index, t - cuts[index])
    ctx.restore()
    if (index > 0 && index < 6) {
      ctx.save()
      ctx.globalAlpha = 0.5
      mark(72, 53, 35)
      text('CALLOUT', 114, 80, 28, { pixel: true, weight: 400 })
      ctx.restore()
    }
    ctx.restore()
  }
}

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { log } from 'node:console'
import { execFileSync } from 'node:child_process'
import process from 'node:process'
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = path.join(root, 'dist')
const template = await readFile(path.join(dist, 'index.html'), 'utf8')
const server = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
})
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx')
  const { markedCallers } = await server.ssrLoadModule(
    '/src/features/marked-ones/data.ts',
  )
  const { publishedSignals } = await server.ssrLoadModule('/src/lib/catalog.ts')
  const { pageMetadata, siteOrigin } =
    await server.ssrLoadModule('/src/lib/seo.ts')
  const pages = [
    ['/', 'The Order at a glance.'],
    ['/callers', 'The Marked Ones'],
    ['/signals', 'Signal archive'],
    ['/saved', 'Your reading list'],
    ['/about', 'Inside the Order'],
    ['/community', 'Community desk'],
    ['/methodology', 'Sources & methodology'],
    ['/compare', 'Caller comparison'],
    ...markedCallers.map((caller) => [
      `/callers/${caller.id}`,
      caller.displayName,
    ]),
    ...publishedSignals.map((signal) => [
      `/signals/${signal.id}`,
      `$${signal.symbol}`,
    ]),
  ]
  for (const [route] of pages) {
    const markup = renderToString(
      createElement(
        MemoryRouter,
        { initialEntries: [route] },
        createElement(App),
      ),
    )
    if (
      /\b(demo|coming soon|concept art|awaiting launch|trading soon|chart soon|fictional examples)\b/i.test(
        markup,
      )
    )
      throw new Error(`Unpublished content on ${route}`)
    if (
      !markup.includes('workspace-shell') ||
      !markup.includes('workspace-navigation')
    )
      throw new Error(`Missing workspace on ${route}`)
    const escape = (value) =>
      value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
    const meta = pageMetadata(route)
    let html = template
      .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
      .replace(/<title>.*?<\/title>/, `<title>${escape(meta.title)}</title>`)
      .replace(
        /<link\s+rel="canonical"[^>]*>/,
        `<link rel="canonical" href="${escape(meta.canonical)}" />`,
      )
    for (const [kind, name, value] of [
      ['name', 'description', meta.description],
      ['name', 'robots', meta.robots],
      ['property', 'og:title', meta.title],
      ['property', 'og:description', meta.description],
      ['property', 'og:url', meta.canonical],
      ['name', 'twitter:title', meta.title],
      ['name', 'twitter:description', meta.description],
    ])
      html = html.replace(
        new RegExp(`<meta\\s+${kind}="${name}"[^>]*>`),
        `<meta ${kind}="${name}" content="${escape(value)}" />`,
      )
    const directory = path.join(dist, route)
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, 'index.html'), html)
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(([route]) => `<url><loc>${siteOrigin}${route}</loc></url>`).join('')}</urlset>`
  await writeFile(path.join(dist, 'sitemap.xml'), sitemap)
  let commit = process.env.VERCEL_GIT_COMMIT_SHA
  if (!commit) {
    try {
      commit = execFileSync('git', ['rev-parse', 'HEAD'], {
        cwd: root,
        encoding: 'utf8',
      }).trim()
    } catch {
      commit = null
    }
  }
  const { version } = JSON.parse(
    await readFile(path.join(root, 'package.json'), 'utf8'),
  )
  await writeFile(
    path.join(dist, 'release.json'),
    JSON.stringify(
      {
        version,
        commit,
        builtAt: new Date().toISOString(),
        publicRoutes: pages.length,
      },
      null,
      2,
    ),
  )
  log(`Pre-rendered ${pages.length} public routes.`)
} finally {
  await server.close()
}

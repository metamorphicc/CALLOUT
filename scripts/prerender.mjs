import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
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
  const pages = [
    ['/', 'Research overview'],
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
  for (const [route, title] of pages) {
    const markup = renderToString(
      createElement(
        MemoryRouter,
        { initialEntries: [route] },
        createElement(App),
      ),
    )
    if (/\b(demo|coming soon|concept art)\b/i.test(markup))
      throw new Error(`Unpublished content on ${route}`)
    const escapedTitle = title
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
    const html = template
      .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
      .replace(
        /<title>.*?<\/title>/,
        `<title>${escapedTitle} — The Callout Order</title>`,
      )
    const directory = path.join(dist, route)
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, 'index.html'), html)
  }
  console.log(`Pre-rendered ${pages.length} public routes.`)
} finally {
  await server.close()
}

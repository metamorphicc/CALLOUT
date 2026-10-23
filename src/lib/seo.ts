import { markedCallers } from '../features/marked-ones/data'
import { publishedSignals } from './catalog'

export const siteOrigin = 'https://callout-xi.vercel.app'
export function pageMetadata(pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/'
  const pages: Record<string, [string, string]> = {
    '/': [
      'Caller research & signal archive',
      'Explore the callers behind Callout Rewards. Compare recorded statistics, trace original signals and build your own research shortlist.',
    ],
    '/callers': [
      'The Marked Ones',
      'Search the CALLOUT caller directory, explore recorded rewards and compare up to three callers side by side.',
    ],
    '/compare': [
      'Compare callers',
      'Compare Callout Rewards, followers and source statistics. Choose your callers, share the comparison and export the record.',
    ],
    '/signals': [
      'Signal archive',
      'Search original callouts by token, mint or caller. Open the source, explore its author and save the signals you want to revisit.',
    ],
    '/saved': [
      'Your shortlist',
      'Keep caller profiles and original callouts in your personal CALLOUT reading list. Save locally and export your shortlist.',
    ],
    '/about': [
      'Inside the Order',
      'The people, the record and the identity behind The Callout Order. Every signal leaves a mark.',
    ],
    '/community': [
      'Community desk',
      'Propose a caller, contribute an original callout or request a correction through the CALLOUT community review.',
    ],
    '/methodology': [
      'Sources & methodology',
      'Read the source definitions behind Callout Rewards, caller statistics, original signal records and archive dates.',
    ],
  }
  const caller = markedCallers.find((item) => path === '/callers/' + item.id)
  const signal = publishedSignals.find((item) => path === '/signals/' + item.id)
  const record = caller
    ? [
        caller.displayName,
        'Explore ' +
          caller.displayName +
          ' on CALLOUT: recorded rewards, source statistics, original callouts and comparison tools.',
      ]
    : signal
      ? ['$' + signal.symbol + ' · ' + signal.callerId, signal.description]
      : pages[path]
  return {
    title: (record?.[0] ?? 'Page not found') + ' — The Callout Order',
    description:
      record?.[1] ??
      'This address does not match a record in The Callout Order.',
    canonical: siteOrigin + (path === '/' ? '/' : path),
    robots: record ? 'index, follow' : 'noindex, follow',
  }
}

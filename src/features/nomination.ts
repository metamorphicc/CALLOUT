export interface NominationDraft {
  twitterHandle: string
  calloutUrls: string[]
  status: 'draft'
}

export function validateNomination(
  handle: string,
  evidence: string,
): { draft?: NominationDraft; error?: string; field?: 'handle' | 'evidence' } {
  const twitterHandle = handle.trim().replace(/^@/, '')
  if (!/^[A-Za-z0-9_]{1,15}$/.test(twitterHandle))
    return {
      error:
        'Enter a Twitter handle using letters, numbers, or underscores (up to 15 characters).',
      field: 'handle',
    }
  const calloutUrls = [
    ...new Set(
      evidence
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    ),
  ]
  if (!calloutUrls.length || calloutUrls.length > 5)
    return {
      error: 'Add between one and five original callout links, one per line.',
      field: 'evidence',
    }
  for (const link of calloutUrls) {
    try {
      const url = new URL(link)
      const twitterPost =
        ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'].includes(
          url.hostname,
        ) && /^\/[A-Za-z0-9_]+\/status\/\d+\/?$/.test(url.pathname)
      const pumpPost =
        url.hostname === 'pump.fun' &&
        /^\/callouts\/[1-9A-HJ-NP-Za-km-z]{32,44}\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\/?$/i.test(
          url.pathname,
        )
      if (
        url.protocol !== 'https:' ||
        !(twitterPost || pumpPost) ||
        url.username ||
        url.password
      )
        return {
          error:
            'Use HTTPS links to original X/Twitter posts or Pump.fun callouts.',
          field: 'evidence',
        }
    } catch {
      return {
        error:
          'One link is invalid. Add full HTTPS links to the original callout posts.',
        field: 'evidence',
      }
    }
  }
  return { draft: { twitterHandle, calloutUrls, status: 'draft' } }
}

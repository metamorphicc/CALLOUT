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
      if (
        url.protocol !== 'https:' ||
        !['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'].includes(
          url.hostname,
        ) ||
        !/^\/[A-Za-z0-9_]+\/status\/\d+\/?$/.test(url.pathname) ||
        url.username ||
        url.password
      )
        return {
          error: 'Use HTTPS links to original posts on x.com or twitter.com.',
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

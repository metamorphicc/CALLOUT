import { project } from '../config/project'
import { ExternalLink } from './WorkspaceUI'

export default function CommunityLinks() {
  const links = [
    { name: 'X / Twitter', url: project.links.twitter },
    { name: 'Telegram', url: project.links.telegram },
    { name: 'Pump.fun', url: project.links.pump },
  ].filter((link): link is { name: string; url: string } => Boolean(link.url))
  return links.length ? (
    <nav aria-label="Community channels">
      {links.map((link) => (
        <ExternalLink href={link.url} key={link.name}>
          {link.name}
        </ExternalLink>
      ))}
    </nav>
  ) : null
}

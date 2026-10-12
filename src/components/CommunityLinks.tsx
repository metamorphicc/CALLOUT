import { project } from '../config/project'
import { Arrow } from './Mark'

const links = [
  { name: 'Twitter / X', url: project.links.twitter },
  { name: 'Telegram', url: project.links.telegram },
  { name: 'Pump.fun', url: project.links.pump },
]

export default function CommunityLinks() {
  return (
    <div className="community-links" aria-label="Community channels">
      {links.map((link) =>
        link.url ? (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.name}
            <Arrow diagonal />
          </a>
        ) : (
          <span className="channel-pending" key={link.name}>
            {link.name}
            <small>Coming soon</small>
          </span>
        ),
      )}
    </div>
  )
}

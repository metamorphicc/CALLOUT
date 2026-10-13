import { Arrow } from '../components/Mark'
import { Portrait } from '../components/Portrait'
import { SectionHead } from '../components/SectionHead'

export default function Genesis() {
  return (
    <section className="section genesis-section" id="genesis">
      <div className="container genesis-grid">
        <div
          className="genesis-gallery"
          aria-label="Genesis Collection concept preview"
        >
          {[0, 2, 4].map((index, position) => (
            <figure key={index} className={`nft-piece nft-piece--${position}`}>
              <div className="nft-piece-top">
                <span>GENESIS</span>
                <span>{String(position + 1).padStart(3, '0')}</span>
              </div>
              <Portrait index={index} />
              <figcaption>
                <strong>{['Watcher', 'Keeper', 'Seeker'][position]}</strong>
                <span>CONCEPT ART</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="genesis-copy">
          <SectionHead
            chapter="05 / THE GENESIS COLLECTION"
            title="The first chapter, in pixels."
            description="A collection of hooded portraits inspired by the callers who shaped the story. Each one carries the mark of the Order."
          />
          <span className="coming-soon">
            <span className="pixel-dot" />
            COMING SOON
          </span>
          <p className="collection-note">
            This is a first look at the art direction.
            <br />
            Mint details and collection access will follow.
          </p>
          <a className="text-link" href="#join">
            Be part of the next chapter <Arrow diagonal />
          </a>
        </div>
      </div>
    </section>
  )
}

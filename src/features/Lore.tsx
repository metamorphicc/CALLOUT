import { Mark, PixelStar } from '../components/Mark'
import { SectionHead } from '../components/SectionHead'

export default function Lore() {
  return (
    <section className="section lore-section" id="lore">
      <div className="container lore-grid">
        <div className="lore-copy">
          <SectionHead chapter="02 / THE LORE" title="First came the signal." />
          <p>
            Somewhere between a thousand scrolling charts and a million passing
            takes, an Order began to form. Its members shared one belief: a call
            should be remembered for what followed it.
          </p>
          <p>
            To be marked is to become part of that record. A name, a signal, a
            moment in the timeline. The first Marked Ones open the story; the
            next chapter is still unwritten.
          </p>
          <p>
            The hood is our symbol. The triangle is our seal. And the rule of
            the Order is simple:{' '}
            <strong>the outcome matters more than the noise.</strong>
          </p>
        </div>
        <figure className="lore-figure">
          <div className="lore-rune" aria-hidden="true">
            <PixelStar className="rune-star" />
            <div className="rune-grid" />
            <Mark />
            <span className="rune-corner rune-corner--one" />
            <span className="rune-corner rune-corner--two" />
          </div>
          <figcaption>
            <span>THE SEAL OF THE ORDER</span>
            <strong>
              A signal fades.
              <br />A mark remains.
            </strong>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

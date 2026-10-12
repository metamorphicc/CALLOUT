import { Arrow, Mark, PixelStar } from '../components/Mark'
import CommunityLinks from '../components/CommunityLinks'

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="pixel-dot" />A CALLER COMMUNITY. A CULTURE OF
            SIGNAL.
          </p>
          <h1>
            <span className="hero-the">THE</span>CALLOUT<span>ORDER</span>
          </h1>
          <p className="hero-tagline">Every signal leaves a mark.</p>
          <p className="hero-description">
            For the callers who cut through the noise.
            <br />A record of their rewards. A world of our own.
          </p>
          <div className="hero-actions">
            <a className="button button--ink" href="#marked-ones">
              Meet the marked <Arrow />
            </a>
            <a className="text-link" href="#lore">
              Discover the lore <Arrow diagonal />
            </a>
          </div>
          <CommunityLinks />
        </div>
        <div
          className="hero-scene"
          aria-label="Five illustrated hooded members beneath the triangular symbol of the Order"
          role="img"
        >
          <span className="scene-coordinate scene-coordinate--top">
            [ THE FIRST CHAPTER ]
          </span>
          <span className="scene-watermark" aria-hidden="true">
            CALLOUT
          </span>
          <div className="scene-seal">
            <Mark />
            <span className="seal-line seal-line--one" />
            <span className="seal-line seal-line--two" />
          </div>
          <PixelStar className="scene-star scene-star--one" />
          <PixelStar className="scene-star scene-star--two" />
          <PixelStar className="scene-star scene-star--three" />
          <span className="scene-pixel scene-pixel--one" />
          <span className="scene-pixel scene-pixel--two" />
          <img
            className="hero-lineup"
            src="/art/order-atlas.png"
            width="2172"
            height="724"
            alt=""
            fetchPriority="high"
          />
          <div className="scene-caption">
            <span className="pixel-dot" />
            FIVE CALLERS. ONE ORDER.
            <span className="pixel-dot" />
          </div>
        </div>
      </div>
      <div className="signal-strip">
        <div className="container">
          <span>
            <Mark /> FOLLOW THE SIGNAL
          </span>
          <span>REMEMBER THE CALLERS</span>
          <span>
            THE ORDER IS OPEN <Arrow diagonal />
          </span>
        </div>
      </div>
    </section>
  )
}

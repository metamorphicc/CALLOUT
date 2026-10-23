# CALLOUT product montage

A 22-second, 1920 × 1080, 60 fps product film built from actual desktop and mobile captures of the CALLOUT website. All text is English. The existing terminal film remains a separate creative direction.

## Reference study

The supplied 23-second reference uses a white-to-mint environment, a character introduction, floating product screens, short centered headlines, smooth camera pushes and a quiet closing hold. The reusable pattern is a quick introduction followed by one visible product action per shot. CALLOUT uses its own pixel characters, brand typography, source records and original synthesized soundtrack.

| Seconds   | Sequence                                                                                                        |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| 0–2.5     | Five Order characters arrive on a mint platform. “Meet the Marked Ones.”                                        |
| 2.5–5.5   | The real overview expands into frame. “See the whole Order.”                                                    |
| 5.5–9     | Caller directory and mobile profile move together. “Know the caller.”                                           |
| 9–12.5    | The real chairman / cupsey comparison is brought forward. “Compare the record.”                                 |
| 12.5–16.5 | A mobile source record and its original-source action move into focus. “Follow the signal. Back to its source.” |
| 16.5–19   | The actual saved-record screen is presented. “Keep your own shortlist.”                                         |
| 19–22     | Website fragments recede behind the CALLOUT wordmark. Music fades to silence.                                   |

## Captures and content

`assets/` contains browser screenshots taken on October 23, 2026 from the local website at `http://127.0.0.1:5187`. Desktop captures used a 1440 × 1000 browser viewport and mobile captures used 390 × 844; the browser capture surface excludes some chrome. The renderer uses the captured bitmap dimensions directly and excludes the scrollbar from device framing.

Routes captured: `/`, `/callers`, `/callers/cupsey`, `/compare?callers=chairman,cupsey`, `/signals/cupsey-csfun` and `/saved`. The saved state was created through the site's actual controls for filming, then restored to its original empty state. Screen content is not reconstructed or replaced with invented metrics. Camera motion, a pointer, highlights, character staging and typography are editorial overlays.

The source reward values are historical observations, not current payouts or trading returns. Existing Order portraits are project artwork. The film does not assert affiliation with Pump.fun or introduce a contract address, public deployment URL or token launch claim.

AICB was attempted through `aicb_whoami` and the `world` playbook. Both returned `invalid API key`; no AICB edit or cloud render was available. The local renderer completes the film independently.

## Reproduce

```powershell
npm ci
npm run montage:stills
npm run montage:render
npm run montage:verify
```

Generated MP4, self-contained HTML player, original WAV score, poster, review frames and verification reports go to `artifacts/promo-montage/`, which is excluded from Git. The HTML embeds the same animation, captured screens, project artwork, fonts and music. It works offline and includes play, pause, replay, seek and sound controls. Browser sound begins only after a user action.

`film.mjs` is the shared deterministic composition used by both HTML and MP4. `render.mjs` streams its frames to the bundled FFmpeg binary. The score is original synthesis; no audio or artwork is extracted from the reference video. `post.md` contains the accompanying X copy. Nothing is published automatically.

See `verification.md` for the final media and browser checks. `montage:verify` decodes the finished MP4 for sampled frame uniqueness, stereo audio peaks, the closing fade and encoded scene stills. It requires an existing render.

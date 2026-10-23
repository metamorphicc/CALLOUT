# CALLOUT terminal film

An original 33-second promotional animation for X. Output is 1080 × 1350 (4:5), 30 fps, H.264 / AAC in an MP4 with fast-start metadata.

## Reproduce

```powershell
npm ci
npm run promo:stills
npm run promo:render
```

Generated files are placed in `artifacts/promo/` and excluded from Git. Source, render tools, dependency versions and the post text are committed. Rendering uses the CPU and streams RGBA frames to the bundled FFmpeg binary without launching a browser.

- `callout-terminal.mp4`: finished video with original synthesized sound design.
- `callout-terminal.html`: self-contained animated HTML with embedded fonts and character art; includes Pause and Replay controls. No server or external requests are required. Reduced-motion preferences start it paused.
- `callout-terminal-poster.png`: preview image.
- `callout-frame-1.png` through `callout-frame-7.png`: scene review frames.
- `callout-terminal-score.wav`: original PCM sound design, without stock music or voiceover.
- `render-report.json`: render settings and complete video decode report.

The HTML presentation is silent; the MP4 includes the synthesized score. Both use `film.mjs` as their drawing engine, so rendering is independent of browser recording timing or dropped screen-capture frames.

## Sequence

| Seconds   | Action                                                                                    |
| --------- | ----------------------------------------------------------------------------------------- |
| 0–3.5     | The Order's pixel seal draws in, with the opening hook.                                   |
| 3.5–6.5   | Source rows are indexed and their recorded reward total resolves.                         |
| 6.5–13.5  | Five caller records enter, reward bars build, then rows move into follower order.         |
| 13.5–18.5 | Chairman and cupsey slide into comparison, with source statistics highlighted.            |
| 18.5–24.5 | Two original-source callouts appear; a packet travels from caller to archive to original. |
| 24.5–28   | A personal shortlist is assembled and bookmark marks fill.                                |
| 28–33     | The Order seal, wordmark and closing action resolve before the fade.                      |

Moving particles, a scanning beam, typed commands, counters, source paths and scene handoffs keep the terminal active. The terminal is an artistic promotional treatment of site features, not a claim that the website offers a CLI or a real-time blockchain scanner.

## Data and provenance

The renderer reads the actual caller source snapshot and signal catalog from the repository. The $1,279,630 total is the sum of five historical source reward values; it is not profit, token market capitalization or a new payout. Median gains are explicitly attributed to the source and retain its $500M exclusion note.

Character portraits are the project's existing Order artwork. The original-source URLs remain in the embedded HTML data. The video does not invent publication timestamps, token prices, trading returns or an official public website address.

The project font assets are embedded for the HTML and registered with the native canvas renderer. Space Grotesk, Tiny5 and IBM Plex Mono are distributed through their Fontsource packages. The sound is synthesized by the render script and uses no downloaded recordings.

`post.md` contains the accompanying English X post. Nothing is published automatically.

# Film verification

- Finished MP4: 33.00 seconds, 1080 × 1350, 30 fps, H.264 High / yuv420p, stereo AAC at 48 kHz.
- All 990 encoded frames decode successfully.
- A 4 fps motion sample contains 132 frames with 132 different decoded hashes. The film is animated throughout the sampled timeline.
- Final MP4 audio measures approximately -16.82 LUFS integrated and -3.96 dB true peak after AAC encoding. No clipping was found in this measurement.
- Seven scene stills were inspected for text size, source values, artwork and layout. A missing arrow glyph was replaced with a drawn arrow before the final render.
- The HTML loads all three embedded font families, has a 1080 × 1350 canvas, and reports no browser console warnings or errors.
- Pause and Replay controls were exercised in the browser. Replay restores animation playback.
- TypeScript, ESLint and repository formatting checks pass after the media tooling additions.

The HTML and video share the same drawing implementation. Final generated outputs and machine reports are in `artifacts/promo/`; they are ignored by Git and can be recreated with `npm run promo:render`.

Nothing was posted to X or pushed to the Git remote.

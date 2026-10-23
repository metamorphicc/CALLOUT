# Montage verification

Verified locally on October 23, 2026.

- MP4: 1920 × 1080, 60 fps, 22 seconds, H.264 High / AAC stereo, fast-start metadata.
- Complete decode: all 1,320 frames decoded successfully, exit code 0.
- Motion check: 88 frames sampled at 4 fps; all 88 hashes are unique.
- Encoded frames reviewed at 1.6, 4, 7.4, 10.8, 14.8, 17.8 and 20.5 seconds. Titles, screen framing, character staging and the final wordmark are visible. Product screens intentionally use cinematic crops.
- Stereo sample peak: −1.25 dBFS. Independent EBU R128 measurement: −15.8 LUFS integrated, −1.1 dBFS true peak, 3.1 LU loudness range.
- Closing audio RMS: −27.14, −40.62 and −67.73 dBFS across seconds 19–22. The final 50 ms of the original score are silent.
- HTML player: embedded images and fonts loaded; the embedded audio reports a 22-second duration. Play, pause, sound enable/mute and chapter seeking were exercised through the browser UI. Audio resumed at the selected scene time.
- Desktop player fits the available height. At 390 × 844, all buttons remain within the viewport and there is no horizontal overflow. The viewport override was reset after inspection.
- Browser console: no errors or warnings during the player check.
- The two shortlist records used for the capture were saved through the website UI and removed after capture, returning the browser's reading list to its original state.

Generated evidence is in the ignored `artifacts/promo-montage/` directory: `render-report.json`, `motion-audio-check.json`, seven `encoded-scene-*.png` images, `storyboard.png`, `player-browser.png` and `player-mobile.png`.

Repository checks: TypeScript, ESLint and Prettier. Website application source was not changed for this montage. All work is committed locally; no push or publication is performed.

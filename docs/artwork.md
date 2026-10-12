# Order artwork

`public/art/order-atlas.png` is a transparent sprite atlas generated with the built-in image generation tool. The project owner's Twitter banner was used as a style and color reference. The characters are fictional illustrated avatars, not verified likenesses or endorsements by the callers.

## Generation prompt

Use case: stylized-concept. Create ONE production-ready horizontal sprite atlas for The Callout Order website. The attached banner is a STYLE AND COLOR reference, not an edit target. Exactly five distinct 16-bit pixel-art hooded busts, in five equal-width tiles in a single horizontal row, completely transparent background. Image aspect ratio 5:1, each tile square. All busts same scale, baseline and centered in their tile with a small clear transparent margin; no overlapping figures or stray pixels outside each tile. From left to right: 1 black hoodie, black hair, sunglasses; 2 dark hoodie with prismatic emerald/violet iridescent fabric and sunglasses; 3 silver white hoodie and mysterious black mask; 4 royal-blue hoodie, blonde hair; 5 forest-green hoodie, dark hair. Their faces are fictional stylized character avatars, not actual likenesses. Detailed high-quality late-90s JRPG pixel sprite craft with crisp intentionally blocky black outlines, sophisticated shading, mint edge highlights. Broad shoulders, heads facing viewer, cropped at chest. No text, no logos, no labels, no coins, no frames, no backgrounds, no gradients outside sprites, no anti-aliased painterly brushwork. These will be used both as individual avatars through CSS sprite positioning and as a hero lineup, so equal tile layout and transparent gaps are essential.

## Integration

The actual output is 2172 × 724 pixels with an alpha channel. The site uses CSS background positions to display the individual characters without modifying the source image. The full image is used in the hero. The triangular mark and decorative pixel glyphs are code-native SVG.

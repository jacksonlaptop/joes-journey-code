# Joe's Journey companion alien asset pack

## Latest standalone pack — 8 September 2026

The current reviewed delivery is in `asset-pack-standalone/`. It contains 95 individually usable transparent PNG assets, grouped by body, face, hand slot and themed set. Download `alien-asset-pack-standalone.zip` for the same delivery as one file.

The latest catalogue and preview code is `layer-map.html`. Supporting generator code is in `generate-assets.mjs` and `render-assets.cjs`. The complete working history, source images and previews from the design session are preserved in `design-workbench/` so Claude can inspect or continue the work.

The sprite faces toward the viewer's right. Right-hand sword, staff, wand and paintbrush files include the correctly wrapped hand in each of the five body colours. Left-hand plush, phone and 8-bit alien files do the same. The shield is supplied without a hand because it covers that hand. Right-facing capes trail toward the viewer's left, and the space helmet includes its own antenna.

The assets listed below are the earlier registered 1024 × 1024 set retained for reference.

All PNG files use the same 1024 × 1024 transparent canvas. Place layers without resizing or repositioning them.

## Layer order

From back to front:

1. `back-*`
2. `body.png` or one `body-*` colour
3. `eyes-*-open.png` or `eyes-*-closed.png`
4. `mouth-*`
5. `eyewear-*`
6. One `hair-*`, `hat-*`, or `headfull-*` item
7. `hand-*` and `offhand-*`
8. `orbit-*`

`headfull-*` items replace hats and hair. Open and closed eye files share exact registration, so blinking only requires swapping the image source. The four `body-*` alternatives also share exact registration with `body.png`.

Hair is supplied as messy, mohawk and shaved-sides styles, each in brown, black and blue. `orbit-mars.png` and `orbit-jupiter.png` use the existing horizontal-scroll planet art and are intended to unlock when those planets are clicked.

The `preview-*` files are flattened reference images for checking the Knight, Space, Wizard and hair sets. They are not required by the in-site layer stack.

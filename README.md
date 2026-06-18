# Joe's Journey — Contact page intro (hosted)

Hosted on GitHub (`jacksonlaptop/joes-journey-code`) and served to Webflow via
jsDelivr. The Contact page only needs ONE `<script>` tag.

## Files to upload — to the repo ROOT (same level as homepage-footer.js)

| File | Upload when |
|------|-------------|
| `contact.js` | every time the intro changes (Claude updates it locally) |
| `dragon-sprite.png` | **once** — the flythrough dragon sprite sheet (**currently missing on the repo — this is why no dragon shows**) |
| `book.json` | **once** — story scene: the animated storybook (your `story icon.lottie`, top-left) |
| `philosopher.png` | **once** — story scene: thinking wizard (bottom-left) |
| `dragon-rest.png` | **once** — story scene: floating dragon (bottom-right) |
| `dragon-happy.png`, `dragon-angry.png` | **once** — story-scene dragon expressions (hover/click) |
| `icon-{phone,linkedin,credits,mail,cv}.png` | **once** — contact-orb default art (cropped: no padding, art to the edge) |
| `icon-{phone,linkedin,credits,mail,cv}-fill.png` | **once** — contact-orb hover/filled art (10 icon files total) |

The contact-page song streams straight from the Webflow CDN — nothing to upload.
`storybook.png` is no longer used.

Upload via GitHub → **Add file → Upload files** → drag the files in → **Commit**.
(This README is local reference only — no need to upload it.)

## Webflow setup (one time)

Contact page → Page Settings → Custom Code → **Before `</body>` tag** — use the
**raw.githack.com** URL (same host as the site's other scripts; jsDelivr cached
stale and its purge endpoint is unreliable):

```html
<script src="https://raw.githack.com/jacksonlaptop/joes-journey-code/main/contact.js"></script>
```

Leave the **Inside `<head>`** box empty — `contact.js` injects its own styles +
`@font-face`. Remove any earlier `head.html`/`body.html` paste so it doesn't double up.

## Updating the animation

1. Claude edits `contact.js` locally and tells you it's ready.
2. Re-upload `contact.js` (+ any changed assets) to the repo.
3. Hard-refresh `/contact`. **No purge step** — githack serves the new commit
   within a few minutes. (If it lags, add `?v=2` to the script src to bust the
   browser cache.)

## Notes

- **Font is self-hosted** here, so the headline always renders — no dependency on
  Webflow's font serving.
- Intro is a fixed full-screen overlay (`z-index:50`). Raise the nav's z-index if
  it should sit on top.
- Scroll is locked; call `window.jjIntro.unlock()` to release it (for the future
  Spacebar / "Play Credits" trigger).
- The dragon is a placeholder — it'll be replaced by the Rive.

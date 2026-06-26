# Joe's Journey — Storytime page (hosted)

Hosted on GitHub (`jacksonlaptop/joes-journey-code`) and served via raw.githack.com,
same as the other scripts. The Storytime page needs ONE `<script>` tag.

## Files to upload — to the repo ROOT (same level as contact.js)

| File | Notes |
|------|-------|
| `storytime.js` | the scene engine (re-upload whenever it changes) |
| `story-nightsky.svg` | tall night-sky backdrop (1629×18691) behind every scene, fit to width |
| `story-bg-1-village.svg` | village — **transparent sky** (night sky shows through) |
| `story-bg-2-tavern.svg` | tavern — interior, opaque (no sky) |
| `story-bg-3-woods.svg` | woods — **transparent sky** |
| `story-bg-4-castle.svg` | castle mountain — **transparent sky** |
| `story-bg-5-cave.svg` | cave — **transparent sky** |
| `story-box.svg` | the empty caption frame (Text Empty.svg) |

The 4 outdoor scenes are transparent-sky cut-outs so `story-nightsky.svg` shows behind them.
When you re-upload any bg/sky SVG, bump `AV` at the top of `storytime.js` (`?a=2` → `?a=3`) so browsers re-fetch it.

The BGs are big (1.4–2.2 MB each). They load once and are cached; if githack feels
slow we can move them to the Webflow CDN and just swap the URLs at the top of `storytime.js`.

## Webflow setup (Storytime page → Page Settings → Custom Code)

**Inside `<head>`** (already added):
```html
<style>.nav-logo-link,.menu-container{opacity:0}</style>
```

**Before `</body>` tag:**
```html
<script src="https://raw.githack.com/jacksonlaptop/joes-journey-code/main/storytime.js"></script>
```

## What it does

- Opens on **black**, then a medieval **torch-light reveal** (a clear circle grows out of the dark) uncovers the cave.
- Site nav drops in from the top + fades after 3s.
- Caption frame + pink progress bar fade in (~2.7s), then the first line types.
- Each line types out (centered), holds long enough to read, then the next types.
- **Backgrounds are triggered mid-line by phrases** (all in the `SCENES` array):
  - "more sinister" → **swipe** cave → village
  - "Luckily one day" → **zoom a hut** + fade → tavern
  - "Joe the Righteous" → **dissolve** → woods
  - "mountains" → **zoom the castle** + fade → castle-mountain
  - 1.5s after "magical Designer" → **fade to black** (caption + bg)

## To tweak

- **Copy / triggers / bg order** all live in the `SCENES` array. Each scene = `{ text, triggers:[{at,run}], end }`.
- **Zoom focal points** (`FOCUS_HUT`, `FOCUS_CASTLE`) are percent-of-frame estimates — nudge to taste.
- **Timings** are in `T = {...}` at the top.
- **Font:** captions use the brand `Joes Journey Headline`.
- Copy is verbatim except `"He he" → "He had"` (clear typo). Scenes 2 & 3 (identical text in the brief) are merged into one line.

# Joe's Journey — Storytime page (hosted)

Hosted on GitHub (`jacksonlaptop/joes-journey-code`) and served via raw.githack.com,
same as the other scripts. The Storytime page needs ONE `<script>` tag.

## Files to upload — to the repo ROOT (same level as contact.js)

| File | Notes |
|------|-------|
| `storytime.js` | the scene engine (re-upload whenever it changes) |
| `story-bg-1-village.svg` | bg 1 — village |
| `story-bg-2-tavern.svg` | bg 2 — tavern |
| `story-bg-3-woods.svg` | bg 3 — woods |
| `story-bg-4-castle.svg` | bg 4 — castle mountain |
| `story-bg-5-cave.svg` | bg 5 — cave |
| `story-box.svg` | the empty caption frame (Text Empty.svg) |

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

- Site nav drops in from the top + fades in after 3s.
- Full-screen background cross-fades through the 5 scenes in order.
- The caption frame fades in after 2s; 3s later the first panel starts typing.
- Each panel types out (centered), holds long enough to read, then the next types.
- A pink progress bar (top) tracks how far through the story you are.

## To finish — copy + checks

- **Copy:** the `Text 1–6.svg` panels are outlined (text → paths), so the copy can't be
  auto-read. Panels 2/3/4 are transcribed from the screenshots; panels **1, 5, 6 are
  placeholders** in `STORY` — paste the real lines there.
- **BG ↔ panel mapping** lives in the `bg:` numbers in `STORY` (0–4). Default guess: 1→village,
  2→village, 3→tavern, 4→woods, 5→castle, 6→cave.
- **Font:** captions use the brand `Joes Journey Headline`. If the panels use a different font, say which.
- **Timings** are at the top of the file (`T = {...}`).

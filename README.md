# Joe's Journey — Storytime page (hosted)

Hosted on GitHub (`jacksonlaptop/joes-journey-code`) and served via raw.githack.com.
The intro is a sequence of **full-screen frames (WebP)** that swap on words as each line types.

## Files to upload — to the repo ROOT (same level as contact.js)

| File | Notes |
|------|-------|
| `storytime.js` | the scene engine (re-upload whenever it changes) |
| `story-cavern-1/2/3.webp` | chapter 1 frames |
| `story-village-1/2/3/4.webp` | chapter 2 frames |
| `story-tavern-1.webp` | chapter 3 |
| `story-woodland-1.webp` | chapter 4 |
| `story-castle-1..6 + 13.webp` | chapter 5 frames |
| `story-box.webp` | the caption frame |
| `story-nightsky.svg` | tall night-sky backdrop — kept for the later scrollable section (hidden behind the opaque frames here) |

All frames are **WebP @ 2400px / q82**, converted from the source SVGs (~95 MB → ~1.7 MB, 98% smaller).
Re-convert with `sharp(src,{density:200}).resize({width:2400}).webp({quality:82})`. Bump `AV` (`?a=3` → `?a=4`) in
`storytime.js` when you re-upload a frame. The old `story-bg-*.svg/.webp` in the repo are unused — safe to delete.

## Webflow setup (Storytime page → Page Settings → Custom Code)

**Inside `<head>`** (already added): `<style>.nav-logo-link,.menu-container{opacity:0}</style>`

**Before `</body>`:** `<script src="https://raw.githack.com/jacksonlaptop/joes-journey-code/main/storytime.js?v=8"></script>`

## How it works

- Opens on black → medieval torch-light reveal of the first frame.
- Each line types out; on certain **words** the full-screen frame **crossfades** to the next (e.g. cavern-1 → "beast" → cavern-2 → "darkness" → cavern-3).
- Nav drops in after 3s; pink progress bar; a loading screen holds until the first frame + box decode; scroll is locked until the final fade-to-black.

## To finish

The `SCENES` array holds each line + its `frame` (opening frame) + `triggers:[{at:word, frame:name}]`.
Cavern is wired (your example). **Still needed:** the trigger word for `village-2/3/4`, the Trogdor frame swap,
and `castle-2..6` + `castle-13` (see the TODO comments in `storytime.js`).
